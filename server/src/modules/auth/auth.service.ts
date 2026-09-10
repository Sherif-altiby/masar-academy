import { randomUUID } from "crypto";
import { Role } from "@prisma/client";

import { prisma } from "../../db";
import { env } from "../../config/env";
import { ApiError } from "../../utils/apiError";
import { getInitials } from "../../utils/initials";
import {
  hashToken,
  parseDurationToMs,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils/password";
import { toPublicUser } from "../users/user.mapper";
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "./auth.validation";

const REFRESH_TOKEN_TTL_MS = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);

/** Parallel /refresh calls often hit the just-rotated token; don't treat that as theft. */
const REFRESH_ROTATION_GRACE_MS = 15_000;

const SESSION_CODES = {
  MISSING: "REFRESH_MISSING",
  INVALID: "REFRESH_INVALID",
  EXPIRED: "REFRESH_EXPIRED",
  CONCURRENT: "REFRESH_CONCURRENT",
  REUSE: "REFRESH_REUSE",
} as const;

function unauthorizedSession(
  message: string,
  code: (typeof SESSION_CODES)[keyof typeof SESSION_CODES],
) {
  return new ApiError(401, message, { code });
}

async function issueTokenPair(userId: string, role: Role) {
  const accessToken = signAccessToken({
    sub: userId,
    role,
  });

  const tokenId = randomUUID();
  const refreshToken = signRefreshToken({
    sub: userId,
    tokenId,
  });

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

async function revokeAllActiveRefreshTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

function wasRotatedRecently(revokedAt: Date | null): boolean {
  if (!revokedAt) return false;
  return Date.now() - revokedAt.getTime() < REFRESH_ROTATION_GRACE_MS;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existing) {
      throw ApiError.conflict("يوجد حساب مسجّل بهذا البريد الإلكتروني بالفعل");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        parentPhone: input.parentPhone,
        studyLanguage: input.studyLanguage,
        educationLevel: input.educationLevel,
        grade: input.grade,
        passwordHash,
        avatarInitials: getInitials(input.fullName),
        role: "STUDENT",
      },
    });

    const tokens = await issueTokenPair(user.id, user.role);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const valid = await comparePassword(input.password, user.passwordHash);

    if (!valid) {
      throw ApiError.unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const tokens = await issueTokenPair(user.id, user.role);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },

  /**
   * Rotate the refresh token (one-time use).
   * - Concurrent double-refresh within a short grace window → soft 401 (no family revoke)
   * - Replaying an old token after that → revoke every active session (theft)
   */
  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw unauthorizedSession(
        "لا توجد جلسة نشطة، يرجى تسجيل الدخول",
        SESSION_CODES.MISSING,
      );
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorizedSession(
        "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى",
        SESSION_CODES.INVALID,
      );
    }

    const tokenHash = hashToken(refreshToken);

    const stored = await prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (
      !stored ||
      stored.userId !== payload.sub ||
      stored.id !== payload.tokenId
    ) {
      throw unauthorizedSession(
        "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى",
        SESSION_CODES.INVALID,
      );
    }

    if (stored.expiresAt < new Date()) {
      throw unauthorizedSession(
        "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى",
        SESSION_CODES.EXPIRED,
      );
    }

    if (stored.revokedAt) {
      // Another /refresh just rotated this token (browser double-call / Postman retry).
      if (stored.replacedByHash && wasRotatedRecently(stored.revokedAt)) {
        throw unauthorizedSession(
          "تم تحديث الجلسة بالفعل، استخدم الكوكي الجديد أو أعد المحاولة",
          SESSION_CODES.CONCURRENT,
        );
      }

      // Same refresh token reused after rotation → likely theft.
      await revokeAllActiveRefreshTokens(stored.userId);
      throw unauthorizedSession(
        "انتهت صلاحية هذه الجلسة لأسباب أمنية، يرجى تسجيل الدخول مرة أخرى",
        SESSION_CODES.REUSE,
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: stored.userId,
      },
    });

    if (!user) {
      throw unauthorizedSession(
        "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى",
        SESSION_CODES.INVALID,
      );
    }

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
    });

    const nextTokenId = randomUUID();
    const nextRefreshToken = signRefreshToken({
      sub: user.id,
      tokenId: nextTokenId,
    });
    const nextTokenHash = hashToken(nextRefreshToken);
    const revokedAt = new Date();

    // Atomic claim: only one concurrent refresh can rotate this row.
    const claimed = await prisma.refreshToken.updateMany({
      where: {
        id: stored.id,
        revokedAt: null,
      },
      data: {
        revokedAt,
        replacedByHash: nextTokenHash,
      },
    });

    if (claimed.count === 0) {
      const latest = await prisma.refreshToken.findUnique({
        where: { id: stored.id },
      });

      if (latest?.replacedByHash && wasRotatedRecently(latest.revokedAt)) {
        throw unauthorizedSession(
          "تم تحديث الجلسة بالفعل، استخدم الكوكي الجديد أو أعد المحاولة",
          SESSION_CODES.CONCURRENT,
        );
      }

      await revokeAllActiveRefreshTokens(stored.userId);
      throw unauthorizedSession(
        "انتهت صلاحية هذه الجلسة لأسباب أمنية، يرجى تسجيل الدخول مرة أخرى",
        SESSION_CODES.REUSE,
      );
    }

    await prisma.refreshToken.create({
      data: {
        id: nextTokenId,
        userId: user.id,
        tokenHash: nextTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken: nextRefreshToken,
    };
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    const tokenHash = hashToken(refreshToken);

    const stored = await prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (
      !stored ||
      stored.userId !== payload.sub ||
      stored.id !== payload.tokenId
    ) {
      return;
    }

    if (!stored.revokedAt) {
      await prisma.refreshToken.update({
        where: {
          id: stored.id,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }
  },

  async changePassword(
    userId: string,
    input: ChangePasswordInput,
    currentRefreshToken?: string,
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.notFound("المستخدم غير موجود");
    }

    const valid = await comparePassword(
      input.currentPassword,
      user.passwordHash,
    );

    if (!valid) {
      throw ApiError.badRequest("كلمة المرور الحالية غير صحيحة");
    }

    const passwordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });

    // Keep this device logged in; revoke every other refresh session.
    let keepTokenId: string | undefined;

    if (currentRefreshToken) {
      try {
        const payload = verifyRefreshToken(currentRefreshToken);
        const tokenHash = hashToken(currentRefreshToken);
        const stored = await prisma.refreshToken.findUnique({
          where: { tokenHash },
        });

        if (
          stored &&
          !stored.revokedAt &&
          stored.userId === userId &&
          stored.id === payload.tokenId
        ) {
          keepTokenId = stored.id;
        }
      } catch {
        // ignore invalid cookie — all sessions will be revoked below
      }
    }

    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(keepTokenId ? { id: { not: keepTokenId } } : {}),
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.notFound("المستخدم غير موجود");
    }

    return toPublicUser(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const existing = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound("المستخدم غير موجود");
    }

    if (input.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (emailTaken) {
        throw ApiError.conflict(
          "يوجد حساب مسجّل بهذا البريد الإلكتروني بالفعل",
        );
      }
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        parentPhone: input.parentPhone,
        studyLanguage: input.studyLanguage,
        educationLevel: input.educationLevel,
        grade: input.grade,
        avatarInitials: getInitials(input.fullName),
      },
    });

    return toPublicUser(user);
  },
};

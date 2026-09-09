import { randomUUID } from "crypto";
import { Role } from "@prisma/client";

import { prisma } from "../../db";
import { env, isProduction } from "../../config/env";
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
import { LoginInput, RegisterInput } from "./auth.validation";

const REFRESH_TOKEN_TTL_MS = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);

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

  async refresh(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى");
    }

    const tokenHash = hashToken(refreshToken);

    const stored = await prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!stored || stored.userId !== payload.sub) {
      throw ApiError.unauthorized("جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى");
    }

    if (stored.revokedAt || stored.expiresAt < new Date()) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: stored.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      throw ApiError.unauthorized(
        "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: stored.userId,
      },
    });

    if (!user) {
      throw ApiError.unauthorized();
    }

    const tokens = await issueTokenPair(user.id, user.role);

    await prisma.refreshToken.update({
      where: {
        id: stored.id,
      },
      data: {
        revokedAt: new Date(),
        replacedByHash: hashToken(tokens.refreshToken),
      },
    });

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;

    const tokenHash = hashToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
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
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_TTL_MS,
};

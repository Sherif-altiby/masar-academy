import { User } from "@prisma/client";

import { LEVEL_ENUM_TO_SLUG } from "../../utils/levelMap";

export function toPublicUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    parentPhone: user.parentPhone,
    level: user.level ? LEVEL_ENUM_TO_SLUG[user.level] : null,
    role: user.role,
    avatarInitials: user.avatarInitials,
    createdAt: user.createdAt,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser>;

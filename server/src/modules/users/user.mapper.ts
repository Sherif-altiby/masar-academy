import { User } from "@prisma/client";

export function toPublicUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    parentPhone: user.parentPhone,
    educationLevel: user.educationLevel,
    grade: user.grade,
    role: user.role,
    avatarInitials: user.avatarInitials,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser>;

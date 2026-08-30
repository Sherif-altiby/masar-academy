import { z } from "zod";

import { LEVEL_SLUGS } from "../../utils/levelMap";

export const registerSchema = z.object({
  fullName: z.string().trim().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().trim().min(8, "رقم الهاتف غير صحيح"),
  parentPhone: z.string().trim().min(8, "رقم هاتف ولي الأمر غير صحيح"),
  level: z.enum(LEVEL_SLUGS, { message: "المرحلة الدراسية غير صحيحة" }),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type LoginInput = z.infer<typeof loginSchema>;

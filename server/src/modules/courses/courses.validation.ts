import { z } from "zod";

import { LEVEL_SLUGS } from "../../utils/levelMap";

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, "عنوان الدورة قصير جدًا"),
  description: z.string().trim().min(10, "وصف الدورة قصير جدًا"),
  subjectId: z.string().uuid("المادة الدراسية غير صحيحة"),
  level: z.enum(LEVEL_SLUGS, { message: "المرحلة الدراسية غير صحيحة" }),
  price: z.coerce.number().int().min(0).default(0),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const courseSlugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

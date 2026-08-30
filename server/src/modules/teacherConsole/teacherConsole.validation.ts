import { z } from "zod";

const optionSchema = z
  .object({
    text: z.string().trim().optional(),
    imageUrl: z.string().trim().optional(),
  })
  .refine((o) => (o.text && o.text.length > 0) || (o.imageUrl && o.imageUrl.length > 0), {
    message: "كل اختيار يجب أن يحتوي على نص أو صورة على الأقل",
  });

const questionSchema = z.object({
  question: z.string().trim().min(1, "نص السؤال مطلوب"),
  imageUrl: z.string().trim().optional(),
  contentType: z.enum(["AR", "EN", "CODE"]).default("AR"),
  codeLanguage: z.enum(["PYTHON", "JAVASCRIPT"]).optional(),
  options: z.array(optionSchema).min(2, "أضف اختيارين على الأقل"),
  correctIndex: z.number().int().min(0),
});

export const upsertQuizSchema = z.object({
  durationMinutes: z.coerce.number().int().min(1).max(120),
  questions: z.array(questionSchema).min(1, "أضف سؤالًا واحدًا على الأقل"),
});
export type UpsertQuizInput = z.infer<typeof upsertQuizSchema>;

export const createLessonSchema = z.object({
  title: z.string().trim().min(3, "عنوان الدرس قصير جدًا"),
  description: z.string().trim().min(5, "وصف الدرس قصير جدًا"),
  videoUrl: z.string().trim().min(1, "رابط الفيديو مطلوب"),
  duration: z.string().trim().optional(),
  order: z.coerce.number().int().min(1).optional(),
  isFree: z.coerce.boolean().default(false),
});
export type CreateLessonInput = z.infer<typeof createLessonSchema>;

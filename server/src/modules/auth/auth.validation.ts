import { z } from "zod";

const studyLanguages = ["AR", "EN"] as const;

const educationLevels = ["PREPARATORY", "SECONDARY", "BACCALAUREATE"] as const;

const grades = [
  // Preparatory
  "PREP_1",
  "PREP_2",
  "PREP_3",

  // Secondary
  "SEC_1",
  "SEC_2",
  "SEC_3_MATH",
  "SEC_3_SCIENCE",
  "SEC_3_LITERATURE",

  // Baccalaureate
  "BAC_1",
  "BAC_2_ENGINEERING_CS",
  "BAC_2_MEDICINE_LIFE",
  "BAC_2_BUSINESS",
  "BAC_2_ARTS",
] as const;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),

    email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),

    phone: z.string().trim().min(8, "رقم الهاتف غير صحيح"),

    parentPhone: z.string().trim().min(8, "رقم هاتف ولي الأمر غير صحيح"),

    studyLanguage: z.enum(studyLanguages, {
      message: "لغة الدراسة غير صحيحة",
    }),

    educationLevel: z.enum(educationLevels, {
      message: "المرحلة الدراسية غير صحيحة",
    }),

    grade: z.enum(grades, {
      message: "الصف الدراسي غير صحيح",
    }),

    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  })
  .superRefine((data, ctx) => {
    const validGrades = {
      PREPARATORY: ["PREP_1", "PREP_2", "PREP_3"],
      SECONDARY: [
        "SEC_1",
        "SEC_2",
        "SEC_3_MATH",
        "SEC_3_SCIENCE",
        "SEC_3_LITERATURE",
      ],
      BACCALAUREATE: [
        "BAC_1",
        "BAC_2_ENGINEERING_CS",
        "BAC_2_MEDICINE_LIFE",
        "BAC_2_BUSINESS",
        "BAC_2_ARTS",
      ],
    };

    if (!validGrades[data.educationLevel].includes(data.grade)) {
      ctx.addIssue({
        code: "custom",
        path: ["grade"],
        message: "الصف الدراسي لا يتوافق مع المرحلة الدراسية",
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),

  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;

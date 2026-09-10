export const STUDY_LANGUAGE_OPTIONS = [
  { value: "AR", label: "العربية" },
  { value: "EN", label: "English" },
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "PREPARATORY", label: "المرحلة الإعدادية" },
  { value: "SECONDARY", label: "الثانوية العامة" },
  { value: "BACCALAUREATE", label: "البكالوريا" },
] as const;

export const GRADE_OPTIONS = {
  PREPARATORY: [
    { value: "PREP_1", label: "الصف الأول الإعدادي" },
    { value: "PREP_2", label: "الصف الثاني الإعدادي" },
    { value: "PREP_3", label: "الصف الثالث الإعدادي" },
  ],
  SECONDARY: [
    { value: "SEC_1", label: "الصف الأول الثانوي" },
    { value: "SEC_2", label: "الصف الثاني الثانوي" },
    { value: "SEC_3_MATH", label: "الصف الثالث الثانوي - علمي رياضة" },
    { value: "SEC_3_SCIENCE", label: "الصف الثالث الثانوي - علمي علوم" },
    { value: "SEC_3_LITERATURE", label: "الصف الثالث الثانوي - أدبي" },
  ],
  BACCALAUREATE: [
    { value: "BAC_1", label: "الصف الأول بكالوريا" },
    {
      value: "BAC_2_ENGINEERING_CS",
      label: "الصف الثاني بكالوريا - هندسة وعلوم الحاسب",
    },
    {
      value: "BAC_2_MEDICINE_LIFE",
      label: "الصف الثاني بكالوريا - طب وعلوم الحياة",
    },
    { value: "BAC_2_BUSINESS", label: "الصف الثاني بكالوريا - الأعمال" },
    { value: "BAC_2_ARTS", label: "الصف الثاني بكالوريا - آداب وفنون" },
  ],
} as const;

export type EducationLevel = keyof typeof GRADE_OPTIONS;

export function getGradeLabel(grade: string | null | undefined) {
  if (!grade) return undefined;
  return (
    Object.values(GRADE_OPTIONS).flat() as { value: string; label: string }[]
  ).find((option) => option.value === grade)?.label;
}

export function getEducationLevelLabel(level: string | null | undefined) {
  return EDUCATION_LEVEL_OPTIONS.find((option) => option.value === level)
    ?.label;
}

export function getStudyLanguageLabel(language: string | null | undefined) {
  return STUDY_LANGUAGE_OPTIONS.find((option) => option.value === language)
    ?.label;
}

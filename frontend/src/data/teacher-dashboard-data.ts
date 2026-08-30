// Sample chart data for visuals that don't yet have a backing analytics
// endpoint (student-growth history, weekly quiz performance, course
// completion rate, content mix). Real stats — total students, course count,
// lesson count, and rating — come from the API via useMyTeacherProfile()
// and useMyCourses() in src/hooks/use-teacher-console.ts.

export interface MonthlyStudents {
  month: string;
  students: number;
}

export const STUDENT_GROWTH: MonthlyStudents[] = [
  { month: "فبراير", students: 780 },
  { month: "مارس", students: 890 },
  { month: "أبريل", students: 1010 },
  { month: "مايو", students: 1180 },
  { month: "يونيو", students: 1320 },
  { month: "يوليو", students: 1450 },
];

export interface QuizPerformance {
  week: string;
  averageScore: number;
}

export const QUIZ_PERFORMANCE: QuizPerformance[] = [
  { week: "الأسبوع 1", averageScore: 72 },
  { week: "الأسبوع 2", averageScore: 76 },
  { week: "الأسبوع 3", averageScore: 74 },
  { week: "الأسبوع 4", averageScore: 81 },
  { week: "الأسبوع 5", averageScore: 85 },
  { week: "الأسبوع 6", averageScore: 88 },
];

export const TOTAL_VIDEO_VIEWS = 18400;
export const QUIZ_COMPLETION_RATE = 87;

export interface CourseCompletion {
  courseTitle: string;
  completionRate: number;
}

export const COURSE_COMPLETION: CourseCompletion[] = [
  { courseTitle: "أساسيات الجبر", completionRate: 78 },
  { courseTitle: "أساسيات الهندسة", completionRate: 65 },
];

export interface ContentMixSlice {
  label: string;
  value: number;
  colorVar: string;
}

export const CONTENT_MIX: ContentMixSlice[] = [
  { label: "فيديو + PDF + اختبار", value: 5, colorVar: "var(--chart-1)" },
  { label: "فيديو + PDF فقط", value: 6, colorVar: "var(--chart-2)" },
  { label: "فيديو فقط", value: 2, colorVar: "var(--chart-5)" },
];

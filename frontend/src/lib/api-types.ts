export type ApiRole = "STUDENT" | "TEACHER";

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  parentPhone: string | null;
  educationLevel: string | null;
  grade: string | null;
  role: ApiRole;
  avatarInitials: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface ApiCourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  level: string;
  price: number;
  isFree: boolean;
  rating: number;
  studentCount: number;
  lessonCount: number;
}

export interface ApiLessonSummary {
  id: string;
  title: string;
  order: number;
  duration: string;
  isFree: boolean;
  description: string;
  videoId: string;
  hasPdf: boolean;
  pdfPages: number | null;
  hasQuiz: boolean;
  quizDurationSeconds: number | null;
  isCompleted: boolean;
}

export interface ApiCourseDetail extends ApiCourseSummary {
  teacherName: string;
  teacherSlug: string;
  isEnrolled: boolean;
  progress: number;
  lessons: ApiLessonSummary[];
}

export interface ApiCourseEnrollmentResponse {
  courseId: string;
  enrollmentId: string;
  isEnrolled: true;
  progress: number;
  completedLessonIds: string[];
}

export interface ApiLessonDetail extends ApiLessonSummary {
  courseId: string;
  pdfUrl: string | null;
  course: { id: string; slug: string; title: string } | undefined;
}

export type ApiContentType = "AR" | "CODE";
export type ApiCodeLanguage = "PYTHON" | "JAVASCRIPT";

export interface ApiQuizOptionForTaking {
  id: string;
  text: string | null;
  imageUrl: string | null;
  order: number;
}

export interface ApiQuizQuestionForTaking {
  id: string;
  question: string;
  imageUrl: string | null;
  contentType: ApiContentType;
  codeLanguage: ApiCodeLanguage | null;
  options: ApiQuizOptionForTaking[];
}

export interface ApiQuizForTaking {
  lessonId: string;
  lessonTitle: string;
  durationSeconds: number;
  questions: ApiQuizQuestionForTaking[];
}

export interface ApiQuizAttemptAnswer {
  questionId: string;
  optionIndex: number;
}

export interface ApiQuizAttemptResult {
  questionId: string;
  correctOptionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
}

export interface ApiQuizAttemptResponse {
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: ApiQuizAttemptResult[];
}

export interface ApiLessonCompletionResponse {
  lessonId: string;
  isCompleted: true;
  progress: number;
  nextLesson: { id: string; order: number } | null;
}

export interface ApiTeacherProfile {
  id: string;
  slug: string;
  title: string;
  subjectId: string;
  subjectName: string;
  yearsExperience: number;
  about: string;
  credentials: string[];
  rating: number;
  reviewCount: number;
  studentCount: number;
}

export interface ApiTeacherOwnCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
  price: number;
  rating: number;
  studentCount: number;
  lessonCount: number;
}

export interface ApiTeacherOwnLesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  duration: string;
  isFree: boolean;
  description: string;
  videoId: string;
  hasPdf: boolean;
  pdfUrl: string | null;
  pdfPages: number | null;
  hasQuiz: boolean;
  quizDurationSeconds: number | null;
}

export interface ApiTeacherOwnCourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  studentCount: number;
  lessons: ApiTeacherOwnLesson[];
}

export interface ApiTeacherQuizOption {
  id: string;
  text: string | null;
  imageUrl: string | null;
  order: number;
}

export interface ApiTeacherQuizQuestion {
  id: string;
  question: string;
  imageUrl: string | null;
  contentType: ApiContentType;
  codeLanguage: ApiCodeLanguage | null;
  correctIndex: number;
  order: number;
  options: ApiTeacherQuizOption[];
}

export interface ApiTeacherQuiz {
  lessonId: string;
  lessonTitle: string;
  durationMinutes: number;
  questions: ApiTeacherQuizQuestion[];
}

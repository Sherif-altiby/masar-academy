export type ApiRole = "STUDENT" | "TEACHER";

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  parentPhone: string | null;
  studyLanguage: "AR" | "EN" | null;
  educationLevel: "PREPARATORY" | "SECONDARY" | "BACCALAUREATE" | null;
  grade: string | null;
  role: ApiRole;
  avatarInitials: string;
  createdAt: string;
}

export interface ApiSubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  courseCount: number;
  studentCount: number;
}

export interface ApiTeacherSummary {
  id: string;
  name: string;
  slug: string;
  avatarInitials: string;
  title: string;
  subjectId: string;
  subjectName: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
}

export interface ApiTeacherDetail extends ApiTeacherSummary {
  about: string;
  credentials: string[];
  courses: {
    id: string;
    slug: string;
    title: string;
    description: string;
    lessonCount: number;
    studentCount: number;
    rating: number;
  }[];
  reviews: {
    id: string;
    studentName: string;
    rating: number;
    comment: string | null;
    date: string;
  }[];
}

export interface ApiCourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  level: string;
  price: number;
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
}

export interface ApiCourseDetail extends ApiCourseSummary {
  teacherName: string;
  teacherSlug: string;
  lessons: ApiLessonSummary[];
}

export interface ApiLessonDetail extends ApiLessonSummary {
  courseId: string;
  pdfUrl: string | null;
  course: { id: string; slug: string; title: string } | undefined;
}

export type ApiContentType = "AR" | "EN" | "CODE";
export type ApiCodeLanguage = "PYTHON" | "JAVASCRIPT";

export interface ApiQuizOptionForTaking {
  id: string;
  text: string | null;
  imageUrl: string | null;
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

export type Level =
  | "primary-5"
  | "primary-6"
  | "prep-1"
  | "prep-2"
  | "prep-3"
  | "sec-1"
  | "sec-2"
  | "sec-3";

export interface LevelOption {
  value: Level;
  label: string;
}

export const LEVEL_OPTIONS: LevelOption[] = [
  { value: "primary-5", label: "الصف الخامس الابتدائي" },
  { value: "primary-6", label: "الصف السادس الابتدائي" },
  { value: "prep-1", label: "الصف الأول الإعدادي" },
  { value: "prep-2", label: "الصف الثاني الإعدادي" },
  { value: "prep-3", label: "الصف الثالث الإعدادي" },
  { value: "sec-1", label: "الصف الأول الثانوي" },
  { value: "sec-2", label: "الصف الثاني الثانوي" },
  { value: "sec-3", label: "الصف الثالث الثانوي" },
];

export interface Subject {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  color: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";
  courseCount: number;
  studentCount: number;
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Teacher {
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
  about: string;
  credentials: string[];
  reviews: Review[];
}

/** Determines both text direction and font styling for a question. */
export type QuestionContentType = "ar" | "en" | "code";
export type CodeLanguage = "python" | "javascript";

export interface QuizOption {
  text?: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  /** Optional image shown above/alongside the question text. */
  imageUrl?: string;
  /** Controls direction (rtl/ltr) and font (Arabic/Latin/monospace). Defaults to "ar". */
  contentType?: QuestionContentType;
  /** Only used when contentType is "code" — shown as a small language badge. */
  codeLanguage?: CodeLanguage;
  options: QuizOption[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: string;
  isFree: boolean;
  description: string;
  /** YouTube video ID powering the lesson's main video player */
  videoId: string;
  /** Optional downloadable PDF material for this lesson */
  hasPdf?: boolean;
  pdfPages?: number;
  /** Optional quiz attached to this lesson */
  hasQuiz?: boolean;
  quiz?: QuizQuestion[];
  /** Time limit for the quiz, in seconds */
  quizDurationSeconds?: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subjectId: string;
  teacherId: string;
  level: Level;
  description: string;
  lessonCount: number;
  studentCount: number;
  rating: number;
  price: number;
  lessons: Lesson[];
}

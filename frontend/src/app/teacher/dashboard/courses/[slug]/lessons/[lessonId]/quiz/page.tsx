"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { QuizBuilderForm } from "@/components/teacher/quiz-builder-form";
import {
  useMyCourse,
  useMyLessonQuiz,
  useUploadImage,
  useUpsertQuiz,
} from "@/hooks/use-teacher-console";

export default function LessonQuizPage() {
  const router = useRouter();
  const params = useParams<{ slug: string; lessonId: string }>();
  const { data: course } = useMyCourse(params.slug);
  const { data: quiz, isLoading } = useMyLessonQuiz(params.lessonId);
  const uploadImage = useUploadImage();
  const upsertQuiz = useUpsertQuiz(params.lessonId, params.slug);

  const lesson = course?.lessons.find((l) => l.id === params.lessonId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/teacher/dashboard/courses/${params.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> {course?.title ?? "الدورة"}
      </Link>

      <div>
        <p className="text-sm font-semibold text-primary">
          {lesson?.hasQuiz ? "تعديل الاختبار" : "إضافة اختبار"}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson?.title ?? "الدرس"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          أضف الأسئلة، حدد الإجابة الصحيحة لكل سؤال، وضع مدة زمنية للاختبار.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <QuizBuilderForm
          initialQuestions={quiz?.questions}
          initialDurationMinutes={quiz?.durationMinutes ?? 3}
          uploadImage={(file) => uploadImage.mutateAsync(file)}
          onSubmit={async (payload) => {
            await upsertQuiz.mutateAsync(payload);
            router.push(`/teacher/dashboard/courses/${params.slug}`);
          }}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuizRunner } from "@/components/shared/quiz-runner";
import { useQuizForTaking, useSubmitQuizAttempt } from "@/hooks/use-lessons";
import { useCourse } from "@/hooks/use-courses";
import { useAuth } from "@/providers/auth-provider";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

export default function QuizPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const { isAuthenticated, status } = useAuth();
  const { data: quiz, isLoading, isError } = useQuizForTaking(params.lessonId);
  const { data: course } = useCourse(params.slug);
  const submitAttempt = useSubmitQuizAttempt(params.lessonId);

  if (status !== "loading" && !isAuthenticated) {
    if (typeof window !== "undefined") router.replace("/login");
    return null;
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-medium">تعذّر تحميل هذا الاختبار</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/courses/${params.slug}/lessons/${params.lessonId}`}>
            العودة إلى الدرس
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href={`/courses/${params.slug}/lessons/${params.lessonId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> {quiz.lessonTitle}
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {quiz.lessonTitle}
      </h1>
      <p className="mt-2 text-muted-foreground">
        أجب عن كل الأسئلة قبل نفاد الوقت، ثم أرسل إجاباتك لترى درجتك
        والإجابات الصحيحة.
      </p>

      <div className="mt-8">
        <QuizRunner
          quiz={quiz}
          courseSlug={params.slug}
          courseTitle={course?.title ?? quiz.lessonTitle}
          onSubmit={(payload) =>
            submitAttempt.mutateAsync(payload).catch((error) => {
              toast.error(getApiErrorMessage(error, "تعذّر إرسال الاختبار"));
              throw error;
            })
          }
        />
      </div>
    </section>
  );
}

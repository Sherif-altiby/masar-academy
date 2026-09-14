"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { YoutubePlayer } from "@/components/shared/youtube-player";
import { useCourse } from "@/hooks/use-courses";
import { useCompleteLesson, useLesson } from "@/hooks/use-lessons";
import { API_BASE_URL } from "@/lib/env";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useAuth } from "@/providers/auth-provider";

export default function LessonPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const { isStudent } = useAuth();
  const { data: course } = useCourse(params.slug);
  const { data: lesson, isLoading, isError } = useLesson(params.lessonId);
  const completeLesson = useCompleteLesson(params.lessonId);

  function handleComplete() {
    completeLesson.mutate(undefined, {
      onSuccess: (result) => {
        if (result.nextLesson) {
          router.push(`/courses/${params.slug}/lessons/${result.nextLesson.id}`);
        } else {
          router.push(`/courses/${params.slug}`);
        }
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "تعذّر إكمال الدرس"));
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !lesson || !course) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-medium">تعذّر العثور على هذا الدرس</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/courses/${params.slug}`}>العودة إلى الدورة</Link>
        </Button>
      </div>
    );
  }

  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = course.lessons[lessonIndex - 1];
  const nextLesson = course.lessons[lessonIndex + 1];
  const quizMinutes = lesson.quizDurationSeconds
    ? Math.round(lesson.quizDurationSeconds / 60)
    : 0;
  const pdfHref = lesson.pdfUrl?.startsWith("http")
    ? lesson.pdfUrl
    : `${API_BASE_URL.replace(/\/api$/, "")}${lesson.pdfUrl ?? ""}`;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href={`/courses/${course.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> {course.title}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">
          الدرس {lesson.order} من {course.lessonCount}
        </Badge>
        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
      </div>

      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {lesson.title}
      </h1>
      <p className="mt-2 text-muted-foreground">{lesson.description}</p>

      {/* Video — always the primary content of a lesson */}
      <div className="mt-8">
        <YoutubePlayer videoId={lesson.videoId} title={lesson.title} />
      </div>

      {/* Optional attachments: PDF and/or quiz */}
      {(lesson.hasPdf || lesson.hasQuiz) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lesson.hasPdf && (
            <Card className="items-center gap-3 p-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-6" />
              </span>
              <div>
                <p className="font-medium">{lesson.title}.pdf</p>
                <p className="text-sm text-muted-foreground">
                  {lesson.pdfPages} صفحة · ملخص الدرس
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" asChild>
                  <a href={pdfHref} target="_blank" rel="noreferrer">
                    <FileText /> فتح الملف
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={pdfHref} download>
                    <Download /> تحميل
                  </a>
                </Button>
              </div>
            </Card>
          )}

          {lesson.hasQuiz && (
            <Card className="items-center gap-3 p-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <HelpCircle className="size-6" />
              </span>
              <div>
                <p className="font-medium">اختبار الدرس</p>
                <p className="text-sm text-muted-foreground">
                  {quizMinutes > 0
                    ? `مدة الاختبار ${quizMinutes} ${
                        quizMinutes === 1 ? "دقيقة" : "دقائق"
                      }`
                    : "تحقق من فهمك لهذا الدرس"}
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href={`/courses/${course.slug}/lessons/${lesson.id}/quiz`}>
                  ابدأ الاختبار <ArrowLeft />
                </Link>
              </Button>
            </Card>
          )}
        </div>
      )}

      {isStudent && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleComplete}
            disabled={lesson.isCompleted || completeLesson.isPending}
            className="min-w-52"
          >
            {completeLesson.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 />
            )}
            {lesson.isCompleted ? "تم إكمال الدرس" : "تحديد الدرس كمكتمل"}
          </Button>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        {prevLesson ? (
          <Button variant="ghost" asChild>
            <Link href={`/courses/${course.slug}/lessons/${prevLesson.id}`}>
              <ArrowRight /> {prevLesson.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Button variant="ghost" asChild>
            <Link href={`/courses/${course.slug}/lessons/${nextLesson.id}`}>
              {nextLesson.title} <ArrowLeft />
            </Link>
          </Button>
        ) : (
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" /> آخر درس في هذه الدورة
          </span>
        )}
      </div>
    </section>
  );
}

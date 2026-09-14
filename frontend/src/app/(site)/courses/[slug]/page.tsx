"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  PlayCircle,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/shared/star-rating";
import { useCourse, useEnrollCourse } from "@/hooks/use-courses";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const { isStudent } = useAuth();
  const { data: course, isLoading, isError } = useCourse(params.slug);
  const enrollCourse = useEnrollCourse(params.slug);

  if (isLoading) {
    return <CoursePageSkeleton />;
  }

  if (isError || !course) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <BookOpen className="size-6" />
        </div>

        <h1 className="mt-5 text-lg font-semibold">
          تعذّر العثور على هذه الدورة
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          قد تكون الدورة غير متاحة حاليًا أو تم نقلها إلى مكان آخر.
        </p>

        <Button variant="outline" className="mt-5" asChild>
          <Link href="/subjects">
            تصفّح المواد الدراسية
            <ArrowLeft className="mr-2 size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const completedCount = course.lessons.filter((lesson) => lesson.isCompleted).length;
  const progress = course.progress;

  function handleEnroll() {
    enrollCourse.mutate(undefined, {
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "تعذّر الاشتراك في الدورة"));
      },
    });
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/subjects"
          className="transition-colors hover:text-foreground"
        >
          المواد الدراسية
        </Link>

        <span>/</span>

        <Link
          href={`/teachers/${course.teacherSlug}`}
          className="transition-colors hover:text-foreground"
        >
          {course.teacherName}
        </Link>

        <span>/</span>

        <span className="truncate text-foreground">{course.title}</span>
      </div>

      {/* Course Hero */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-5 py-6 sm:px-8 sm:py-8">
          <div className="max-w-3xl">
            <Link
              href={`/teachers/${course.teacherSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
            >
              {course.teacherName}
              <ArrowLeft className="size-3.5" />
            </Link>

            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {course.title}
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              {course.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <StarRating value={course.rating} size={15} />
                <span className="font-semibold">
                  {course.rating.toFixed(1)}
                </span>
              </div>

              <div className="h-4 w-px bg-border" />

              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-4" />
                {course.studentCount.toLocaleString()} طالب مسجّل
              </span>

              <div className="h-4 w-px bg-border" />

              <span className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="size-4" />
                {course.lessonCount} درس
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span className="text-sm font-semibold">تقدّمك في الدورة</span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                استمر في التعلّم وأكمل دروسك بالترتيب.
              </p>
            </div>

            <span className="text-sm font-medium">
              {completedCount} / {course.lessonCount}
            </span>
          </div>

          {isStudent && !course.isEnrolled && course.isFree && (
            <Button
              className="mt-5 w-full sm:w-auto"
              onClick={handleEnroll}
              disabled={enrollCourse.isPending || !course.isFree}
            >
              {enrollCourse.isPending ? "جارٍ الاشتراك..." : "اشترك مجانًا"}
            </Button>
          )}

          {isStudent && course.isEnrolled && (
            <p className="mt-4 text-sm font-medium text-primary">
              أنت مشترك في هذه الدورة ويمكنك فتح جميع الدروس.
            </p>
          )}

          <Progress value={progress} className="mt-4 h-2"  />

          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{progress}% مكتمل</span>
            <span>{course.lessonCount - completedCount} دروس متبقية</span>
          </div>
        </div>
      </Card>

      {/* Lessons */}
      <div className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">محتوى الدورة</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              الدروس
            </h2>
          </div>

          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {course.lessonCount} درس
          </span>
        </div>

        <div className="space-y-3">
          {course.lessons.map((lesson) => {
            const isCompleted = lesson.isCompleted;

            const content = (
              <Card
                className={cn(
                  "group relative overflow-hidden transition-all duration-200",
                  isCompleted
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                  {/* Lesson Number */}
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      String(lesson.order).padStart(2, "0")
                    )}
                  </span>

                  {/* Lesson Icon */}
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      "bg-primary/10 text-primary"
                    )}
                  >
                    <PlayCircle className="size-4" />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium transition-colors group-hover:text-primary">
                        {lesson.title}
                      </p>

                      {lesson.isFree && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-medium"
                        >
                          مجاني
                        </Badge>
                      )}

                      {isCompleted && (
                        <Badge
                          variant="default"
                          className="gap-1 text-[10px] font-medium"
                        >
                          <CheckCircle2 className="size-3" />
                          مكتمل
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                    <div className="flex items-center gap-1.5">
                      {lesson.hasPdf && (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[10px]"
                        >
                          <FileText className="size-3" />
                          PDF
                        </Badge>
                      )}

                      {lesson.hasQuiz && (
                        <Badge
                          variant="accent"
                          className="gap-1 text-[10px]"
                        >
                          <HelpCircle className="size-3" />
                          اختبار
                        </Badge>
                      )}
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {lesson.duration}
                    </span>
                  </div>

                  <ArrowLeft
                    className={cn(
                      "hidden size-4 shrink-0 transition-all sm:block",
                      "text-muted-foreground group-hover:-translate-x-1 group-hover:text-primary"
                    )}
                  />
                </div>

                {/* Mobile Meta */}
                <div className="flex items-center justify-between border-t px-4 py-2.5 sm:hidden">
                  <div className="flex items-center gap-1.5">
                    {lesson.hasPdf && (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-[10px]"
                      >
                        <FileText className="size-3" />
                        PDF
                      </Badge>
                    )}

                    {lesson.hasQuiz && (
                      <Badge
                        variant="accent"
                        className="gap-1 text-[10px]"
                      >
                        <HelpCircle className="size-3" />
                        اختبار
                      </Badge>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {lesson.duration}
                  </span>
                </div>
              </Card>
            );

            return course.isEnrolled ? (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}/lessons/${lesson.id}`}
                className="block"
              >
                {content}
              </Link>
            ) : (
              <div
                key={lesson.id}
                className="cursor-not-allowed opacity-60"
                title="اشترك في الدورة لفتح الدروس"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

function CoursePageSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-5 py-6 sm:px-8 sm:py-8">
          <Skeleton className="h-4 w-32" />

          <Skeleton className="mt-4 h-10 w-full max-w-2xl sm:h-11" />

          <Skeleton className="mt-4 h-4 w-full max-w-xl" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-lg" />

          <div className="mt-5 flex flex-wrap gap-5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Progress Skeleton */}
        <div className="px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-48" />
            </div>

            <Skeleton className="h-4 w-12" />
          </div>

          <Skeleton className="mt-4 h-2 w-full rounded-full" />

          <div className="mt-2 flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </Card>

      {/* Lessons Header */}
      <div className="mb-5 mt-10 flex items-end justify-between">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-7 w-20" />
        </div>

        <Skeleton className="h-7 w-16 rounded-full" />
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <Skeleton className="size-10 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-2/3 max-w-64" />
                <Skeleton className="mt-2 h-3 w-full max-w-80" />
              </div>

              <div className="hidden flex-col items-end gap-2 sm:flex">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>

              <Skeleton className="hidden size-4 shrink-0 sm:block" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
 
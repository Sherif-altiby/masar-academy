"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, HelpCircle, Loader2, Lock, PlayCircle, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/shared/star-rating";
import { useCourse } from "@/hooks/use-courses";
import { cn } from "@/lib/utils";

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const { data: course, isLoading, isError } = useCourse(params.slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-medium">تعذّر العثور على هذه الدورة</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/subjects">تصفّح المواد الدراسية</Link>
        </Button>
      </div>
    );
  }

  const completedCount = 1; // sample progress — no enrollment/progress endpoint yet

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <Link
          href={`/teachers/${course.teacherSlug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {course.teacherName}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{course.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <StarRating value={course.rating} size={15} />
            <span className="font-medium">{course.rating.toFixed(1)}</span>
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-4" /> {course.studentCount.toLocaleString()}{" "}
            طالب مسجّل
          </span>
        </div>
      </div>

      <Card className="mt-8 gap-2 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">تقدّمك</span>
          <span className="text-muted-foreground">
            {completedCount} / {course.lessonCount} دروس
          </span>
        </div>
        <Progress value={(completedCount / course.lessonCount) * 100} />
      </Card>

      <div className="mt-10 space-y-3">
        <h2 className="font-display text-xl font-semibold">الدروس</h2>
        <div className="space-y-3">
          {course.lessons.map((lesson) => {
            const locked = !lesson.isFree && lesson.order > 2;

            const content = (
              <Card
                className={cn(
                  "flex-row items-center gap-4 p-4 transition-all duration-200",
                  !locked && "hover:-translate-y-0.5 hover:shadow-md"
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground">
                  {String(lesson.order).padStart(2, "0")}
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {locked ? (
                    <Lock className="size-4" />
                  ) : (
                    <PlayCircle className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {lesson.hasPdf && (
                      <Badge variant="secondary" className="gap-1">
                        <FileText className="size-3" /> PDF
                      </Badge>
                    )}
                    {lesson.hasQuiz && (
                      <Badge variant="accent" className="gap-1">
                        <HelpCircle className="size-3" /> اختبار
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {lesson.duration}
                  </span>
                </div>
              </Card>
            );

            return locked ? (
              <div key={lesson.id} className="cursor-not-allowed opacity-60">
                {content}
              </div>
            ) : (
              <Link key={lesson.id} href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

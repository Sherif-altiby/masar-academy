"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  FileText,
  HelpCircle,
  Loader2,
  PlayCircle,
  PlusCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMyCourse } from "@/hooks/use-teacher-console";

export default function ManageCourseLessonsPage() {
  const params = useParams<{ slug: string }>();
  const { data: course, isLoading, isError } = useMyCourse(params.slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="font-medium">تعذّر العثور على هذه الدورة</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/teacher/dashboard/courses">العودة إلى دوراتي</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/teacher/dashboard/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> دوراتي
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">إدارة الدروس</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {course.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.lessons.length} دروس · {course.studentCount.toLocaleString()} طالب
          </p>
        </div>
        <Button asChild>
          <Link href={`/teacher/dashboard/courses/${course.slug}/lessons/new`}>
            <PlusCircle /> إضافة درس
          </Link>
        </Button>
      </div>

      {course.lessons.length === 0 && (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">لا توجد دروس بعد في هذه الدورة</p>
          <Button className="mt-4" asChild>
            <Link href={`/teacher/dashboard/courses/${course.slug}/lessons/new`}>
              <PlusCircle /> إضافة أول درس
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {course.lessons.map((lesson) => (
          <Card key={lesson.id} className="gap-3 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground">
                {String(lesson.order).padStart(2, "0")}
              </span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PlayCircle className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{lesson.title}</p>
                <p className="text-sm text-muted-foreground">
                  {lesson.duration}
                  {lesson.isFree && " · درس مجاني"}
                </p>
              </div>
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
            </div>

            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={`/teacher/dashboard/courses/${course.slug}/lessons/${lesson.id}/pdf`}
                >
                  <FileText />
                  {lesson.hasPdf ? "تعديل الملف" : "إضافة PDF"}
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={`/teacher/dashboard/courses/${course.slug}/lessons/${lesson.id}/quiz`}
                >
                  <HelpCircle />
                  {lesson.hasQuiz ? "تعديل الاختبار" : "إضافة اختبار"}
                </Link>
              </Button>
              <Button size="sm" variant="ghost" className="ms-auto" asChild>
                <Link href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                  معاينة كطالب
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

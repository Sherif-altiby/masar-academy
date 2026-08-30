"use client";

import Link from "next/link";
import { BookOpen, FileText, HelpCircle, Loader2, PlusCircle, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";
import { useMyCourses } from "@/hooks/use-teacher-console";
import { LEVEL_OPTIONS } from "@/types";

function levelLabel(value: string) {
  return LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export default function TeacherCoursesPage() {
  const { data: courses, isLoading } = useMyCourses();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">إدارة الدورات</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            دوراتي
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/teacher/dashboard/pdf/new">
              <FileText /> إضافة PDF لدرس
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher/dashboard/quiz/new">
              <HelpCircle /> إنشاء اختبار
            </Link>
          </Button>
          <Button asChild>
            <Link href="/teacher/dashboard/courses/new">
              <PlusCircle /> إضافة دورة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-semibold">
                    {course.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {levelLabel(course.level)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3.5" /> {course.lessonCount} دروس
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />{" "}
                  {course.studentCount.toLocaleString()} طالب
                </span>
                <span className="flex items-center gap-1">
                  <StarRating value={course.rating} size={12} />
                  {course.rating.toFixed(1)}
                </span>
              </div>

              <div className="pt-1">
                <Button size="sm" className="w-full" asChild>
                  <Link href={`/teacher/dashboard/courses/${course.slug}`}>
                    إدارة الدروس
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {courses && courses.length === 0 && (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">لا توجد دورات بعد</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ابدأ بإنشاء أول دورة لك.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/teacher/dashboard/courses/new">
              <PlusCircle /> إضافة دورة جديدة
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

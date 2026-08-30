"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PdfUploadForm } from "@/components/teacher/pdf-upload-form";
import {
  useMyCourse,
  useMyCourses,
  useUploadLessonPdf,
} from "@/hooks/use-teacher-console";

export default function AddPdfPage() {
  const router = useRouter();
  const { data: courses, isLoading } = useMyCourses();

  const [courseSlug, setCourseSlug] = React.useState("");
  const [lessonId, setLessonId] = React.useState("");

  const { data: course } = useMyCourse(courseSlug || undefined);
  const uploadPdf = useUploadLessonPdf(courseSlug);
  const lesson = course?.lessons.find((l) => l.id === lessonId);

  function handleCourseChange(value: string) {
    setCourseSlug(value);
    setLessonId("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/teacher/dashboard/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> دوراتي
      </Link>

      <div>
        <p className="text-sm font-semibold text-primary">ملفات الدروس</p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          <FileText className="size-6 text-primary" /> إضافة PDF لدرس
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          اختر الدورة والدرس أولاً، ثم ارفع ملف الـPDF الخاص به.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">اختيار الدرس</CardTitle>
          <CardDescription>
            حدد الدورة أولًا، ثم الدرس الذي تريد إضافة ملفه.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="course">الدورة</Label>
            <Select value={courseSlug} onValueChange={handleCourseChange}>
              <SelectTrigger id="course" className="w-full">
                <SelectValue placeholder={isLoading ? "جارٍ التحميل…" : "اختر الدورة"} />
              </SelectTrigger>
              <SelectContent>
                {(courses ?? []).map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson">الدرس</Label>
            <Select
              value={lessonId}
              onValueChange={setLessonId}
              disabled={!course}
            >
              <SelectTrigger id="lesson" className="w-full">
                <SelectValue placeholder="اختر الدرس" />
              </SelectTrigger>
              <SelectContent>
                {course?.lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.order}. {l.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {courseSlug && !course && (
        <div className="flex min-h-[20vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {lesson && course && (
        <PdfUploadForm
          key={lesson.id}
          lessonTitle={lesson.title}
          hasExistingPdf={lesson.hasPdf}
          existingPdfPages={lesson.pdfPages ?? undefined}
          submitLabel={lesson.hasPdf ? "حفظ التعديلات" : "إضافة الملف"}
          onUpload={async (file, pages) => {
            if (!file) return;
            await uploadPdf.mutateAsync({ lessonId: lesson.id, file, pages });
            router.push(`/teacher/dashboard/courses/${course.slug}`);
          }}
        />
      )}
    </div>
  );
}

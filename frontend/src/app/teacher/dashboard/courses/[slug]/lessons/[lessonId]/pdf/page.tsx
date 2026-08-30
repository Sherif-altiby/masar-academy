"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { PdfUploadForm } from "@/components/teacher/pdf-upload-form";
import { useMyCourse, useUploadLessonPdf } from "@/hooks/use-teacher-console";

export default function LessonPdfPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const { data: course, isLoading } = useMyCourse(params.slug);
  const uploadPdf = useUploadLessonPdf(params.slug);

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
          {lesson?.hasPdf ? "تعديل ملف الدرس" : "إضافة ملف PDF"}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson?.title ?? "الدرس"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ارفع ملف PDF ليكون مادة مرجعية للطلاب بجانب فيديو الدرس.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        lesson && (
          <PdfUploadForm
            lessonTitle={lesson.title}
            hasExistingPdf={lesson.hasPdf}
            existingPdfPages={lesson.pdfPages ?? undefined}
            onUpload={async (file, pages) => {
              if (!file) return;
              await uploadPdf.mutateAsync({ lessonId: lesson.id, file, pages });
            }}
          />
        )
      )}
    </div>
  );
}

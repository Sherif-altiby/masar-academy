"use client";

import * as React from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PdfUploadFormProps {
  /** Title used to name the file when no new file has been picked yet. */
  lessonTitle: string;
  hasExistingPdf?: boolean;
  existingPdfPages?: number;
  submitLabel?: string;
  onUpload: (file: File | null, pages?: number) => Promise<void>;
}

export function PdfUploadForm({
  lessonTitle,
  hasExistingPdf,
  existingPdfPages,
  submitLabel = "حفظ ملف الدرس",
  onUpload,
}: PdfUploadFormProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState(existingPdfPages ? String(existingPdfPages) : "");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Build (and clean up) a local preview URL whenever a new file is selected.
  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFiles(fileList: FileList | null) {
    const selected = fileList?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      toast.error("الرجاء اختيار ملف PDF فقط.");
      return;
    }
    setFile(selected);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file && !hasExistingPdf) {
      toast.error("الرجاء اختيار ملف PDF أولاً.");
      return;
    }
    setSubmitting(true);
    try {
      await onUpload(file, pages ? Number(pages) : undefined);
      toast.success("تم حفظ ملف الدرس بنجاح.");
    } catch {
      toast.error("تعذّر حفظ ملف الدرس.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ملف الدرس</CardTitle>
        <CardDescription>الحد الأقصى لحجم الملف 20 ميجابايت.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-secondary/50"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {file ? (
              <>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="size-7" />
                </span>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} ميجابايت
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X /> إزالة الملف
                </Button>
              </>
            ) : hasExistingPdf ? (
              <>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="size-7" />
                </span>
                <div>
                  <p className="font-medium">{lessonTitle}.pdf</p>
                  <p className="text-sm text-muted-foreground">
                    {existingPdfPages} صفحة · الملف الحالي
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  انقر أو اسحب ملفًا جديدًا هنا لاستبداله
                </p>
              </>
            ) : (
              <>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UploadCloud className="size-7" />
                </span>
                <div>
                  <p className="font-medium">
                    اسحب ملف PDF هنا أو انقر للاختيار
                  </p>
                  <p className="text-sm text-muted-foreground">ملفات PDF فقط</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">عدد الصفحات (اختياري)</Label>
            <Input
              id="pages"
              name="pages"
              type="number"
              min={1}
              placeholder="8"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
               
              className="text-right"
            />
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label>معاينة الملف</Label>
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  src={previewUrl}
                  title="معاينة ملف PDF"
                  className="h-80 w-full"
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "جارٍ الحفظ…" : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

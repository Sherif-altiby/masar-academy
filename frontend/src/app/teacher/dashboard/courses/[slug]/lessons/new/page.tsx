"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMyCourse } from "@/hooks/use-teacher-console";
import { useCreateLesson } from "@/hooks/use-teacher-console";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

/** Accepts a full YouTube URL or a bare video ID and returns the ID. */
function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const pattern = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
  const match = trimmed.match(pattern);
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export default function NewLessonPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const { data: course } = useMyCourse(params.slug);
  const createLesson = useCreateLesson(params.slug);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [videoInput, setVideoInput] = React.useState("");
  const [isFree, setIsFree] = React.useState(false);

  const videoId = extractYoutubeId(videoInput);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!videoId) {
      toast.error("الرجاء إدخال رابط يوتيوب صحيح لفيديو الدرس.");
      return;
    }
    try {
      await createLesson.mutateAsync({
        title,
        description,
        videoUrl: videoInput,
        duration: duration || undefined,
        order: order ? Number(order) : undefined,
        isFree,
      });
      toast.success("تم إضافة الدرس بنجاح! يمكنك الآن إضافة ملف PDF أو اختبار.");
      router.push(`/teacher/dashboard/courses/${params.slug}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "تعذّر إضافة الدرس"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/teacher/dashboard/courses/${params.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> {course?.title ?? "الدورة"}
      </Link>

      <div>
        <p className="text-sm font-semibold text-primary">درس جديد</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          إضافة درس
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          كل درس يبدأ بفيديو من يوتيوب. يمكنك إضافة ملف PDF أو اختبار له بعد
          الحفظ.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">بيانات الدرس</CardTitle>
          <CardDescription>
            سيظهر هذا الدرس للطلاب بترتيبه ضمن دروس الدورة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدرس</Label>
              <Input
                id="title"
                name="title"
                placeholder="مثال: مقدمة في التعبيرات الجبرية"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف الدرس</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="جملة أو جملتان عن محتوى الدرس"
                required
                className="min-h-20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">مدة الدرس</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="مثال: ١٨ دقيقة"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">ترتيب الدرس</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  placeholder="1"
                   
                  className="text-right"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">رابط فيديو يوتيوب</Label>
              <div className="relative">
                <Video className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="video"
                  name="video"
                  placeholder="https://www.youtube.com/watch?v=…"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                   
                  className="pr-9 text-right"
                  required
                />
              </div>
              {videoInput && (
                <p
                  className={
                    videoId
                      ? "text-xs text-primary"
                      : "text-xs text-destructive"
                  }
                >
                  {videoId
                    ? `تم التعرّف على الفيديو (المعرّف: ${videoId})`
                    : "لم نتمكن من التعرّف على رابط يوتيوب صحيح."}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">درس مجاني للمعاينة</p>
                <p className="text-xs text-muted-foreground">
                  يمكن لأي طالب مشاهدة هذا الدرس بدون تسجيل في الدورة
                </p>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>

            <Button type="submit" className="w-full" disabled={createLesson.isPending}>
              {createLesson.isPending ? "جارٍ إضافة الدرس…" : "إضافة الدرس"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

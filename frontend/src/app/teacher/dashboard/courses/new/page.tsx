"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSubjects } from "@/hooks/use-subjects";
import { useCreateCourse } from "@/hooks/use-teacher-console";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { LEVEL_OPTIONS } from "@/types";

export default function NewCoursePage() {
  const router = useRouter();
  const { data: subjects } = useSubjects();
  const createCourse = useCreateCourse();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [pricing, setPricing] = React.useState("free");
  const [price, setPrice] = React.useState("0");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const course = await createCourse.mutateAsync({
        title,
        description,
        subjectId: subject,
        level,
        price: pricing === "paid" ? Number(price) || 0 : 0,
      });
      toast.success("تم إنشاء الدورة بنجاح! يمكنك الآن إضافة الدروس.");
      router.push(`/teacher/dashboard/courses/${course.slug}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "تعذّر إنشاء الدورة"));
    }
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
        <p className="text-sm font-semibold text-primary">دورة جديدة</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          إضافة دورة
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          املأ بيانات الدورة، ثم أضف الدروس بعد إنشائها.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">بيانات الدورة</CardTitle>
          <CardDescription>
            هذه المعلومات ستظهر للطلاب في صفحة الدورة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدورة</Label>
              <Input
                id="title"
                name="title"
                placeholder="مثال: أساسيات الجبر"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف الدورة</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="وصف مختصر لما سيتعلمه الطالب في هذه الدورة"
                required
                className="min-h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">المادة الدراسية</Label>
                <Select value={subject} onValueChange={setSubject} required>
                  <SelectTrigger id="subject" className="w-full">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {(subjects ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">المرحلة الدراسية</Label>
                <Select value={level} onValueChange={setLevel} required>
                  <SelectTrigger id="level" className="w-full">
                    <SelectValue placeholder="اختر المرحلة" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>نوع الدورة</Label>
              <RadioGroup
                value={pricing}
                onValueChange={setPricing}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="free"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value="free" id="free" />
                  مجانية
                </Label>
                <Label
                  htmlFor="paid"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value="paid" id="paid" />
                  مدفوعة
                </Label>
              </RadioGroup>
            </div>

            {pricing === "paid" && (
              <div className="space-y-2">
                <Label htmlFor="price">السعر (جنيه مصري)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  placeholder="200"
                  dir="ltr"
                  className="text-right"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={createCourse.isPending}>
              <BookPlus />
              {createCourse.isPending ? "جارٍ إنشاء الدورة…" : "إنشاء الدورة"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

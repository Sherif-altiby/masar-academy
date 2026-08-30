"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Loader2, Save, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/shared/star-rating";
import { RatePlatformCard } from "@/components/shared/rate-platform-card";
import { COURSES } from "@/data/mock-data";
import { LEVEL_OPTIONS } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import { useMyTeacherReviews, useSubmitTeacherReview } from "@/hooks/use-reviews";

export default function ProfilePage() {
  return (
    <React.Suspense fallback={null}>
      <ProfilePageContent />
    </React.Suspense>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "profile";
  const { user, status, isTeacher } = useAuth();

  const { data: myReviews } = useMyTeacherReviews();
  const submitReview = useSubmitTeacherReview();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && isTeacher) router.replace("/teacher/dashboard");
  }, [status, isTeacher, router]);

  if (status !== "authenticated" || !user || isTeacher) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const levelLabel = LEVEL_OPTIONS.find((l) => l.value === user.level)?.label;
  const enrolledCourses = COURSES.slice(0, 3); // illustrative — no enrollment endpoint yet

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center gap-5">
        <Avatar className="size-20 border-2 border-secondary">
          <AvatarFallback className="bg-secondary text-xl font-semibold text-secondary-foreground">
            {user.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {user.fullName}
          </h1>
          <p className="text-muted-foreground">
            {levelLabel ?? "طالب"} · {user.email}
          </p>
        </div>
      </div>

      <Tabs defaultValue={initialTab} className="mt-10">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="courses">دوراتي</TabsTrigger>
          <TabsTrigger value="ratings">التقييمات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Edit profile */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">البيانات الشخصية</CardTitle>
              <CardDescription>
                حافظ على تحديث بياناتك حتى يبقى المدرّسون وأولياء الأمور على
                تواصل.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.info(
                    "تعديل الملف الشخصي غير متصل بالخادم بعد في هذا العرض التوضيحي."
                  );
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم بالكامل</Label>
                  <Input id="fullName" defaultValue={user.fullName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    dir="ltr"
                    className="text-right"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue={user.phone}
                      dir="ltr"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">هاتف ولي الأمر</Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      defaultValue={user.parentPhone ?? ""}
                      dir="ltr"
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">المرحلة الدراسية</Label>
                  <Select defaultValue={user.level ?? undefined}>
                    <SelectTrigger id="level" className="w-full">
                      <SelectValue />
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
                <Button type="submit">
                  <Save /> حفظ التغييرات
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrolled courses */}
        <TabsContent value="courses" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            عرض توضيحي لدوراتك — لا يوجد بعد نظام تسجيل وتتبّع تقدّم متصل
            بالخادم.
          </p>
          {enrolledCourses.map((course, index) => {
            const progress = [66, 20, 100][index] ?? 0;
            return (
              <Card key={course.id} className="flex-row items-center gap-4 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{course.title}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Progress value={progress} className="h-1.5 max-w-40" />
                    <span className="text-xs text-muted-foreground">
                      {progress}٪
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/courses/${course.slug}`}>
                    {progress === 100 ? "مراجعة" : "متابعة"}
                  </Link>
                </Button>
              </Card>
            );
          })}
        </TabsContent>

        {/* Ratings */}
        <TabsContent value="ratings" className="mt-6 space-y-6">
          <RatePlatformCard />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">تقييماتك للمدرّسين</CardTitle>
              <CardDescription>
                حدّث تقييمك في أي وقت تتغير فيه تجربتك.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(myReviews ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  لم تقيّم أي مدرّس بعد.
                </p>
              )}
              {(myReviews ?? []).map((review) => (
                <div
                  key={review.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-secondary text-xs">
                        {review.teacher.user.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/teachers/${review.teacher.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {review.teacher.user.fullName}
                      </Link>
                      <Badge variant="secondary" className="mt-0.5 block w-fit">
                        {review.teacher.title}
                      </Badge>
                    </div>
                  </div>
                  <StarRating
                    value={review.rating}
                    size={18}
                    onChange={(value) => {
                      submitReview.mutate(
                        { teacherId: review.teacherId, rating: value },
                        {
                          onSuccess: () =>
                            toast.success(
                              `تم تحديث تقييمك لـ${review.teacher.user.fullName}.`
                            ),
                        }
                      );
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/teachers">
                  <Star /> قيّم مدرّسًا آخر
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تغيير كلمة المرور</CardTitle>
              <CardDescription>
                استخدم كلمة مرور لا تقل عن 8 أحرف.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.info(
                    "تغيير كلمة المرور غير متصل بالخادم بعد في هذا العرض التوضيحي."
                  );
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input id="newPassword" type="password" minLength={8} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input id="confirmPassword" type="password" minLength={8} />
                  </div>
                </div>
                <Button type="submit">
                  <Save /> تحديث كلمة المرور
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowUpLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/star-rating";
import { RateTeacherDialog } from "@/components/shared/rate-teacher-dialog";
import { useTeacher } from "@/hooks/use-teachers";
import { cn } from "@/lib/utils";
import { TeacherProfileSkeleton } from "@/components/skeletons/teacher-profile-skeleton";

export default function TeacherProfilePage() {
  const params = useParams<{ slug: string }>();
  const { data: teacher, isLoading, isError } = useTeacher(params.slug);

  if (isLoading) {
    return <TeacherProfileSkeleton />;
  }

  if (isError || !teacher) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary">
            <GraduationCap className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-5 font-display text-lg font-semibold">
            تعذّر العثور على هذا المدرّس
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            ربما تم حذف الملف الشخصي أو أن الرابط غير صحيح.
          </p>

          <Button variant="outline" className="mt-6" asChild>
            <Link href="/teachers">العودة إلى المدرّسين</Link>
          </Button>
        </div>
      </div>
    );
  }

  const firstName = teacher.name.split(" ")[0];

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/teachers"
            className="transition-colors hover:text-primary"
          >
            المدرّسون
          </Link>

          <span className="text-border">/</span>

          <span className="text-foreground">{teacher.name}</span>
        </div>

        {/* Profile Header */}
        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
          <div className="h-1 bg-primary" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-7 md:flex-row md:items-center">
              {/* Avatar */}
              <div className="relative shrink-0 self-start">
                <Avatar className="size-24 border-4 border-secondary shadow-sm sm:size-28">
                  {teacher.avatarUrl ? (
                    <AvatarImage
                      src={teacher.avatarUrl}
                      alt={teacher.name}
                    />
                  ) : null}

                  <AvatarFallback className="bg-secondary text-2xl font-semibold text-secondary-foreground">
                    {teacher.avatarInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute bottom-0 left-0 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                  <CheckCircle2 className="size-3.5" />
                </div>
              </div>

              {/* Teacher info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {teacher.name}
                  </h1>

                  <Badge
                    variant="secondary"
                    className="rounded-full px-3"
                  >
                    {teacher.subjectName}
                  </Badge>
                </div>

                <p className="mt-2 text-muted-foreground">
                  {teacher.title}
                </p>

                {/* Rating */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2">
                    <StarRating
                      value={teacher.rating}
                      size={16}
                    />

                    <span className="font-semibold">
                      {teacher.rating.toFixed(1)}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      ({teacher.reviewCount} تقييم)
                    </span>
                  </div>

                  <span className="hidden h-4 w-px bg-border sm:block" />

                  <span className="text-sm text-muted-foreground">
                    {teacher.yearsExperience} سنوات خبرة
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                <RateTeacherDialog
                  teacherId={teacher.id}
                  teacherName={teacher.name}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid overflow-hidden rounded-2xl border border-border/70 bg-secondary/30 sm:grid-cols-3">
              <Stat
                icon={Users}
                value={teacher.studentCount.toLocaleString()}
                label="طالب"
                accent="text-blue-500"
              />
              <Stat
                icon={BookOpen}
                value={teacher.courses.length}
                label="دورة"
                accent="text-emerald-500"
                className="border-t sm:border-r sm:border-t-0"
              />
              <Stat
                icon={GraduationCap}
                value={teacher.yearsExperience}
                label="سنوات خبرة"
                accent="text-amber-500"
                className="border-t sm:border-t-0"
              />
            </div>
          </div>
        </Card>

        {/* Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <section>
              <SectionHeading
                icon={GraduationCap}
                title={`نبذة عن ${firstName}`}
                description="تعرّف على المدرّس وخبرته التعليمية"
              />

              <Card className="mt-4 rounded-2xl border-border/70 shadow-sm">
                <CardContent className=" px-4">
                  <p className="text-[15px] leading-8 text-muted-foreground">
                    {teacher.about}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Courses */}
            <section>
              <div className="flex items-end justify-between gap-4">
                <SectionHeading
                  icon={BookOpen}
                  title={`دورات ${teacher.subjectName}`}
                  description="اختر الدورة المناسبة وابدأ رحلة التعلم"
                />

                <Badge
                  variant="secondary"
                  className="hidden shrink-0 sm:flex"
                >
                  {teacher.courses.length} دورة
                </Badge>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {teacher.courses.map((course) => {
                  const card = (
                    <Card
                      className={cn(
                        "h-full rounded-2xl border-border/70",
                        "transition-all duration-200",
                        course.isFree
                          ? "hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                          : "cursor-not-allowed opacity-60 grayscale"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                            <BookOpen className="size-5" />
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={course.isFree ? "secondary" : "accent"}
                              className="text-[10px]"
                            >
                              {course.isFree ? "مجاني" : "مدفوع"}
                            </Badge>
                            {course.isFree && (
                              <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100">
                                <ArrowUpLeft className="size-4" />
                              </div>
                            )}
                          </div>
                        </div>

                        <CardTitle className="font-display text-base leading-7 transition-colors group-hover:text-primary">
                          {course.title}
                        </CardTitle>

                        <CardDescription className="line-clamp-2 leading-6">
                          {course.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <Separator className="mb-4" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="size-3.5" />
                            {course.lessonCount} دروس
                          </span>

                          <span className="flex items-center gap-1.5">
                            <StarRating
                              value={course.rating}
                              size={12}
                            />

                            <span className="font-medium text-foreground">
                              {course.rating.toFixed(1)}
                            </span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );

                  return course.isFree ? (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group block"
                    >
                      {card}
                    </Link>
                  ) : (
                    <div key={course.id} className="group block" aria-disabled="true">
                      {card}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Credentials */}
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader className="border-b border-border/60 bg-secondary/20">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="size-4 text-primary" />
                  المؤهلات
                </CardTitle>

                <CardDescription>
                  أبرز مؤهلات وخبرات المدرّس
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5">
                <ul className="space-y-4">
                  {teacher.credentials.map((credential) => (
                    <li
                      key={credential}
                      className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                        <CheckCircle2 className="size-3" />
                      </span>

                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader className="border-b border-border/60 bg-secondary/20">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="size-4 text-primary" />
                  تقييمات الطلاب
                </CardTitle>

                <CardDescription>
                  آراء الطلاب عن تجربة التعلم
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5">
                {teacher.reviews.length > 0 ? (
                  <div className="space-y-5">
                    {teacher.reviews.map((review, index) => (
                      <div key={review.id}>
                        <div className="flex items-start gap-3">
                          <Avatar className="size-9 shrink-0">
                            <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                              {review.studentName
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium">
                                {review.studentName}
                              </p>

                              <StarRating
                                value={review.rating}
                                size={11}
                              />
                            </div>

                            {review.comment && (
                              <p className="mt-2 rounded-xl bg-secondary/40 p-3 text-xs leading-6 text-muted-foreground">
                                “{review.comment}”
                              </p>
                            )}
                          </div>
                        </div>

                        {index < teacher.reviews.length - 1 && (
                          <Separator className="mt-5" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-secondary">
                      <MessageSquare className="size-5 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      لا توجد تقييمات بعد
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      كن أول من يقيّم هذا المدرّس.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  accent = "text-primary",
  className,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-background/60 sm:p-5",
        className
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border/60 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md",
          accent
        )}
      >
        <Icon className="size-5" strokeWidth={2.25} />
      </div>

      <div>
        <p className="font-display text-lg font-bold tabular-nums tracking-tight text-foreground">
          {value}
        </p>

        <p className="text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}


function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}




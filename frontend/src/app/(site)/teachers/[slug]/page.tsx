"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, GraduationCap, Loader2, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export default function TeacherProfilePage() {
  const params = useParams<{ slug: string }>();
  const { data: teacher, isLoading, isError } = useTeacher(params.slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-medium">تعذّر العثور على هذا المدرّس</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/teachers">العودة إلى المدرّسين</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="size-24 border-2 border-secondary sm:size-28">
          <AvatarFallback className="bg-secondary text-2xl font-semibold text-secondary-foreground">
            {teacher.avatarInitials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {teacher.name}
            </h1>
            <Badge variant="secondary">{teacher.subjectName}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{teacher.title}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <StarRating value={teacher.rating} size={15} />
              <span className="font-medium">{teacher.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({teacher.reviewCount} تقييم)
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-4" /> {teacher.studentCount.toLocaleString()}{" "}
              طالب
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap className="size-4" /> {teacher.yearsExperience}{" "}
              سنوات خبرة
            </span>
          </div>
        </div>

        <RateTeacherDialog teacherId={teacher.id} teacherName={teacher.name} />
      </div>

      <Separator className="my-10" />

      <div className="grid gap-10 lg:grid-cols-3">
        {/* About + Courses */}
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="font-display text-xl font-semibold">
              نبذة عن {teacher.name.split(" ")[0]}
            </h2>
            <p className="mt-3 text-balance leading-relaxed text-muted-foreground">
              {teacher.about}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                دورات {teacher.subjectName}
              </h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {teacher.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group block"
                >
                  <Card className="h-full gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="font-display text-base group-hover:underline">
                        {course.title}
                      </CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.lessonCount} دروس</span>
                      <span className="flex items-center gap-1">
                        <StarRating value={course.rating} size={12} />
                        {course.rating.toFixed(1)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: credentials + reviews */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">المؤهلات</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {teacher.credentials.map((credential) => (
                  <li key={credential} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {credential}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div>
            <h3 className="font-display text-base font-semibold">
              تقييمات الطلاب
            </h3>
            {teacher.reviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {teacher.reviews.map((review) => (
                  <Card key={review.id} className="gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{review.studentName}</p>
                      <StarRating value={review.rating} size={13} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                لا توجد تقييمات بعد. كن أول من يقيّم هذا المدرّس.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, FileText, HelpCircle, MoreVertical, Pencil, PlusCircle, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StarRating } from "@/components/shared/star-rating";
import { TeacherCoursesSkeleton } from "@/components/skeletons/teacher-courses-skeleton";
import { useDeleteCourse, useMyCourses } from "@/hooks/use-teacher-console";
import { ApiTeacherOwnCourse } from "@/lib/api-types";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { LEVEL_OPTIONS } from "@/types";

function levelLabel(value: string) {
  return LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function DeleteCourseDialog({
  course,
  open,
  onOpenChange,
}: {
  course: ApiTeacherOwnCourse;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate: deleteCourse, isPending } = useDeleteCourse();

  function handleDelete() {
    deleteCourse(course.slug, {
      onSuccess: () => {
        toast.success("تم حذف الدورة بنجاح");
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, "تعذّر حذف الدورة"));
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">حذف الدورة</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground  text-right">
            هل أنت متأكد من حذف دورة{" "}
            <span className="font-semibold text-foreground">«{course.title}»</span>؟
            <br />
            سيتم حذف جميع الدروس والاختبارات والتسجيلات بشكل نهائي ولا يمكن التراجع عن ذلك.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row-reverse gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "جارٍ الحذف..." : "حذف نهائي"}
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TeacherCoursesPage() {
  const { data: courses, isLoading } = useMyCourses();
  const [courseToDelete, setCourseToDelete] = React.useState<ApiTeacherOwnCourse | null>(null);

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

      {isLoading && <TeacherCoursesSkeleton />}

      {courses && courses.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border pb-0 pt-0 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                {/* صورة غلاف الدورة */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <BookOpen className="size-8 text-muted-foreground/30" />
                    </div>
                  )}

                  <Badge
                    variant="secondary"
                    className="absolute start-3 top-3 border bg-background/85 text-xs font-medium shadow-sm backdrop-blur-md"
                  >
                    {levelLabel(course.level)}
                  </Badge>

                  {/* قائمة الخيارات */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute end-2 top-2 size-7 border bg-background/85 opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100"
                      >
                        <MoreVertical className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40" >
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/dashboard/courses/${course.slug}`}>
                          <Pencil className="size-3.5" />
                          تعديل الدروس
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setCourseToDelete(course)}
                      >
                        <Trash2 className="size-3.5" />
                        حذف الدورة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* تفاصيل الدورة */}
                <div className="space-y-1.5 p-4">
                  <h3 className="line-clamp-1 font-display text-base font-semibold transition-colors group-hover:text-primary">
                    {course.title}
                  </h3>
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* أسفل البطاقة والإحصائيات */}
              <div className="space-y-3 p-4 pt-0">
                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <BookOpen className="size-3.5 text-primary" /> {course.lessonCount} دروس
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="size-3.5 text-primary" />{" "}
                    {course.studentCount.toLocaleString()} طالب
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <StarRating value={course.rating} size={12} />
                    {course.rating.toFixed(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/teacher/dashboard/courses/${course.slug}`}>
                      <Pencil className="size-3.5" /> تعديل
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setCourseToDelete(course)}
                  >
                    <Trash2 className="size-3.5" /> حذف
                  </Button>
                </div>
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

      {/* حوار تأكيد الحذف */}
      {courseToDelete && (
        <DeleteCourseDialog
          course={courseToDelete}
          open={true}
          onOpenChange={(v) => { if (!v) setCourseToDelete(null); }}
        />
      )}
    </div>
  );
}

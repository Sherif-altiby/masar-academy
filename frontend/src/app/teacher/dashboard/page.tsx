"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PlaySquare,
  PlusCircle,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/teacher/stat-card";
import { StudentGrowthChart } from "@/components/teacher/charts/student-growth-chart";
import { QuizPerformanceChart } from "@/components/teacher/charts/quiz-performance-chart";
import { CourseEnrollmentChart } from "@/components/teacher/charts/course-enrollment-chart";
import { ContentMixChart } from "@/components/teacher/charts/content-mix-chart";
import { CompletionRateChart } from "@/components/teacher/charts/completion-rate-chart";
import { TeacherDashboardSkeleton } from "@/components/skeletons/teacher-dashboard-skeleton";
import { useMyCourses, useMyTeacherProfile } from "@/hooks/use-teacher-console";
import { useAuth } from "@/providers/auth-provider";
import {
  CONTENT_MIX,
  COURSE_COMPLETION,
  QUIZ_COMPLETION_RATE,
  QUIZ_PERFORMANCE,
  STUDENT_GROWTH,
  TOTAL_VIDEO_VIEWS,
} from "@/data/teacher-dashboard-data";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const { data: profile } = useMyTeacherProfile();
  const { data: courses, isLoading } = useMyCourses();

  if (isLoading || !courses) {
    return <TeacherDashboardSkeleton />;
  }

  const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">نظرة عامة</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            أهلًا بك، {user?.fullName.split(" ")[0]} 
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            إليك ملخص أداء دوراتك هذا الشهر.
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/dashboard/courses/new">
            <PlusCircle /> إضافة دورة جديدة
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="إجمالي الطلاب"
          value={totalStudents.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="الدورات النشطة"
          value={courses.length.toString()}
          icon={BookOpen}
        />
        <StatCard
          label="إجمالي الدروس"
          value={totalLessons.toString()}
          icon={GraduationCap}
        />
        <StatCard
          label="متوسط التقييم"
          value={(profile?.rating ?? 0).toFixed(1)}
          icon={Star}
          trend={
            profile ? { value: `${profile.reviewCount} تقييم`, positive: true } : undefined
          }
        />
        <StatCard
          label="مشاهدات الفيديو"
          value={TOTAL_VIDEO_VIEWS.toLocaleString()}
          icon={PlaySquare}
          trend={{ value: "عيّنة توضيحية", positive: true }}
        />
        <StatCard
          label="نسبة إكمال الاختبارات"
          value={`${QUIZ_COMPLETION_RATE}٪`}
          icon={CheckCircle2}
        />
      </div>

      {/* Charts — row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">نمو عدد الطلاب</CardTitle>
            <CardDescription>عيّنة توضيحية لآخر 6 أشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentGrowthChart data={STUDENT_GROWTH} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">متوسط درجات الاختبارات</CardTitle>
            <CardDescription>عيّنة توضيحية</CardDescription>
          </CardHeader>
          <CardContent>
            <QuizPerformanceChart data={QUIZ_PERFORMANCE} />
          </CardContent>
        </Card>
      </div>

      {/* Charts — row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الطلاب حسب الدورة</CardTitle>
            <CardDescription>بيانات حقيقية من دوراتك</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseEnrollmentChart
              courses={courses.map((c) => ({ title: c.title, studentCount: c.studentCount }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">توزيع محتوى الدروس</CardTitle>
            <CardDescription>عيّنة توضيحية</CardDescription>
          </CardHeader>
          <CardContent>
            <ContentMixChart data={CONTENT_MIX} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">نسبة إكمال الدورة</CardTitle>
            <CardDescription>عيّنة توضيحية</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionRateChart data={COURSE_COMPLETION} />
          </CardContent>
        </Card>
      </div>

      {/* Courses quick list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">دوراتك</CardTitle>
              <CardDescription>إدارة سريعة لدوراتك الحالية</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/dashboard/courses">عرض الكل</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {courses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لا توجد دورات بعد. ابدأ بإنشاء أول دورة لك.
            </p>
          )}
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/teacher/dashboard/courses/${course.slug}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary"
            >
              <div>
                <p className="text-sm font-medium">{course.title}</p>
                <p className="text-xs text-muted-foreground">
                  {course.lessonCount} دروس · {course.studentCount.toLocaleString()} طالب
                </p>
              </div>
              <Badge variant="secondary">{course.rating.toFixed(1)} ★</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

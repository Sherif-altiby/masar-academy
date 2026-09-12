 "use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Users,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeacherCard } from "@/components/shared/teacher-card";
import { useSubjects } from "@/hooks/use-subjects";
import { useTeachers } from "@/hooks/use-teachers";
import { cn } from "@/lib/utils";

export default function TeachersPage() {
  return (
    <React.Suspense fallback={<TeachersPageSkeleton />}>
      <TeachersPageContent />
    </React.Suspense>
  );
}

function TeachersPageContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") ?? "all";

  const [subjectFilter, setSubjectFilter] = React.useState(initialSubject);
  const [query, setQuery] = React.useState("");

  const { data: subjects } = useSubjects();

  const {
    data: teachers,
    isLoading,
    isError,
    refetch,
  } = useTeachers(subjectFilter === "all" ? undefined : subjectFilter);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTeachers = (teachers ?? []).filter((teacher) =>
    teacher.name.toLowerCase().includes(normalizedQuery)
  );

  const hasFilters = query.trim() !== "" || subjectFilter !== "all";

  const clearFilters = () => {
    setQuery("");
    setSubjectFilter("all");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
        <div className="absolute right-[10%] top-[-180px] size-[420px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute left-[5%] top-[100px] size-[280px] rounded-full bg-chart-2/8 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Hero */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-3.5" />
            </span>
            <span>المدرّسون</span>
          </div>

          <div className="mt-4 max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[52px] lg:leading-[1.15]">
              تعلّم من المدرّس
              <span className="text-primary"> المناسب لك.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              اكتشف أفضل المدرّسين، تصفّح تخصصاتهم ودوراتهم، واختر المسار
              التعليمي الذي يناسب أهدافك.
            </p>
          </div>

          {/* Stats */}
          {!isLoading && !isError && (
            <div className="mt-7 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>

              <span>
                <span className="font-semibold text-foreground">
                  {filteredTeachers.length}
                </span>{" "}
                مدرّس متاح
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mt-10 rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm backdrop-blur-sm sm:p-4">
          <div className="mb-3 flex items-center gap-2 px-1 text-sm font-medium text-foreground">
            <SlidersHorizontal className="size-4 text-primary" />
            تصفية المدرّسين
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن مدرس بالاسم..."
                className="h-11 border-border/70 bg-background pr-10 shadow-none transition-colors focus-visible:border-primary/50"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute left-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="مسح البحث"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Subject */}
            <Select
              value={subjectFilter}
              onValueChange={setSubjectFilter}
            >
              <SelectTrigger className="h-11 w-full border-border/70 bg-background shadow-none sm:w-60">
                <SelectValue placeholder="كل المواد" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">كل المواد</SelectItem>

                {(subjects ?? []).map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>الفلاتر المطبقة:</span>

                {query && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    {query}
                  </span>
                )}

                {subjectFilter !== "all" && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    {subjects?.find((s) => s.id === subjectFilter)?.name ??
                      "المادة"}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                مسح الكل
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && <TeacherGridSkeleton />}

        {/* Error */}
        {isError && (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-destructive/15 bg-destructive/5 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <RefreshCw className="size-5" />
            </div>

            <h2 className="mt-4 font-semibold text-foreground">
              تعذّر تحميل المدرّسين
            </h2>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              حدثت مشكلة أثناء تحميل البيانات. حاول تحديث الصفحة مرة أخرى.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RefreshCw className="size-4" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && filteredTeachers.length > 0 && (
          <div className="mt-10">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  المدرّسون
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  اختر المدرّس المناسب وابدأ رحلتك التعليمية
                </p>
              </div>

              <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
                {filteredTeachers.length} نتيجة
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && filteredTeachers.length === 0 && (
          <div className="mt-10 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Search className="size-6" />
            </div>

            <h2 className="mt-5 font-display text-lg font-semibold">
              لا يوجد مدرّسون مطابقون
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              لم نجد مدرسين يطابقون بحثك الحالي. جرّب اسمًا مختلفًا أو اختر
              مادة دراسية أخرى.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------------------------------------------
   Loading states
--------------------------------------------- */

function TeacherGridSkeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <TeacherCardSkeleton key={index} />
      ))}
    </div>
  );
}

function TeacherCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/60">
      <div className="h-44 animate-pulse bg-muted" />

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-full bg-muted" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

        <div className="border-t pt-4">
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </Card>
  );
}

function TeachersPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="mt-5 h-12 max-w-xl rounded bg-muted" />
        <div className="mt-4 h-5 max-w-2xl rounded bg-muted" />

        <div className="mt-10 h-28 rounded-2xl bg-muted" />

        <TeacherGridSkeleton />
      </div>
    </main>
  );
}
 

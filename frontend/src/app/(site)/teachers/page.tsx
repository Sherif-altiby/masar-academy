"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

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

export default function TeachersPage() {
  return (
    <React.Suspense fallback={null}>
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
  } = useTeachers(subjectFilter === "all" ? undefined : subjectFilter);

  const filteredTeachers = (teachers ?? []).filter((teacher) =>
    teacher.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">المدرّسون</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          كل مدرّس، ومساره الخاص.
        </h1>
        <p className="mt-3 text-muted-foreground">
          تصفّح حسب المادة الدراسية أو ابحث بالاسم لتجد المدرّس الأنسب لدوراتك.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مدرّس بالاسم…"
            className="pr-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-56">
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

      {isLoading && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-secondary/40" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-10 text-sm text-destructive">
          تعذّر تحميل بيانات المدرّسين. حاول تحديث الصفحة.
        </p>
      )}

      {!isLoading && !isError && filteredTeachers.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}

      {!isLoading && !isError && filteredTeachers.length === 0 && (
        <div className="mt-16 rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">لا يوجد مدرّسون مطابقون لبحثك</p>
          <p className="mt-1 text-sm text-muted-foreground">
            جرّب اسمًا مختلفًا أو اختر مادة دراسية أخرى.
          </p>
        </div>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TeacherCard } from "@/components/shared/teacher-card";
import { useTeachers } from "@/hooks/use-teachers";

export function TeachersSection() {
  const { data: teachers, isLoading, isError } = useTeachers();

  return (
    <section className="border-t bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-primary">مدرّسونا</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              يعلّمهم أشخاص، ويقيّمهم الطلاب.
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/teachers">
              عرض كل المدرّسين <ArrowLeft />
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

        {teachers && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teachers.slice(0, 4).map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

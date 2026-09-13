"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubjectCard } from "@/components/shared/subject-card";
import { SubjectCardSkeleton } from "@/components/skeletons/subject-card-skeleton";
import { useSubjects } from "@/hooks/use-subjects";
import { Subject } from "@/types";

export function SubjectsSection() {
  const { data: subjects, isLoading, isError } = useSubjects();

  return (
    <section id="subjects" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-primary">المواد الدراسية</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              اختر مادتك، واتبع مسارك.
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/subjects">
              عرض كل المواد <ArrowLeft />
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SubjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <p className="mt-10 text-sm text-destructive">
            تعذّر تحميل المواد الدراسية. حاول تحديث الصفحة.
          </p>
        )}

        {subjects && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject as Subject} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

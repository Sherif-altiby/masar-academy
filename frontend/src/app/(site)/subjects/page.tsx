"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SubjectCard } from "@/components/shared/subject-card";
import { useSubjects } from "@/hooks/use-subjects";
import { Subject } from "@/types";

export default function SubjectsPage() {
  const [query, setQuery] = React.useState("");
  const { data: subjects, isLoading, isError } = useSubjects();

  const filteredSubjects = (subjects ?? []).filter((subject) =>
    subject.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">المواد الدراسية</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          كل مادة، ومسارها الخاص.
        </h1>
        <p className="mt-3 text-muted-foreground">
          اختر المادة التي تريد التركيز عليها، وستجد أفضل المدرّسين ودوراتهم
          المنظمة في انتظارك.
        </p>
      </div>

      <div className="relative mt-8 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن مادة دراسية…"
          className="pr-9"
        />
      </div>

      {isLoading && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-44 animate-pulse bg-secondary/40" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-10 text-sm text-destructive">
          تعذّر تحميل المواد الدراسية. حاول تحديث الصفحة.
        </p>
      )}

      {!isLoading && !isError && filteredSubjects.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject as Subject} />
          ))}
        </div>
      )}

      {!isLoading && !isError && filteredSubjects.length === 0 && (
        <div className="mt-16 rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium">لا توجد مواد مطابقة لبحثك</p>
          <p className="mt-1 text-sm text-muted-foreground">
            جرّب اسمًا مختلفًا للمادة الدراسية.
          </p>
        </div>
      )}
    </section>
  );
}

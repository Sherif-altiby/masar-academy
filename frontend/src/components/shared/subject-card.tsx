import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Subject } from "@/types";
import { cn } from "@/lib/utils";

const COLOR_BG: Record<Subject["color"], string> = {
  "chart-1": "bg-chart-1/12 text-chart-1",
  "chart-2": "bg-chart-2/15 text-chart-2",
  "chart-3": "bg-chart-3/12 text-chart-3",
  "chart-4": "bg-chart-4/12 text-chart-4",
  "chart-5": "bg-chart-5/12 text-chart-5",
};

export function SubjectCard({ subject }: { subject: Subject }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    subject.icon
  ] ?? Icons.BookOpen;

  return (
    <Link href={`/teachers?subject=${subject.id}`} className="group block">
      <Card className="h-full gap-4 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between p-6 pb-0">
          <span
            className={cn(
              "flex size-11 items-center justify-center rounded-lg",
              COLOR_BG[subject.color]
            )}
          >
            <Icon className="size-5" />
          </span>
          <ArrowUpLeft className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="space-y-1.5 px-6">
          <h3 className="font-display text-lg font-semibold">{subject.name}</h3>
          <p className="text-sm text-muted-foreground">{subject.description}</p>
        </div>
        <div className="flex items-center gap-4 border-t px-6 py-4 text-xs text-muted-foreground">
          <span>{subject.courseCount} دورة</span>
          <span aria-hidden>·</span>
          <span>{subject.studentCount.toLocaleString()} طالب</span>
        </div>
      </Card>
    </Link>
  );
}

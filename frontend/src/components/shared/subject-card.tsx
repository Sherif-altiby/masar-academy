import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpLeft, Users, BookOpen } from "lucide-react";

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
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[subject.icon] ??
    BookOpen;

  const hasImage = Boolean(subject.imageUrl?.trim());

  return (
    <Link
      href={`/teachers?subject=${subject.id}`}
      className="group block h-full"
    >
      <Card
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border border-border/60",
          "bg-background shadow-sm",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-xl",
          "focus-within:ring-2 focus-within:ring-primary/30"
        )}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          {hasImage ? (
            <Image
              src={subject.imageUrl}
              alt={subject.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center",
                "bg-gradient-to-br from-muted/80 via-background to-muted",
                COLOR_BG[subject.color]
              )}
            >
              <Icon className="size-12 opacity-70 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          {/* Top icon */}
          <div className="absolute right-4 top-4">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-xl",
                "border border-white/25 bg-white/15",
                "shadow-lg backdrop-blur-md",
                "transition-transform duration-300",
                "group-hover:scale-105"
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  COLOR_BG[subject.color],
                  "bg-opacity-90"
                )}
              >
                <Icon className="size-4.5" />
              </span>
            </div>
          </div>

          {/* Course count */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
              <BookOpen className="size-3.5" />
              <span>{subject.courseCount} دورة</span>
            </div>
          </div>

          {/* Hover arrow */}
          <div
            className={cn(
              "absolute bottom-4 right-4 flex size-9 items-center justify-center",
              "rounded-full bg-white text-slate-900 shadow-lg",
              "translate-y-2 opacity-0",
              "transition-all duration-300",
              "group-hover:translate-y-0 group-hover:opacity-100"
            )}
          >
            <ArrowUpLeft className="size-4" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                {subject.name}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {subject.description}
          </p>

          {/* Bottom info */}
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              <span>
                {subject.studentCount.toLocaleString()} طالب
              </span>
            </div>

            <span
              className={cn(
                "max-w-32 truncate rounded-full px-2.5 py-1",
                "text-[11px] font-medium",
                COLOR_BG[subject.color]
              )}
            >
              {subject.name}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
 
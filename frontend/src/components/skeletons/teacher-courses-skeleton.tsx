import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TeacherCourseCardSkeleton() {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>

      <div className="flex items-center gap-4 pt-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-16" />
      </div>

      <div className="pt-1">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </Card>
  );
}

export function TeacherCoursesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <TeacherCourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

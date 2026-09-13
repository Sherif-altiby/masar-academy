import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TeacherCardSkeleton() {
  return (
    <Card className="h-full items-center gap-3 p-6 text-center">
      <Skeleton className="size-20 rounded-full border-2 border-secondary" />

      <div className="flex w-full flex-col items-center space-y-1">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-36" />
      </div>

      <Skeleton className="h-6 w-20 rounded-full" />

      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>

      <Skeleton className="h-3.5 w-24" />
    </Card>
  );
}

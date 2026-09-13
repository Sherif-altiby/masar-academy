import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SubjectCardSkeleton() {
  return (
    <Card
      className={cn(
        "relative h-full overflow-hidden rounded-2xl border border-border/60",
        "bg-background shadow-sm pt-0"
      )}
    >
      <div className="relative h-44 overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />

        <div className="absolute right-4 top-4">
          <Skeleton className="size-12 rounded-xl" />
        </div>

        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <Skeleton className="h-6 w-2/3" />

        <div className="min-h-12 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

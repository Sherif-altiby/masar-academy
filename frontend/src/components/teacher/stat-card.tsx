import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("gap-2 p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="font-display text-2xl font-semibold tracking-tight">
        {value}
      </p>
      {trend && (
        <p
          className={cn(
            "text-xs font-medium",
            trend.positive ? "text-primary" : "text-destructive"
          )}
        >
          {trend.value}
        </p>
      )}
    </Card>
  );
}

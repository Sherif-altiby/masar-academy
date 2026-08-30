"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  /** If provided, the rating becomes interactive and calls back on change */
  onChange?: (value: number) => void;
}

export function StarRating({
  value,
  size = 16,
  className,
  showValue = false,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const interactive = Boolean(onChange);
  const displayValue = hovered ?? value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(displayValue);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => interactive && setHovered(star)}
              onMouseLeave={() => interactive && setHovered(null)}
              onClick={() => onChange?.(star)}
              className={cn(
                "text-accent",
                interactive && "cursor-pointer transition-transform hover:scale-110"
              )}
              aria-label={`${star} ${star > 1 ? "نجوم" : "نجمة"}`}
            >
              <Star
                width={size}
                height={size}
                className={filled ? "fill-accent" : "fill-none"}
                strokeWidth={1.75}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

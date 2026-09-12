import Link from "next/link";
import { Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";

interface TeacherCardData {
  slug: string;
  avatarInitials: string;
  avatarUrl?: string | null;
  name: string;
  title: string;
  subjectName: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
}

export function TeacherCard({ teacher }: { teacher: TeacherCardData }) {
  return (
    <Link href={`/teachers/${teacher.slug}`} className="group block h-full">
      <Card className="h-full items-center gap-3 p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <Avatar className="size-20 border-2 border-secondary">
          {teacher.avatarUrl ? (
            <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
          ) : null}
          <AvatarFallback className="bg-secondary text-lg font-semibold text-secondary-foreground">
            {teacher.avatarInitials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h3 className="font-display text-base font-semibold group-hover:underline">
            {teacher.name}
          </h3>
          <p className="text-sm text-muted-foreground">{teacher.title}</p>
        </div>

        <Badge variant="secondary">{teacher.subjectName}</Badge>

        <div className="flex items-center gap-2 pt-1">
          <StarRating value={teacher.rating} size={14} />
          <span className="text-xs text-muted-foreground">
            {teacher.rating.toFixed(1)} ({teacher.reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          {teacher.studentCount.toLocaleString()} طالب
        </div>
      </Card>
    </Link>
  );
}

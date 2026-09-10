import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ApiUser } from "@/lib/api-types";
import {
  getEducationLevelLabel,
  getGradeLabel,
} from "@/lib/education-options";

export function ProfileHeader({ user }: { user: ApiUser }) {
  const educationLevelLabel = getEducationLevelLabel(user.educationLevel);
  const gradeLabel = getGradeLabel(user.grade);

  return (
    <div className="flex flex-wrap items-center gap-5">
      <Avatar className="size-20 border-2 border-secondary">
        <AvatarFallback className="bg-secondary text-xl font-semibold text-secondary-foreground">
          {user.avatarInitials}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {user.fullName}
        </h1>
        <p className="text-muted-foreground">
          {gradeLabel ?? educationLevelLabel ?? "طالب"} · {user.email}
        </p>
      </div>
    </div>
  );
}

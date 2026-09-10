import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { COURSES } from "@/data/mock-data";

export function ProfileCoursesTab() {
  const enrolledCourses = COURSES.slice(0, 3);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        عرض توضيحي لدوراتك — لا يوجد بعد نظام تسجيل وتتبّع تقدّم متصل بالخادم.
      </p>
      {enrolledCourses.map((course, index) => {
        const progress = [66, 20, 100][index] ?? 0;
        return (
          <Card key={course.id} className="flex-row items-center gap-4 p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{course.title}</p>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={progress} className="h-1.5 max-w-40" />
                <span className="text-xs text-muted-foreground">{progress}٪</span>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${course.slug}`}>
                {progress === 100 ? "مراجعة" : "متابعة"}
              </Link>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

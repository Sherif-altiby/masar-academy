"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";
import { RatePlatformCard } from "@/components/shared/rate-platform-card";
import { useMyTeacherReviews, useSubmitTeacherReview } from "@/hooks/use-reviews";

export function ProfileRatingsTab() {
  const { data: myReviews } = useMyTeacherReviews();
  const submitReview = useSubmitTeacherReview();

  return (
    <div className="space-y-6">
      <RatePlatformCard />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">تقييماتك للمدرّسين</CardTitle>
          <CardDescription>
            حدّث تقييمك في أي وقت تتغير فيه تجربتك.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(myReviews ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">
              لم تقيّم أي مدرّس بعد.
            </p>
          )}
          {(myReviews ?? []).map((review) => (
            <div
              key={review.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-xs">
                    {review.teacher.user.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/teachers/${review.teacher.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {review.teacher.user.fullName}
                  </Link>
                  <Badge variant="secondary" className="mt-0.5 block w-fit">
                    {review.teacher.title}
                  </Badge>
                </div>
              </div>
              <StarRating
                value={review.rating}
                size={18}
                onChange={(value) => {
                  submitReview.mutate(
                    { teacherId: review.teacherId, rating: value },
                    {
                      onSuccess: () =>
                        toast.success(
                          `تم تحديث تقييمك لـ${review.teacher.user.fullName}.`
                        ),
                    }
                  );
                }}
              />
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/teachers">
              <Star /> قيّم مدرّسًا آخر
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

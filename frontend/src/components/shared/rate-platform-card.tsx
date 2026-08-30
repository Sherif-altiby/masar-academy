"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/shared/star-rating";
import { useRatePlatform } from "@/hooks/use-reviews";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

export function RatePlatformCard() {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const ratePlatform = useRatePlatform();

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم بالنجوم أولاً.");
      return;
    }
    try {
      await ratePlatform.mutateAsync({ rating, comment: comment || undefined });
      toast.success("شكرًا لمساعدتنا في تطوير أكاديمية مسار!");
      setComment("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "تعذّر إرسال التقييم"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">قيّم أكاديمية مسار</CardTitle>
        <CardDescription>
          أخبرنا كيف كانت تجربتك العامة على المنصة.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>تقييمك</Label>
          <StarRating value={rating} onChange={setRating} size={26} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="platform-comment">تعليق (اختياري)</Label>
          <Textarea
            id="platform-comment"
            placeholder="ما الذي يعمل بشكل جيد؟ وما الذي يمكن تحسينه؟"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit} disabled={ratePlatform.isPending}>
          {ratePlatform.isPending ? "جارٍ الإرسال…" : "إرسال الملاحظات"}
        </Button>
      </CardContent>
    </Card>
  );
}

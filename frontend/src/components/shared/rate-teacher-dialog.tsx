"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/shared/star-rating";
import { useAuth } from "@/providers/auth-provider";
import { useRateTeacher } from "@/hooks/use-reviews";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

export function RateTeacherDialog({
  teacherId,
  teacherName,
}: {
  teacherId: string;
  teacherName: string;
}) {
  const router = useRouter();
  const { isAuthenticated, isStudent } = useAuth();
  const rateTeacher = useRateTeacher(teacherId);

  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  function handleTriggerClick(event: React.MouseEvent) {
    if (!isAuthenticated) {
      event.preventDefault();
      toast.error("سجّل الدخول أولاً لتتمكن من تقييم المدرّس.");
      router.push("/login");
    }
  }

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم بالنجوم أولاً.");
      return;
    }
    try {
      await rateTeacher.mutateAsync({ rating, comment: comment || undefined });
      toast.success(`شكرًا لك! تم إرسال تقييمك لـ${teacherName}.`);
      setOpen(false);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "تعذّر إرسال التقييم"));
    }
  }

  if (isAuthenticated && !isStudent) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleTriggerClick}>
          <Star /> قيّم هذا المدرّس
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>قيّم {teacherName}</DialogTitle>
          <DialogDescription>
            رأيك يساعد طلابًا آخرين على اختيار المدرّس المناسب.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>تقييمك</Label>
            <StarRating value={rating} onChange={setRating} size={26} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">تعليق (اختياري)</Label>
            <Textarea
              id="comment"
              placeholder="ما الذي أعجبك في أسلوب هذا المدرّس؟"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={rateTeacher.isPending}>
            {rateTeacher.isPending ? "جارٍ الإرسال…" : "إرسال التقييم"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

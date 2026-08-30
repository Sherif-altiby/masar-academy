import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";

interface ReviewPayload {
  rating: number;
  comment?: string;
}

export interface MyTeacherReview {
  id: string;
  teacherId: string;
  rating: number;
  comment: string | null;
  teacher: {
    slug: string;
    title: string;
    user: { fullName: string; avatarInitials: string };
    subjectId: string;
  };
}

export function useMyTeacherReviews() {
  return useQuery({
    queryKey: ["my-teacher-reviews"],
    queryFn: () =>
      unwrap<{ reviews: MyTeacherReview[] }>(apiClient.get("/reviews/teachers/mine")).then(
        (d) => d.reviews
      ),
  });
}

export function useSubmitTeacherReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teacherId, ...payload }: ReviewPayload & { teacherId: string }) =>
      unwrap(apiClient.post(`/reviews/teachers/${teacherId}`, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["my-teacher-reviews"] });
    },
  });
}

export function useRateTeacher(teacherId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPayload) =>
      unwrap(apiClient.post(`/reviews/teachers/${teacherId}`, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["my-teacher-reviews"] });
    },
  });
}

export function useRatePlatform() {
  return useMutation({
    mutationFn: (payload: ReviewPayload) => unwrap(apiClient.post("/reviews/platform", payload)),
  });
}

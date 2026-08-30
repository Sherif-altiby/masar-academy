import { useMutation, useQuery } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";
import {
  ApiLessonDetail,
  ApiQuizAttemptAnswer,
  ApiQuizAttemptResponse,
  ApiQuizForTaking,
} from "@/lib/api-types";

export function useLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () =>
      unwrap<{ lesson: ApiLessonDetail }>(apiClient.get(`/lessons/${lessonId}`)).then(
        (d) => d.lesson
      ),
    enabled: Boolean(lessonId),
  });
}

export function useQuizForTaking(lessonId: string | undefined) {
  return useQuery({
    queryKey: ["lesson-quiz", lessonId],
    queryFn: () =>
      unwrap<{ quiz: ApiQuizForTaking }>(apiClient.get(`/lessons/${lessonId}/quiz`)).then(
        (d) => d.quiz
      ),
    enabled: Boolean(lessonId),
  });
}

export function useSubmitQuizAttempt(lessonId: string | undefined) {
  return useMutation({
    mutationFn: (payload: { answers: ApiQuizAttemptAnswer[]; timedOut: boolean }) =>
      unwrap<ApiQuizAttemptResponse>(
        apiClient.post(`/lessons/${lessonId}/quiz/attempts`, payload)
      ),
  });
}

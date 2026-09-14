import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";
import {
  ApiCourseDetail,
  ApiCourseEnrollmentResponse,
  ApiCourseSummary,
} from "@/lib/api-types";

export function useCourses(filters?: { subjectId?: string; teacherId?: string }) {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: () =>
      unwrap<{ courses: ApiCourseSummary[] }>(
        apiClient.get("/courses", {
          params: { subject: filters?.subjectId, teacher: filters?.teacherId },
        })
      ).then((d) => d.courses),
  });
}

export function useCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: () =>
      unwrap<{ course: ApiCourseDetail }>(apiClient.get(`/courses/${slug}`)).then(
        (d) => d.course
      ),
    enabled: Boolean(slug),
  });
}

export function useEnrollCourse(slug: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      unwrap<{ enrollment: ApiCourseEnrollmentResponse }>(
        apiClient.post(`/courses/${slug}/enroll`)
      ).then((data) => data.enrollment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", slug] });
    },
  });
}

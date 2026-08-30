import { useQuery } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";
import { ApiCourseDetail, ApiCourseSummary } from "@/lib/api-types";

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

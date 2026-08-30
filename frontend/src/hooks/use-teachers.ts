import { useQuery } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";
import { ApiTeacherDetail, ApiTeacherSummary } from "@/lib/api-types";

export function useTeachers(subjectId?: string) {
  return useQuery({
    queryKey: ["teachers", { subjectId }],
    queryFn: () =>
      unwrap<{ teachers: ApiTeacherSummary[] }>(
        apiClient.get("/teachers", { params: subjectId ? { subject: subjectId } : undefined })
      ).then((d) => d.teachers),
  });
}

export function useTeacher(slug: string | undefined) {
  return useQuery({
    queryKey: ["teacher", slug],
    queryFn: () =>
      unwrap<{ teacher: ApiTeacherDetail }>(apiClient.get(`/teachers/${slug}`)).then(
        (d) => d.teacher
      ),
    enabled: Boolean(slug),
  });
}

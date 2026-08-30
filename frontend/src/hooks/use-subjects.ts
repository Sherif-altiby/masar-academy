import { useQuery } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";
import { ApiSubject } from "@/lib/api-types";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => unwrap<{ subjects: ApiSubject[] }>(apiClient.get("/subjects")).then((d) => d.subjects),
  });
}

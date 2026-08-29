import { useQuery } from "@tanstack/react-query";
import { findCompetitors } from "../api/find-competitors";

export function useCompetitors(name: string) {
  return useQuery({
    queryKey: ["competitors", "search", name],
    queryFn: () => findCompetitors(name),
    enabled: name.trim().length > 0,
    placeholderData: (prev) => prev,
  });
}

import { useQuery } from "@tanstack/react-query";
import { findCompetitors } from "../api/find-competitors";

export function useCompetitors(name: string) {
  return useQuery({
    queryKey: ["competitors", "search", name],
    queryFn: ({ signal }) => findCompetitors(name, signal),
    enabled: name.trim().length > 0,
  });
}

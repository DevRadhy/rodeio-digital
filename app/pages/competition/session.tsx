import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { findCategoryById } from "@/features/categories/services/category-service";
import { findRegistrations } from "@/features/registration/services/registration-service";
import { CompetitionSessionHeader } from "../../components/shared/competition/competition-session-header";
import { CompetitionView } from "@/components/shared/competition/competition-view";

export default function CompetitionRun() {
  const { categoryId } = useParams();

  const { data: registrations = [] } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => findRegistrations(categoryId ?? ""),
  });

  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: () => findCategoryById(categoryId ?? ""),
  });

  if (!category) return;

  return (
    <div>
      <CompetitionSessionHeader category={category} />

      <CompetitionView competition={competition} category={category} />
    </div>
  );
}

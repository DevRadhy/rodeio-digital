import { PageHeader } from "@/components/shared/page-header";
import { useLocation, useParams } from "react-router";
import { FormRegistration } from "../components/form-registration";
import { useCategory } from "../hooks/use-category";

export default function Registrations() {
  const { categoryId } = useParams();
  const location = useLocation();
  const competitionId =
    typeof location.state?.competitionId === "string"
      ? location.state.competitionId
      : null;
  const backTo = competitionId
    ? `/competition/${encodeURIComponent(competitionId)}`
    : "/registrations";

  const category = useCategory(String(categoryId));

  if (category.isLoading) return <p role="status">Carregando modalidade...</p>;

  if (!category.data || category.isError)
    return (
      <PageHeader
        title="Modalidade indisponível"
        description="Não foi possível carregar os dados. Volte e tente novamente."
        backTo={backTo}
        backLabel={competitionId ? "Competição" : "Inscrições"}
      />
    );

  return (
    <div className="@container">
      <div className="m-4 flex flex-col gap-4">
        <PageHeader
          title={category.data.name}
          description="Registre uma inscrição."
          backTo={backTo}
          backLabel={competitionId ? "Competição" : "Inscrições"}
        />
        <div className="p-4">
          <FormRegistration category={category.data} />
        </div>
      </div>
    </div>
  );
}

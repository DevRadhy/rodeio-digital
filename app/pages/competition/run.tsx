import { Badge } from "@/components/ui/badge";
import { Item, ItemTitle } from "@/components/ui/item";
import { useCategories } from "@/stores/categories";
import { useCompetitionSession, type Status } from "@/stores/competition";
import { useRegistrations } from "@/stores/registration";
import type { Phase } from "@/types/competition";
import { useParams } from "react-router";

export default function CompetitionRun() {
  const getSession = useCompetitionSession((state) => state.getSession);
  const getCategory = useCategories((state) => state.getCategory);
  const getRegistrationByCompetition = useRegistrations(
    (state) => state.registrationByCompetition,
  );
  const { categoryId } = useParams();

  if (!categoryId) return;

  const category = getCategory(categoryId);

  if (!category) return;

  const session = getSession(categoryId);
  const registrations = getRegistrationByCompetition(category.id);

  const getStatus = (status: Status) => {
    switch (status) {
      case "running":
        return "Em andamento";
      case "paused":
        return "Em pausa";
      case "finished":
        return "Finalizada";
    }
  };

  const getRegistration = (registrationId: string) => {
    return registrations.find(
      (registration) => registration.id === registrationId,
    );
  };

  console.log(session)

  return (
    <>
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2 my-6 text-xs uppercase tracking-widest font-semibold">
          <span
            className={
              session.run.phase === "qualification"
                ? "text-amber-400"
                : "text-slate-600"
            }
          >
            Classificação
          </span>
          <span className="text-slate-700">—</span>
          <span
            className={
              session.run.phase === "final"
                ? "text-amber-400"
                : "text-slate-600"
            }
          >
            Final
          </span>
          <span className="text-slate-700">—</span>
          <span
            className={
              session.run.phase === "closed"
                ? "text-amber-400"
                : "text-slate-600"
            }
          >
            Encerrada
          </span>
        </div>
        <Badge>{getStatus(session.status)}</Badge>
      </div>
      <div>
        <span>
          {session.run.qualification.currentRound + 1}/{category.rounds} Voltas
        </span>
      </div>
      <div>
        {session.run.qualification.registrations.map((r) => {
          const registration = getRegistration(r.registrationId)
          
          return (
            <Item>
              <ItemTitle>{registration?.competitors.map((competitor) => competitor.name)}</ItemTitle>
            </Item>
          );
        })}
      </div>
    </>
  );
}

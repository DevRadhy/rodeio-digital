import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/features/auth/auth-context";
import { api } from "@/providers/api";
import { useForceLightMode } from "../hooks/use-force-light-mode";

export default function LiveDisplay() {
  useForceLightMode();
  const auth = useAuth();
  const location = useLocation();
  const gate = location.pathname.startsWith("/gate");
  const expectedRole = gate ? "DISPLAY_GATE" : "DISPLAY_SCOREBOARD";
  const current = useQuery({
    queryKey: ["live-display-competition", auth.event?.id],
    queryFn: async ({ signal }) =>
      (
        await api.get<{ competitionId: string | null }>("/competition/live", {
          signal,
        })
      ).data,
    enabled: Boolean(auth.event),
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
  });

  if (
    auth.user?.globalRole === "USER" &&
    auth.event?.role !== expectedRole &&
    !(expectedRole === "DISPLAY_SCOREBOARD" && auth.event?.role === "ANNOUNCER")
  )
    return <Navigate to="/competition" replace />;
  if (current.data?.competitionId)
    return (
      <Navigate
        to={`/${gate ? "gate" : "scoreboard"}/${current.data.competitionId}`}
        replace
      />
    );
  return (
    <main className="light grid min-h-screen place-items-center bg-background p-10 text-foreground">
      <div className="max-w-2xl text-center">
        <p className="font-display text-xl font-bold uppercase tracking-[0.25em] text-primary">
          Rodeo Digital
        </p>
        <h1 className="mt-5 font-display text-5xl font-extrabold uppercase">
          Aguardando a competição
        </h1>
        <p className="mt-4 text-xl text-muted-foreground" role="status">
          O telão mudará automaticamente quando o juiz iniciar uma modalidade.
        </p>
      </div>
    </main>
  );
}

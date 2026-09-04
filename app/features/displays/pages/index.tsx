import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clipboard,
  ExternalLink,
  Monitor,
  MonitorPlay,
  Plus,
  Radio,
  ShieldOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-context";
import { getCompetition } from "@/features/competition/api/getCompetition";
import { api } from "@/providers/api";

type DeviceType = "starting_screen" | "audience_screen";
type Device = {
  id: string;
  name: string;
  type: DeviceType;
  activatedAt: string;
  revokedAt: string | null;
  createdAt: string;
};

const displays: {
  type: DeviceType;
  title: string;
  description: string;
  path: string;
  icon: typeof Monitor;
}[] = [
  {
    type: "starting_screen",
    title: "Telão da saída",
    description: "Mostra o competidor atual e quem se prepara para entrar.",
    path: "/gate",
    icon: MonitorPlay,
  },
  {
    type: "audience_screen",
    title: "Telão da arquibancada",
    description: "Exibe rodada, pelotão, resultados, parciais e bônus.",
    path: "/scoreboard",
    icon: Monitor,
  },
];

export default function DisplaysPage() {
  const auth = useAuth();
  const client = useQueryClient();
  const canManage = auth.user?.globalRole !== "USER";
  const [names, setNames] = useState<Record<DeviceType, string>>({
    starting_screen: "",
    audience_screen: "",
  });
  const [activationCode, setActivationCode] = useState<string | null>(null);

  const devices = useQuery({
    queryKey: ["event-devices", auth.event?.id],
    queryFn: async () => (await api.get<Device[]>("/devices")).data,
  });
  const live = useQuery({
    queryKey: ["competition", "live", auth.event?.id],
    queryFn: async () =>
      (await api.get<{ competitionId: string | null }>("/competition/live"))
        .data,
    refetchInterval: 5000,
  });
  const competition = useQuery({
    queryKey: ["competition", live.data?.competitionId],
    queryFn: () => {
      const competitionId = live.data?.competitionId;
      if (!competitionId) throw new Error("Modalidade ativa não encontrada.");
      return getCompetition(competitionId);
    },
    enabled: Boolean(live.data?.competitionId),
  });
  const create = useMutation({
    mutationFn: async (type: DeviceType) =>
      (
        await api.post<Device & { activationCode: string }>("/devices", {
          type,
          name: names[type],
        })
      ).data,
    onSuccess: async (device) => {
      setNames((current) => ({ ...current, [device.type]: "" }));
      setActivationCode(device.activationCode);
      await client.invalidateQueries({ queryKey: ["event-devices"] });
      toast.success("Credencial do telão criada.");
    },
    onError: () => toast.error("Não foi possível criar o telão."),
  });
  const revoke = useMutation({
    mutationFn: (id: string) => api.delete(`/devices/${id}`),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["event-devices"] });
      toast.success("Credencial revogada.");
    },
    onError: () => toast.error("Não foi possível revogar a credencial."),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telões"
        description="Prepare e acompanhe os dispositivos de exibição deste evento."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="size-4 text-primary" /> Transmissão atual
          </CardTitle>
          <CardDescription>
            Os dois telões acompanham automaticamente as ações do juiz.
          </CardDescription>
          <CardAction>
            <Badge variant={competition.data ? "default" : "outline"}>
              {competition.data ? "Em transmissão" : "Aguardando modalidade"}
            </Badge>
          </CardAction>
        </CardHeader>
        {competition.data && (
          <CardContent className="flex flex-wrap gap-x-8 gap-y-2 border-t pt-5">
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Modalidade
              </p>
              <p className="font-semibold">{competition.data.category.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Fase</p>
              <p className="font-semibold">
                {competition.data.phase === "final"
                  ? "Final"
                  : "Classificatória"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Status</p>
              <p className="font-semibold">
                {competition.data.status === "running"
                  ? "Em andamento"
                  : "Aguardando"}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {activationCode && (
        <Card className="border-primary/30 bg-primary/5 ring-primary/20">
          <CardHeader>
            <CardTitle>Código de ativação</CardTitle>
            <CardDescription>
              Abra a rota /device no telão e informe este código. Ele será
              exibido somente agora.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 break-all rounded-xl border bg-background p-3 text-xs">
              {activationCode}
            </code>
            <Button
              variant="outline"
              onClick={() => {
                void navigator.clipboard.writeText(activationCode);
                toast.success("Código copiado.");
              }}
            >
              <Clipboard /> Copiar
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {displays.map((display) => {
          const entries = (devices.data ?? []).filter(
            (device) => device.type === display.type,
          );
          return (
            <Card key={display.type}>
              <CardHeader>
                <display.icon className="size-7 text-primary" />
                <CardTitle className="font-display text-2xl font-bold uppercase">
                  {display.title}
                </CardTitle>
                <CardDescription>{display.description}</CardDescription>
                <CardAction>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(display.path, "_blank", "noopener,noreferrer")
                    }
                  >
                    <ExternalLink /> Visualizar
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4 border-t pt-5">
                {canManage && (
                  <div className="flex gap-2">
                    <Input
                      value={names[display.type]}
                      onChange={(event) =>
                        setNames((current) => ({
                          ...current,
                          [display.type]: event.target.value,
                        }))
                      }
                      placeholder="Nome do dispositivo"
                      aria-label={`Nome do ${display.title.toLowerCase()}`}
                    />
                    <Button
                      disabled={
                        names[display.type].trim().length < 2 ||
                        create.isPending
                      }
                      onClick={() => create.mutate(display.type)}
                    >
                      <Plus /> Criar
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  {devices.isLoading && (
                    <p className="text-sm text-muted-foreground">
                      Carregando telões…
                    </p>
                  )}
                  {!devices.isLoading && entries.length === 0 && (
                    <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                      Nenhum dispositivo configurado para este telão.
                    </p>
                  )}
                  {entries.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between gap-3 rounded-xl border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{device.name}</p>
                        <Badge
                          className="mt-1"
                          variant={
                            device.revokedAt ? "destructive" : "secondary"
                          }
                        >
                          {device.revokedAt ? "Revogado" : "Ativo"}
                        </Badge>
                      </div>
                      {canManage && !device.revokedAt && (
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={<Button size="sm" variant="destructive" />}
                          >
                            <ShieldOff /> Revogar
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Revogar este telão?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {device.name} perderá o acesso imediatamente e
                                precisará de uma nova credencial.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => revoke.mutate(device.id)}
                              >
                                Revogar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, getActiveEventId } from "@/providers/api";
import { type EventRole, useAuth } from "./auth-context";

type Member = {
  userId: string;
  name: string;
  email: string;
  role: EventRole;
  active: boolean;
};
type Audit = {
  id: string;
  performedBy: string;
  action: string;
  createdAt: string;
};
type UserPage = {
  items: {
    id: string;
    name: string;
    email: string;
    globalRole: string;
    active: boolean;
  }[];
};
const labels: Record<EventRole, string> = {
  ORGANIZATION_ADMIN: "Administrador da organização",
  REGISTRATION_MANAGER: "Secretaria",
  JUDGE: "Juiz",
  ANNOUNCER: "Narrador",
  DISPLAY_GATE: "Telão da saída",
  DISPLAY_SCOREBOARD: "Telão da arquibancada",
};
export default function EventAccess() {
  const auth = useAuth(),
    client = useQueryClient(),
    eventId = getActiveEventId();
  const canManage = auth.user?.globalRole !== "USER";
  const [userId, setUserId] = useState(""),
    [role, setRole] = useState<EventRole>("REGISTRATION_MANAGER");
  const members = useQuery({
    queryKey: ["event-members", eventId],
    queryFn: async () =>
      (await api.get<Member[]>(`/events/${eventId}/members`)).data,
  });
  const audit = useQuery({
    queryKey: ["event-audit", eventId],
    queryFn: async () =>
      (await api.get<Audit[]>(`/events/${eventId}/audit`)).data,
  });
  const users = useQuery({
    queryKey: ["system", "operational-users"],
    enabled: canManage,
    queryFn: async () =>
      (
        await api.get<UserPage>("/system/users", { params: { pageSize: 50 } })
      ).data.items.filter((item) => item.active && item.globalRole === "USER"),
  });
  const save = useMutation({
    mutationFn: () => api.post(`/events/${eventId}/members`, { userId, role }),
    onSuccess: async () => {
      setUserId("");
      await client.invalidateQueries({ queryKey: ["event-members", eventId] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${eventId}/members/${id}`),
    onSuccess: async () =>
      client.invalidateQueries({ queryKey: ["event-members", eventId] }),
  });
  return (
    <div className="grid gap-6">
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar acesso</CardTitle>
            <CardDescription>
              Somente administradores da plataforma podem alterar a equipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Select
              value={userId}
              onValueChange={(value) => value && setUserId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.data?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} · {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={role}
              onValueChange={(value) => value && setRole(value as EventRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(labels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!userId || save.isPending}
              onClick={() => save.mutate()}
            >
              Vincular
            </Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Equipe do evento</CardTitle>
          <CardDescription>
            Contas autorizadas para trabalhar neste evento.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {members.data?.map((member) => (
            <div className="rounded-xl border p-3" key={member.userId}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{member.name}</p>
                <Badge variant={member.active ? "secondary" : "outline"}>
                  {member.active ? "Ativo" : "Bloqueado"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium">{labels[member.role]}</p>
                {canManage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove.mutate(member.userId)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Auditoria do evento</CardTitle>
          <CardDescription>
            Histórico das operações realizadas durante o evento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {audit.data?.map((item) => (
            <div className="rounded-xl border p-3" key={item.id}>
              <div className="flex justify-between gap-3">
                <p className="font-medium">{item.action}</p>
                <time className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("pt-BR")}
                </time>
              </div>
              <p className="text-xs text-muted-foreground">
                Responsável: {item.performedBy}
              </p>
            </div>
          ))}
          {audit.data?.length === 0 && (
            <p className="py-6 text-center text-muted-foreground">
              Nenhuma operação auditada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/providers/api";

export function ResetGroupBonuses({
  competitionId,
  groupId,
  groupName,
}: {
  competitionId: string;
  groupId: string;
  groupName: string;
}) {
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/competition/${competitionId}/reset-bonuses`, { groupId }),
    onSuccess: () => {
      setOpen(false);
      toast.success(`Bônus de ${groupName} zerados.`);
      for (const key of [
        "competition-group",
        "competition-round",
        "group-registrations",
      ])
        void client.invalidateQueries({
          queryKey: [key, competitionId, groupId],
        });
      void client.invalidateQueries({
        queryKey: ["scoreboard", competitionId],
      });
    },
  });
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          mutation.reset();
          setOpen(true);
        }}
      >
        Zerar bônus
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!mutation.isPending) setOpen(value);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zerar bônus de {groupName}?</AlertDialogTitle>
            <AlertDialogDescription>
              As inscrições de {groupName} ficarão com zero bônus. Os saldos dos
              outros grupos de final serão mantidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {mutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {isAxiosError(mutation.error)
                ? (mutation.error.response?.data?.message ??
                  "Não foi possível zerar os bônus.")
                : "Não foi possível zerar os bônus."}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? "Salvando..." : "Confirmar e zerar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

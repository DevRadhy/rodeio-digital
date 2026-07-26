import { Trash2 } from "lucide-react";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface AlertProps {
  onConfirm: () => void;
}

export function Alert({ onConfirm }: AlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant={"destructive"}>
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você deseja mesmo exluir essa modalidade?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeira. A modalidade será exluida
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={"outline"}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant={"destructive"} onClick={onConfirm}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

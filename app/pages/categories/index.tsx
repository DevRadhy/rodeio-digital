import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useCompetition } from "@/context/competition";
import type { Category } from "@/types/category";
import { Edit, Plus, Swords, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { CategoryModal } from "../../components/category-modal";
import type { Route } from "../../pages/categories/+types";
import { EmptyCategories } from "./empty";
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Modalidades" },
    {
      name: "Crie uma nova modalidade.",
      content: "Crie, edite e reoganize as modalidades do seu evento.",
    },
  ];
}

export default function Categories() {
  const { categories, setEditingCategory, deleteCategory } = useCompetition();
  const [open, setOpen] = useState<boolean>(false);

  const onEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  return (
    <>
      {categories.length ? (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>
              <Plus /> Adicionar Modalidade
            </Button>
          </div>

          <ItemGroup className="mt-4 flex flex-col gap-4">
            {categories?.map((category, index) => (
              <Item variant={"outline"} key={index}>
                <ItemMedia variant={"icon"}>
                  {category.forces.length ? <Swords /> : <Users />}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{category.name}</ItemTitle>
                  <ItemDescription className="flex flex-wrap gap-2">
                    <Badge variant={"secondary"}>
                      {category.competitors}{" "}
                      {category.competitors <= 1 ? "competidor" : "comptidores"}
                    </Badge>
                    <Badge
                      variant={
                        category.rounds <= 1 ? "destructive" : "secondary"
                      }
                    >
                      {category.rounds <= 1
                        ? "eliminatória"
                        : `${category.rounds} voltas`}
                    </Badge>
                    {!!category.forces.length && (
                      <Badge variant={"default"}>Duelo</Badge>
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant={"default"} onClick={() => onEdit(category)}>
                    <Edit />
                  </Button>
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
                          Essa ação não poderá ser desfeira. A modalidade será
                          exluida permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel variant={"outline"}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={() => deleteCategory(category.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </>
      ) : (
        <EmptyCategories>
          <Button onClick={() => setOpen(true)}>Adicionar Modalidade</Button>
        </EmptyCategories>
      )}

      <CategoryModal open={open} onOpenChange={setOpen} />
    </>
  );
}

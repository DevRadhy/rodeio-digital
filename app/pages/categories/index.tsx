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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useCategories } from "@/context/categories";
import type { Category } from "@/types/category";
import { Edit, Plus, Swords, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { CategoryModal } from "../../components/category-modal";
import type { Route } from "../../pages/categories/+types";
import { EmptyCategories } from "./empty";

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
  const { categories, setEditingCategory, deleteCategory } = useCategories();
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
              <Item variant={"outline"} key={category.id}>
                <ItemMedia variant={"icon"}>
                  {category.forces.length ? <Swords /> : <Users />}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{category.name}</ItemTitle>
                  <ItemDescription className="flex flex-wrap gap-2">
                    <Badge variant={"secondary"}>
                      {category.competitors}{" "}
                      {category.competitors <= 1 ? "competidor" : "competidores"}
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
                    {category.value ? (
                      <Badge variant={"secondary"}>
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(category.value)}
                      </Badge>
                    ) : (
                      <Badge>Gratuito</Badge>
                    )}

                    {category.isDuel && (
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
                <ItemFooter>
                  <div className="flex gap-4">
                    {category.isDuel &&
                      category.forces.map((force) => (
                        <Badge variant={"secondary"}>
                          <strong>
                            {force.name}
                            {": "}
                          </strong>
                          {force.rounds.join(", ")} Armadas
                        </Badge>
                      ))}
                  </div>
                </ItemFooter>
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

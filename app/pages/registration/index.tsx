import { RegistrationDialog } from "@/components/registration-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCategories } from "@/context/categories";
import type { Category } from "@/types/category";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Registration() {
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <>
      <section className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card size="sm">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Badge variant={"secondary"}>
                {category.competitors}{" "}
                {category.competitors <= 1 ? "competidor" : "competidores"}
              </Badge>
              <Badge
                variant={category.rounds <= 1 ? "destructive" : "secondary"}
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

              {category.isDuel && <Badge variant={"default"}>Duelo</Badge>}
            </CardContent>
            <CardFooter>
              <Button
                variant={"ghost"}
                onClick={() => setSelectedCategory(category)}
                className={"w-full"}
              >
                <Plus /> Adicionar Inscrição
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <RegistrationDialog
        category={selectedCategory}
        open={!!selectedCategory}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
        }}
      />
    </>
  );
}

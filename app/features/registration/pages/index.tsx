import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { CategoryCard } from "@/components/shared/categories/category-card";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/features/categories/api/list-categories";

export function meta() {
  return [
    { title: "Inscrições" },
    {
      name: "Adicione uma nova modalidade.",
      content: "Adicione, edite e reoganize as inscrições das modalidades.",
    },
  ];
}

export default function Registration() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const navigate = useNavigate();

  const handleOpenRegistration = (categoryId: string) => {
    navigate(`/registrations/${categoryId}`);
  };

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 m-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category}>
            <Button
              variant={"secondary"}
              onClick={() => handleOpenRegistration(category.id)}
              className={"w-full"}
            >
              <Plus /> Adicionar Inscrição
            </Button>
          </CategoryCard>
        ))}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import type { Category } from "@/features/categories/types/category";
import { CompetitionBadges } from "../competition-badges";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { CategoryBadges } from "./category-badges";

interface CategoryCardProps {
  category: Category;
  children: ReactNode;
}

export function CategoryCard({ category, children }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardAction>
          <div className="flex flex-wrap justify-end gap-2">
            <CompetitionBadges
              status={category.session?.status}
              phase={category.session?.phase}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center flex-1 gap-2">
        <CategoryBadges category={category} />
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}

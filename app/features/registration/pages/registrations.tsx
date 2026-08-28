import { useParams } from "react-router";
import { FormRegistration } from "../components/form-registration";
import { useCategory } from "../hooks/use-category";

export default function Registrations() {
  const { categoryId } = useParams();

  const category = useCategory(String(categoryId));

  if (category.isLoading) return;

  if (!category.data || category.isError) return;

  return (
    <div className="@container">
      <div className="m-4 flex flex-col gap-4">
        <div>
          <h1 className="font-extrabold text-3xl">{category.data.name}</h1>
          <p className="text-muted-foreground">Registre uma inscrição.</p>
        </div>
        <div className="p-4">
          <FormRegistration category={category.data} />
        </div>
      </div>
    </div>
  );
}

import CustomInput from "components/CustomInput";
import { useState } from "react";
import CategorySelect from "pages/recipe-creation/select/CategorySelect";
import "./styles.less";
import { CategoryGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import ThumbnailSelection from "./ThumbnailSelection";

interface LoaderResponse {
  readonly categories: CategoryGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.getCategories();
  return { categories };
}

interface RecipeData {
  readonly name: string;
  readonly categoryId: number | undefined;
}

interface RecipeCreationPageProps {}

const RecipeCreationPage = ({}: RecipeCreationPageProps) => {
  const { categories } = useLoaderData() as LoaderResponse;
  const [formData, setFormData] = useState<RecipeData>({
    name: "",
    categoryId: undefined,
  });

  return (
    <div className="page-layout-column recipe-creation-page">
      <h1>Nowy przepis</h1>
      <CustomInput
        value={formData.name}
        placeholder="Nazwa przepisu..."
        onChange={event => setFormData(prev => ({ ...prev, name: event.target.value }))}
      />
      <CategorySelect
        categories={categories}
        value={formData.categoryId?.toString() ?? ""}
        setValue={(categoryId: string) => setFormData(prev => ({ ...prev, categoryId: +categoryId }))}
      />
      <ThumbnailSelection />
    </div>
  );
};

export default RecipeCreationPage;

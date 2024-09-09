import "./styles.less";
import { CategoryGetDto, TagGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm from "components/recipe-creation-form/RecipeCreationForm";

interface LoaderResponse {
  readonly categories: readonly CategoryGetDto[];
  readonly tags: readonly TagGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.get.getCategories();
  const tags = await api.get.getTags();
  return { categories, tags };
}

const RecipeCreationPage = () => {
  const { categories, tags } = useLoaderData() as LoaderResponse;
  const { displayMessage } = useAlerts();

  const onSubmitCallback = async (dto: RecipeCreateDto): Promise<void> => {
    await api.post.createRecipe(dto);
    displayMessage({ type: "success", message: "Przepis został utworzony.", fadeOutAfter: 5000 });
  };

  return (
    <div className="page recipe-creation-page">
      <h1>Nowy przepis</h1>
      <RecipeCreationForm
        categories={categories}
        tags={tags}
        onSuccessNavigateTo="/recipes"
        onSubmitCallback={onSubmitCallback}
      />
    </div>
  );
};

export default RecipeCreationPage;

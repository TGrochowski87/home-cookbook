import "./styles.less";
import { CategoryGetDto, RecipeDetailsGetDto, TagGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm from "components/recipe-creation-form/RecipeCreationForm";

interface LoaderResponse {
  readonly recipe: RecipeDetailsGetDto;
  readonly categories: readonly CategoryGetDto[];
  readonly tags: readonly TagGetDto[];
}

export async function loader({ params }: any): Promise<LoaderResponse> {
  const recipe = await api.get.getRecipe(params.id);
  const categories = await api.get.getCategories();
  const tags = await api.get.getTags();
  return { recipe, categories, tags };
}

const RecipeEditionPage = () => {
  const { recipe, categories, tags } = useLoaderData() as LoaderResponse;
  const { displayMessage } = useAlerts();

  const onSubmitCallback = async (dto: RecipeCreateDto): Promise<void> => {
    await api.put.updateRecipe(recipe.id, recipe.updateDate, dto);
    displayMessage({ type: "success", message: "Zmiany zostały zapisane.", fadeOutAfter: 5000 });
  };

  return (
    <div className="page recipe-edition-page">
      <h1>Edycja przepisu</h1>
      <RecipeCreationForm
        recipe={recipe}
        categories={categories}
        tags={tags}
        onSuccessNavigateTo="/recipes"
        replaceOnNavigate
        onSubmitCallback={onSubmitCallback}
      />
    </div>
  );
};

export default RecipeEditionPage;

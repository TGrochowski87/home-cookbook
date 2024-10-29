import "./styles.less";
import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm from "components/recipe-creation-form/RecipeCreationForm";
import { useAppSelector } from "storage/redux/hooks";
import { fetchCategories } from "storage/redux/slices/categoriesSlice";
import { fetchTags } from "storage/redux/slices/tagsSlice";
import store from "storage/redux/store";

interface LoaderResponse {
  readonly recipe: RecipeDetailsGetDto;
}

export async function loader({ params }: any): Promise<LoaderResponse> {
  const recipe = await api.get.getRecipe(params.id);
  store.dispatch(fetchCategories());
  store.dispatch(fetchTags());
  return { recipe };
}

const RecipeEditionPage = () => {
  const { recipe } = useLoaderData() as LoaderResponse;
  const categories = useAppSelector(state => state.categories.categories);
  const tags = useAppSelector(state => state.tags.tags);

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

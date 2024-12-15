import "./styles.less";
import api from "api/api";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm from "components/recipe-creation-form/RecipeCreationForm";
import { useAppDispatch, useAppSelector } from "storage/redux/hooks";
import store from "storage/redux/store";
import storeActions from "storage/redux/actions";
import { useParams } from "react-router-dom";

export async function loader({ params }: any): Promise<null> {
  await store.dispatch(storeActions.recipes.async.fetchRecipe(+params.id)).unwrap();
  await store.dispatch(storeActions.categories.async.fetchCategories()).unwrap();
  await store.dispatch(storeActions.tags.async.fetchTags()).unwrap();
  return null;
}

const RecipeEditionPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories.categories);
  const tags = useAppSelector(state => state.tags.tags);
  const { recipes } = useAppSelector(state => state.recipes);
  const recipe = recipes[+id!];

  const { displayMessage } = useAlerts();

  const onSubmitCallback = async (dto: RecipeCreateDto): Promise<void> => {
    const updatedRecipe = await api.put.updateRecipe(recipe.id, recipe.updateDate, dto);
    sessionStorage.removeItem(`checks-recipe-${recipe.id}`);
    dispatch(storeActions.recipes.setRecipeInCache(updatedRecipe));
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

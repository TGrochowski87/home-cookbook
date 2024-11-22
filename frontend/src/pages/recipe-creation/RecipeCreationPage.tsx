import "./styles.less";
import api from "api/api";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm from "components/recipe-creation-form/RecipeCreationForm";
import store from "storage/redux/store";
import { useAppDispatch, useAppSelector } from "storage/redux/hooks";
import storeActions from "storage/redux/actions";

export async function loader(): Promise<null> {
  await store.dispatch(storeActions.categories.async.fetchCategories()).unwrap();
  await store.dispatch(storeActions.tags.async.fetchTags()).unwrap();
  return null;
}

const RecipeCreationPage = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories.categories);
  const tags = useAppSelector(state => state.tags.tags);

  const { displayMessage } = useAlerts();

  const onSubmitCallback = async (dto: RecipeCreateDto): Promise<void> => {
    const newRecipe = await api.post.createRecipe(dto);
    dispatch(storeActions.recipes.setRecipeInCache(newRecipe));
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

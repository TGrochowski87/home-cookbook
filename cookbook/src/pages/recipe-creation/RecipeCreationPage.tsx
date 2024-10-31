import "./styles.less";
import api from "api/api";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm from "components/recipe-creation-form/RecipeCreationForm";
import { fetchCategories } from "storage/redux/slices/categoriesSlice";
import { fetchTags } from "storage/redux/slices/tagsSlice";
import store from "storage/redux/store";
import { useAppSelector } from "storage/redux/hooks";

export async function loader(): Promise<null> {
  store.dispatch(fetchCategories());
  store.dispatch(fetchTags());
  return null;
}

const RecipeCreationPage = () => {
  const categories = useAppSelector(state => state.categories.categories);
  const tags = useAppSelector(state => state.tags.tags);

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

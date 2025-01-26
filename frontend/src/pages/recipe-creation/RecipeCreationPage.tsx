import "./styles.less";
import api from "api/api";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm, {
  EmptyRecipeCreationFormValues,
  RecipeData,
} from "components/recipe-creation-form/RecipeCreationForm";
import store from "storage/redux/store";
import { useAppDispatch, useAppSelector } from "storage/redux/hooks";
import storeActions from "storage/redux/actions";
import { useEffect, useRef, useState } from "react";

export async function loader(): Promise<null> {
  await store.dispatch(storeActions.categories.async.fetchCategories()).unwrap();
  await store.dispatch(storeActions.tags.async.fetchTags()).unwrap();
  return null;
}

const pendingChangesLocalStorageKey = "pendingCreate";

const RecipeCreationPage = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories.categories);
  const tags = useAppSelector(state => state.tags.tags);

  const { displayMessage } = useAlerts();

  const [initialFormData, setInitialFormData] = useState<RecipeData>();
  const [pendingChangesLoaded, setPendingChangesLoaded] = useState<boolean>(false);
  const firstRender = useRef<boolean>(true);

  const onSubmitCallback = async (dto: RecipeCreateDto): Promise<void> => {
    const newRecipe = await api.post.createRecipe(dto);
    localStorage.removeItem(pendingChangesLocalStorageKey);
    dispatch(storeActions.recipes.setRecipeInCache(newRecipe));
    displayMessage({ type: "success", message: "Recipe created.", fadeOutAfter: 5000 });
  };

  useEffect(() => {
    // This logic must be run only once.
    if (firstRender.current === false) {
      return;
    }
    firstRender.current = false;

    // An option to load the unsaved changes from the last session.
    const pendingCreate = localStorage.getItem(pendingChangesLocalStorageKey);
    if (pendingCreate && window.confirm("Bring back the unsaved changes?")) {
      const data = JSON.parse(pendingCreate) as RecipeData;
      setInitialFormData({ ...data, image: null }); // Binary data is not serializable.
      setPendingChangesLoaded(true);
      localStorage.removeItem(pendingChangesLocalStorageKey);
    } else {
      setInitialFormData(EmptyRecipeCreationFormValues);
    }
  }, []);

  return (
    <div className="page recipe-creation-page">
      <h1>New recipe</h1>
      {initialFormData && (
        <RecipeCreationForm
          categories={categories}
          tags={tags}
          onSuccessNavigateTo="/recipes"
          onSubmitCallback={onSubmitCallback}
          initialValues={initialFormData}
          pendingChangesLocalStorageKey={pendingChangesLocalStorageKey}
          initiallyDirty={pendingChangesLoaded}
        />
      )}
    </div>
  );
};

export default RecipeCreationPage;

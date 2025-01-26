import "./styles.less";
import api from "api/api";
import { RecipeCreateDto } from "api/POST/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import RecipeCreationForm, { RecipeData } from "components/recipe-creation-form/RecipeCreationForm";
import { useAppDispatch, useAppSelector } from "storage/redux/hooks";
import store from "storage/redux/store";
import storeActions from "storage/redux/actions";
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export async function loader(args: unknown): Promise<null> {
  const { params } = args as { params: { id: string } };
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
  const pendingChangesLocalStorageKey = useRef<string>(`pendingEdit-${recipe.id}`);

  const { displayMessage } = useAlerts();

  const [initialFormData, setInitialFormData] = useState<RecipeData>();
  const [pendingChangesLoaded, setPendingChangesLoaded] = useState<boolean>(false);
  const firstRender = useRef<boolean>(true);

  const onSubmitCallback = async (dto: RecipeCreateDto): Promise<void> => {
    const updatedRecipe = await api.put.updateRecipe(recipe.id, recipe.updateDate, dto);
    localStorage.removeItem(pendingChangesLocalStorageKey.current);
    dispatch(storeActions.recipes.setRecipeInCache(updatedRecipe));
    displayMessage({ type: "success", message: "Recipe updated.", fadeOutAfter: 5000 });
  };

  useEffect(() => {
    const prepareInitialFormData = async () => {
      // This logic must be run only once.
      if (firstRender.current === false) {
        return;
      }
      firstRender.current = false;

      // Binary data is not serializable so in both cases we use the current recipe image.
      const image = recipe.imageSrc ? await api.get.getImage(recipe.imageSrc) : null;

      // An option to load the unsaved changes from the last session.
      const pendingEdit = localStorage.getItem(pendingChangesLocalStorageKey.current);
      if (pendingEdit && window.confirm("Przywrócić ostatni stan formularza dla tego przepisu?")) {
        const data = JSON.parse(pendingEdit) as RecipeData;
        setInitialFormData({ ...data, image: image });
        setPendingChangesLoaded(true);
        localStorage.removeItem(pendingChangesLocalStorageKey.current);
      } else {
        setInitialFormData({
          name: recipe.name,
          categoryId: recipe.category.id,
          image: image,
          tags: recipe.tags.map(t => t.id),
          ingredients: recipe.ingredients.map(i => ({ ...i, key: i.id, checked: false })),
          description: recipe.description,
        });
      }
    };

    prepareInitialFormData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page recipe-edition-page">
      <h1>Edit recipe</h1>
      {initialFormData && (
        <RecipeCreationForm
          categories={categories}
          tags={tags}
          onSuccessNavigateTo="/recipes"
          replaceOnNavigate
          onSubmitCallback={onSubmitCallback}
          initialValues={initialFormData}
          pendingChangesLocalStorageKey={pendingChangesLocalStorageKey.current}
          initiallyDirty={pendingChangesLoaded}
        />
      )}
    </div>
  );
};

export default RecipeEditionPage;

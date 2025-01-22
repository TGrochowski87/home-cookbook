import { useNavigate, useParams } from "react-router-dom";
import "./styles.less";
import TitledSection from "components/TitledSection";
import TagSet from "components/tag-set/TagSet";
import IngredientListRead from "pages/recipe/IngredientListRead";
import RichTextArea from "components/rich-text-area/RichTextArea";
import { CirclePlus, Edit, Trash2 } from "lucide-react";
import { useAlerts } from "components/alert/AlertStack";
import AddToShoppingListScreen from "./AddToShoppingListScreen";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import QuantifiableItemData from "models/QuantifiableItemData";
import HomeButton from "components/buttons/HomeButton";
import store from "storage/redux/store";
import { useAppSelector } from "storage/redux/hooks";
import storeActions from "storage/redux/actions";

interface CheckboxChecks {
  readonly recipeStateTimestamp: string;
  readonly ingredients: readonly number[];
  readonly checkboxesInDescription: readonly number[];
}

export async function loader(args: unknown): Promise<null> {
  const { params } = args as { params: { id: string } };
  await store.dispatch(storeActions.recipes.async.fetchRecipe(+params.id)).unwrap();
  await store.dispatch(storeActions.shoppingLists.async.fetchShoppingLists()).unwrap();
  return null;
}

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayMessage } = useAlerts();
  const { shoppingLists } = useAppSelector(state => state.shoppingLists);
  const { recipes } = useAppSelector(state => state.recipes);
  const recipe = recipes[+id!];

  // This list needs to be created in this component as it is used for checkbox state caching mechanism.
  const [ingredients, setIngredients] = useState<ReadonlyArray<QuantifiableItemData>>(
    recipe.ingredients.map(i => ({ ...i, key: i.id }))
  );

  // Reference to array under useRef is not changed on rerender, so it can be safely used in cleanup functions.
  const ingredientChecks = useRef<readonly number[]>([]);

  const cacheCheckboxChecksInSessionStorage = () => {
    const richTextArea = document.getElementsByClassName("rich-text-area-editor")[0] as HTMLDivElement;

    /**
     * This is probably only needed in development as this is the cleanup function and the problem is that
     * component dismounts right away in strict mode before rich-text-area-editor is rendered.
     */
    if (richTextArea === undefined) {
      return;
    }

    const checkboxes = [...richTextArea.getElementsByTagName("input")];
    const indexesOfChecked = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].getAttribute("checked") === "true") {
        indexesOfChecked.push(i);
      }
    }

    const checksObject: CheckboxChecks = {
      recipeStateTimestamp: recipe.updateDate,
      ingredients: ingredientChecks.current,
      checkboxesInDescription: indexesOfChecked,
    };

    // If nothing is currently checked, make sure there is no empty entry in session storage.
    if (checksObject.checkboxesInDescription.length === 0 && checksObject.ingredients.length === 0) {
      sessionStorage.removeItem(`checks-recipe-${recipe.id}`);
      return;
    }

    sessionStorage.setItem(`checks-recipe-${recipe.id}`, JSON.stringify(checksObject));
  };

  const readCheckboxStateFromSessionStorage = () => {
    const cachedChecks = sessionStorage.getItem(`checks-recipe-${recipe.id}`);
    if (cachedChecks === null) {
      return;
    }

    const checks = JSON.parse(cachedChecks) as CheckboxChecks;

    // If recipe has been updated by someone else since the last time the checks were cached, clear them.
    // They also get cleared after confirming the edit.
    // TODO: If I allow recipe deletion one day, make sure to clear unnecessary session storage entries.
    if (checks.recipeStateTimestamp !== recipe.updateDate) {
      sessionStorage.removeItem(`checks-recipe-${recipe.id}`);
      displayMessage({
        type: "info",
        message: "All selections were cleared, because the recipe has been modified.",
        fadeOutAfter: 5000,
      });
      return;
    }

    setIngredients(prev => prev.map(i => (checks.ingredients.includes(i.key as number) ? { ...i, checked: true } : i)));

    /**
     * TipTap does not provide any event that fires after the text content is loaded, so the best I can do is
     * retrying a bunch of times.
     */
    let retryCount = 0;
    const intervalId = setInterval(() => {
      if (retryCount == 10) {
        clearInterval(intervalId);
        return;
      }

      const richTextArea = document.getElementsByClassName("rich-text-area-editor")[0] as HTMLDivElement;
      if (richTextArea === undefined) {
        retryCount++;
        return;
      }

      const checkboxes = [...richTextArea.getElementsByTagName("input")];
      checks.checkboxesInDescription.forEach(i => {
        /**
         * TipTap's checkboxes' HTML in read-only mode do not change at all on click, but somehow they get checked
         * when this attribute is provided.
         */
        checkboxes[i].setAttribute("checked", "true");
      });

      clearInterval(intervalId);
    }, 100);
  };

  /**
   * This keeps ingredientChecks ref up to date.
   */
  useEffect(() => {
    ingredientChecks.current = ingredients.filter(i => i.checked).map(i => i.key as number); // In this view all keys should be IDs, because ingredients are all saved.
  }, [ingredients]);

  /**
   * This handles reading checkbox state from sessionStorage as a component setup.
   * It also fills the cache on component dismount.
   *
   * It must be useLayoutEffect as normal useEffect fires after rich-text-area-editor is already removed from the DOM.
   */
  useLayoutEffect(() => {
    readCheckboxStateFromSessionStorage();

    return () => {
      cacheCheckboxChecksInSessionStorage();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * useEffect cleanup does not fire on page close/refresh so this is also needed.
   */
  useEffect(() => {
    window.addEventListener("beforeunload", cacheCheckboxChecksInSessionStorage);

    return () => {
      window.removeEventListener("beforeunload", cacheCheckboxChecksInSessionStorage);
    };

    // cacheCheckboxChecksInSessionStorage is used in two different useEffects, so this is needed to prevent infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients]);

  return (
    <div className="page recipe-page">
      <HomeButton homeTab="recipes" />
      <header>
        <h1>{recipe.name}</h1>
        <div style={{ "--color": recipe.category.color } as React.CSSProperties} className="category-indicator">
          <h3>{recipe.category.name}</h3>
          <span className="svg-space" dangerouslySetInnerHTML={{ __html: recipe.category.symbol }} />
        </div>
      </header>

      <div className="image-space floating">
        {recipe.imageSrc ? (
          <img src={recipe.id > 5 ? recipe.imageSrc : `../${recipe.imageSrc}`} />
        ) : (
          <div className="image-placeholder" dangerouslySetInnerHTML={{ __html: recipe.category.symbol }} />
        )}
      </div>

      <TagSet tags={recipe.tags} tagSize="small" />

      <TitledSection title="Ingredients">
        <IngredientListRead ingredients={ingredients} setIngredients={setIngredients} />
        <AddToShoppingListScreen recipeId={recipe.id} shoppingLists={shoppingLists} />
      </TitledSection>

      <TitledSection title="Description">
        <RichTextArea value={recipe.description} />
      </TitledSection>

      <div className="bottom-buttons-bar">
        <button
          onClick={() =>
            displayMessage({ type: "info", message: "This feature is not implemented yet.", fadeOutAfter: 5000 })
          }>
          <CirclePlus />
          <p>Variant</p>
        </button>

        <button onClick={() => navigate(`/recipes/${recipe.id}/edit`)}>
          <Edit />
          <p>Edit</p>
        </button>

        <button
          onClick={() =>
            displayMessage({ type: "info", message: "This feature is not implemented yet.", fadeOutAfter: 5000 })
          }>
          <Trash2 />
          <p>Delete</p>
        </button>
      </div>
    </div>
  );
};

export default RecipePage;

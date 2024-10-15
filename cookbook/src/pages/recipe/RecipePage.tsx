import { RecipeDetailsGetDto, ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
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
import HomeButton from "components/HomeButton";

interface CheckboxChecks {
  readonly ingredients: readonly number[];
  readonly checkboxesInDescription: readonly number[];
}

interface LoaderResponse {
  readonly recipe: RecipeDetailsGetDto;
  readonly shoppingLists: readonly ShoppingListGetDto[];
}

// TODO: Implement redux
export async function loader({ params }: any): Promise<LoaderResponse> {
  const recipe = await api.get.getRecipe(params.id);
  const shoppingLists = await api.get.getShoppingLists();
  return { recipe, shoppingLists };
}

const RecipePage = () => {
  const { displayMessage } = useAlerts();
  const { recipe, shoppingLists } = useLoaderData() as LoaderResponse;
  const navigate = useNavigate();

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
      ingredients: ingredientChecks.current,
      checkboxesInDescription: indexesOfChecked,
    };

    // TODO: Clear session storage on recipe edit.
    sessionStorage.setItem(`checks-recipe-${recipe.id}`, JSON.stringify(checksObject));
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
    const cachedChecks = sessionStorage.getItem(`checks-recipe-${recipe.id}`);
    if (cachedChecks) {
      const checks = JSON.parse(cachedChecks) as CheckboxChecks;

      setIngredients(prev =>
        prev.map(i => (checks.ingredients.includes(i.key as number) ? { ...i, checked: true } : i))
      );

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
    }

    return () => {
      cacheCheckboxChecksInSessionStorage();
    };
  }, []);

  /**
   * useEffect cleanup does not fire on page close/refresh so this is also needed.
   */
  useEffect(() => {
    window.addEventListener("beforeunload", cacheCheckboxChecksInSessionStorage);

    return () => {
      window.removeEventListener("beforeunload", cacheCheckboxChecksInSessionStorage);
    };
  }, [ingredients]);

  return (
    <div className="page recipe-page">
      <HomeButton homeTab="recipes" />
      <header>
        <h1>{recipe.name}</h1>
        {/* @ts-ignore */}
        <div style={{ "--color": recipe.category.color }} className="category-indicator">
          <h3>{recipe.category.name}</h3>
        </div>
      </header>

      <div className="image-space floating">
        <img src={recipe.imageSrc ?? BurgerPlaceHolder} />
      </div>

      <TagSet tags={recipe.tags} tagSize="small" />

      <TitledSection title="Składniki">
        <IngredientListRead ingredients={ingredients} setIngredients={setIngredients} />
        <AddToShoppingListScreen recipeId={recipe.id} shoppingLists={shoppingLists} />
      </TitledSection>

      <TitledSection title="Treść">
        <RichTextArea value={recipe.description} />
      </TitledSection>

      <div className="bottom-buttons-bar">
        <button
          onClick={() =>
            displayMessage({ type: "info", message: "Ten przycisk na razie nic nie robi :)", fadeOutAfter: 5000 })
          }>
          <CirclePlus />
          <p>Wariant</p>
        </button>

        <button onClick={() => navigate(`/recipes/${recipe.id}/edit`)}>
          <Edit />
          <p>Edytuj</p>
        </button>

        <button>
          <Trash2 />
          <p>Usuń</p>
        </button>
      </div>
    </div>
  );
};

export default RecipePage;

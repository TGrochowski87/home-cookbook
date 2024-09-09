import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import TitledSection from "components/TitledSection";
import TagSet from "components/tag-set/TagSet";
import IngredientListRead from "pages/recipe/IngredientListRead";
import RichTextArea from "components/rich-text-area/RichTextArea";
import { CirclePlus, Edit, Trash2 } from "lucide-react";
import { useAlerts } from "components/alert/AlertStack";

export async function loader({ params }: any) {
  const recipe = await api.get.getRecipe(params.id);
  return recipe;
}

const RecipePage = () => {
  const { displayMessage } = useAlerts();
  const recipe = useLoaderData() as RecipeDetailsGetDto;

  return (
    <div className="page recipe-page">
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
        <IngredientListRead ingredients={recipe.ingredients} />
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

        <button>
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

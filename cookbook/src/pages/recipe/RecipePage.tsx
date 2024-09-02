import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { Form, useLoaderData } from "react-router-dom";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import TitledSection from "components/TitledSection";
import Button from "components/Button";
import TagSet from "components/tag-set/TagSet";
import IngredientListRead from "pages/recipe/IngredientListRead";

export async function loader({ params }: any) {
  const recipe = await api.get.getRecipe(params.id);
  return recipe;
}

const RecipePage = () => {
  const recipe = useLoaderData() as RecipeDetailsGetDto;

  return (
    <div className="page recipe-page">
      <div>
        <h1>{recipe.name}</h1>
        {/* @ts-ignore */}
        <div style={{ "--color": recipe.category.color }} className="category-indicator">
          <h3>{recipe.category.name}</h3>
        </div>
      </div>

      <div className="image-space floating">
        <img src={recipe.imageSrc ?? BurgerPlaceHolder} />
      </div>

      <TagSet tags={recipe.tags} tagSize="small" />

      <TitledSection title="Składniki">
        <IngredientListRead ingredients={recipe.ingredients} />
      </TitledSection>

      {/* use TipTap */}
      <TitledSection title="Treść">{recipe.description}</TitledSection>

      <Form className="bottom-button-space">
        <Button>edytuj</Button>
        <Button>stwórz wariant</Button>
      </Form>
    </div>
  );
};

export default RecipePage;

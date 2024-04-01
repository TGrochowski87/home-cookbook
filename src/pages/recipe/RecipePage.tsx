import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";

export async function loader({ params }: any) {
  const recipe = await api.getRecipe(params.id);
  return recipe;
}

const RecipePage = () => {
  const recipe = useLoaderData() as RecipeDetailsGetDto;

  return (
    <div className="page-layout-column recipe-page">
      <h2>{recipe.title}</h2>
      <div className="image-space">
        <img src={BurgerPlaceHolder} />
      </div>
    </div>
  );
};

export default RecipePage;

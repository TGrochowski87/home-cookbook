import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import TagChip from "components/TagChip";
import IngredientsList from "components/IngredientsList";

export async function loader({ params }: any) {
  const recipe = await api.getRecipe(params.id);
  return recipe;
}

const RecipePage = () => {
  const recipe = useLoaderData() as RecipeDetailsGetDto;

  return (
    <div className="page-layout-column recipe-page">
      <div>
        <h1>{recipe.title}</h1>
        <div style={{ "--color": recipe.category.color }} className="category-indicator">
          <h3>{recipe.category.name}</h3>
        </div>
      </div>
      <div className="image-space floating">
        <img src={BurgerPlaceHolder} />
      </div>
      <div className="tag-list-info">
        {recipe.tags.map(tag => (
          <TagChip key={tag.id} tag={tag} />
        ))}
      </div>
      <IngredientsList ingredients={recipe.ingredients} />
    </div>
  );
};

export default RecipePage;

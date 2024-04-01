import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
  const recipe = await api.getRecipe(params.id);
  return recipe;
}

const RecipePage = () => {
  const recipe = useLoaderData() as RecipeDetailsGetDto;

  return (
    <div>
      <h1>XD</h1>
      <h1>XD</h1>
    </div>
  );
};

export default RecipePage;

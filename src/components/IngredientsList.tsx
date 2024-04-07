import { IngredientGetDto } from "api/GET/DTOs";
import Ingredient from "./Ingredient";

interface IngredientsListProps {
  readonly ingredients: IngredientGetDto[];
}

const IngredientsList = ({ ingredients }: IngredientsListProps) => {
  return (
    <div className="ingredients-list">
      <h2>Składniki</h2>
      <div className="divider" />
      <ol>
        {ingredients.map(i => (
          <Ingredient ingredient={i} />
        ))}
      </ol>
    </div>
  );
};

export default IngredientsList;

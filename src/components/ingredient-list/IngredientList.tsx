import IngredientListItem, { IngredientItemAction } from "components/ingredient-list/IngredientListItem";
import Ingredient from "models/Ingredient";

interface IngredientListProps {
  readonly ingredients: readonly Ingredient[];
  readonly itemAction: IngredientItemAction;
}

const IngredientList = ({ ingredients, itemAction }: IngredientListProps) => {
  return (
    <ol className="ingredient-list">
      {ingredients.map(i => (
        <IngredientListItem key={i.key} ingredient={i} action={itemAction} />
      ))}
    </ol>
  );
};

export default IngredientList;

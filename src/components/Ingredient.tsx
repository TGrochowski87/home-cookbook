import { Amount, IngredientGetDto } from "api/GET/DTOs";
import "./styles.less";
import Checkbox from "./Checkbox";

interface IngredientProps {
  readonly ingredient: IngredientGetDto;
}

const Ingredient = ({ ingredient }: IngredientProps) => {
  const displayAmount = (amount: Amount): JSX.Element => {
    if ("unit" in amount) {
      return (
        <>
          <p>{amount.value}</p>
          <p>{amount.unit}</p>
        </>
      );
    } else {
      return <p className="unitless-value">{amount.value}</p>;
    }
  };

  return (
    <li className="ingredient">
      <div className="ingredient-data">
        <p>{ingredient.name}</p>
        {displayAmount(ingredient.amount)}
        <Checkbox />
      </div>
    </li>
  );
};

export default Ingredient;

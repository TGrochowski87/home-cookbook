import { Amount } from "api/GET/DTOs";
import "./styles.less";
import Checkbox from "../Checkbox";
import Ingredient from "models/Ingredient";
import PlusIcon from "components/PlusIcon";

export interface IngredientItemAction {
  readonly type: "check" | "remove";
  readonly callback: (name: string) => void;
}

interface IngredientListItemProps {
  readonly ingredient: Ingredient;
  readonly action: IngredientItemAction;
}

const IngredientListItem = ({ ingredient, action }: IngredientListItemProps) => {
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
    <li className="ingredient-list-item">
      <div className="ingredient-data">
        <p>{ingredient.name}</p>
        {displayAmount(ingredient.amount)}
        {action.type === "check" ? (
          <span onClick={() => action.callback(ingredient.name)}>
            <Checkbox />
          </span>
        ) : (
          <span onClick={() => action.callback(ingredient.name)}>
            <PlusIcon width="18" height="18" thickness={3} />
          </span>
        )}
      </div>
    </li>
  );
};

export default IngredientListItem;

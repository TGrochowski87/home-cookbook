import QuantifiableItemsList from "components/quantifiable-items-list/QuantifiableItemsList";
import QuantifiableItemData from "models/QuantifiableItemData";

interface IngredientListReadProps {
  readonly ingredients: readonly QuantifiableItemData[];
  readonly setIngredients: React.Dispatch<React.SetStateAction<readonly QuantifiableItemData[]>>;
}

const IngredientListRead = ({ ingredients, setIngredients }: IngredientListReadProps) => {
  return (
    <QuantifiableItemsList
      items={ingredients}
      rightSideAction={{
        type: "check",
        callback: (item: QuantifiableItemData) => {
          setIngredients(ingredients.map(i => (i.key === item.key ? { ...item, checked: !item.checked } : i)));
        },
      }}
    />
  );
};

export default IngredientListRead;

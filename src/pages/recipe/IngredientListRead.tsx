import { IngredientGetDto } from "api/GET/DTOs";
import { Form } from "react-router-dom";
import QuantifiableItemsList from "components/quantifiable-items-list/QuantifiableItemsList";
import { useState } from "react";
import QuantifiableItemData from "models/QuantifiableItemData";

interface IngredientListReadProps {
  readonly ingredients: readonly IngredientGetDto[];
}

const IngredientListRead = ({ ingredients }: IngredientListReadProps) => {
  const [items, setItems] = useState<ReadonlyArray<QuantifiableItemData>>(
    ingredients.map(i => ({ ...i, key: i.id, checked: false }))
  );
  return (
    <>
      <QuantifiableItemsList
        items={items}
        rightSideAction={{
          type: "check",
          callback: (item: QuantifiableItemData) => {
            setItems(items.map(i => (i.key === item.key ? { ...item, checked: !item.checked } : i)));
          },
        }}
      />
      {/* TODO */}
      <Form className="add-to-shopping-list-button-space">
        <button type="submit">Dodaj niezaznaczone do listy zakupów</button>
      </Form>
    </>
  );
};

export default IngredientListRead;

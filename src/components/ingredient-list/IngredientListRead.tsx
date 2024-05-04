import { IngredientGetDto } from "api/GET/DTOs";
import IngredientList from "./IngredientList";
import { Form } from "react-router-dom";

interface IngredientListReadProps {
  readonly ingredients: readonly IngredientGetDto[];
}

const IngredientListRead = ({ ingredients }: IngredientListReadProps) => {
  return (
    <>
      <IngredientList
        ingredients={ingredients.map(i => ({ key: i.id, ...i }))}
        itemAction={{
          type: "check",
          callback: () => {},
        }}
      />
      <Form className="add-to-shopping-list-button-space">
        <button type="submit">Dodaj niezaznaczone do listy zakupów</button>
      </Form>
    </>
  );
};

export default IngredientListRead;

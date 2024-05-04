import Ingredient from "models/Ingredient";
import IngredientList from "./IngredientList";
import { Form } from "react-router-dom";
import Input from "components/Input";
import { useState } from "react";
import { ConcreteAmount, ImpreciseAmount } from "api/GET/DTOs";

interface IngredientListEditProps {
  readonly ingredients: readonly Ingredient[];
  readonly addIngredient: (ingredient: Ingredient) => void;
  readonly removeIngredient: (name: string) => void;
}

interface FormData {
  readonly name: string;
  readonly amount: {
    readonly value: string;
    readonly unit: string;
  };
}

const IngredientListEdit = ({ ingredients, addIngredient, removeIngredient }: IngredientListEditProps) => {
  const [newIngredientData, setNewIngredientData] = useState<FormData>({
    name: "",
    amount: {
      value: "",
      unit: "",
    },
  });

  return (
    <>
      <IngredientList
        ingredients={ingredients}
        itemAction={{
          type: "remove",
          callback: removeIngredient,
        }}
      />
      <Form
        className="new-ingredient"
        onSubmit={event => {
          console.log("XD");
        }}
        // onBlur={event => {
        //   if (event.relatedTarget?.tagName !== "INPUT") {
        //     const name = newIngredientData.name.trim();
        //     const value = newIngredientData.amount.value.trim();

        //     if (name !== "" && value !== "") {
        //       const amount =
        //         newIngredientData.amount.unit === ""
        //           ? ({ value: value } as ImpreciseAmount)
        //           : ({ value: +value, unit: newIngredientData.amount.unit } as ConcreteAmount);
        //       addIngredient({ key: name, name: name, amount: amount });
        //       setNewIngredientData({ name: "", amount: { value: "", unit: "" } });
        //     }
        //   }
        // }}
      >
        <Input
          required
          maxLength={50}
          placeholder="Nazwa"
          value={newIngredientData.name}
          onChange={event => setNewIngredientData(prev => ({ ...prev, name: event.target.value }))}
        />
        <Input
          required
          maxLength={10}
          placeholder="Ilość"
          value={newIngredientData.amount.value}
          onChange={event =>
            setNewIngredientData(prev => ({ ...prev, amount: { ...prev.amount, value: event.target.value } }))
          }
        />
        <Input
          maxLength={8}
          placeholder="Jednostka"
          value={newIngredientData.amount.unit}
          onChange={event =>
            setNewIngredientData(prev => ({ ...prev, amount: { ...prev.amount, unit: event.target.value } }))
          }
        />
        <input type="submit" hidden />
      </Form>
    </>
  );
};

export default IngredientListEdit;

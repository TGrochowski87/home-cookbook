import Ingredient from "models/Ingredient";
import IngredientList from "./IngredientList";
import { Form } from "react-router-dom";
import Input from "components/Input";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit, reset, watch } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    const newIngredient: Ingredient = {
      key: data.name,
      name: data.name,
      amount: { value: data.amount.value, unit: data.amount.unit === "" ? null : data.amount.unit },
    };
    addIngredient(newIngredient);

    reset();
  };

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
        onSubmit={handleSubmit(onSubmit, errors => {
          console.log("?");
          console.log(errors);
        })}>
        <Input
          {...register("name", {
            required: true,
            maxLength: 50,
            setValueAs: (value: string) => value.trim(),
          })}
          className={`${watch("name")?.length > 0 ? "" : "empty-input"}`}
          maxLength={50}
          placeholder="Nazwa"
        />
        <Input
          {...register("amount.value", {
            required: true,
            maxLength: 10,
            setValueAs: (value: string) => value.trim(),
          })}
          className={`${watch("amount.value")?.length > 0 ? "" : "empty-input"}`}
          maxLength={10}
          placeholder="Ilość"
        />
        <Input
          {...register("amount.unit", {
            required: false,
            maxLength: 8,
            setValueAs: (value: string) => value.trim(),
          })}
          className={`${watch("amount.unit")?.length > 0 ? "" : "empty-input"}`}
          maxLength={8}
          placeholder="Jednostka"
        />
        {/* This enables submitting by enter/send */}
        <input type="submit" hidden />
      </Form>
    </>
  );
};

export default IngredientListEdit;

import { useAlerts } from "components/alert/AlertStack";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import QuantifiableItemsList from "./QuantifiableItemsList";
import Input from "components/Input";
import ActionData from "../../models/ActionData";

interface FormData {
  readonly name: string;
  readonly amount: {
    readonly value: string;
    readonly unit: string;
  };
}

interface EditableQuantifiableItemsListProps {
  readonly items: readonly QuantifiableItemData[];
  readonly setItems: (items: readonly QuantifiableItemData[]) => void;
  readonly rightSideAction?: ActionData;
  readonly leftSideAction?: ActionData;
}

const EditableQuantifiableItemsList = ({
  items,
  setItems,
  leftSideAction,
  rightSideAction,
}: EditableQuantifiableItemsListProps) => {
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const { displayMessage } = useAlerts();

  const onSubmit = (data: FormData) => {
    const newItem: QuantifiableItemData = {
      key: data.name,
      name: data.name,
      amount: { value: data.amount.value, unit: data.amount.unit === "" ? null : data.amount.unit },
      checked: false,
    };

    if (items.find(i => i.name === newItem.name)) {
      displayMessage({ type: "error", message: "Ten przedmiot jest już na liście.", fadeOutAfter: 10000 });
      return;
    }

    setItems([...items, newItem]);
    reset();
  };

  return (
    <>
      <QuantifiableItemsList items={items} leftSideAction={leftSideAction} rightSideAction={rightSideAction} />
      <Form
        className="new-quantifiable-item"
        onSubmit={handleSubmit(onSubmit, errors => {
          console.error(errors);
        })}>
        <Input
          {...register("name", {
            required: true,
            maxLength: 50,
            setValueAs: (value: string) => value.trim(),
          })}
          className={`${watch("name")?.length > 0 ? "" : "empty-input"}`}
          maxLength={50}
          autoCapitalize="none"
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
          autoCapitalize="none"
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
          autoCapitalize="none"
          placeholder="Jednostka"
        />
        {/* This enables submitting by enter/send */}
        <input type="submit" hidden />
      </Form>
    </>
  );
};

export default EditableQuantifiableItemsList;

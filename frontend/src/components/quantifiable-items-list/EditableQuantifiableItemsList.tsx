import { useAlerts } from "components/alert/AlertStack";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit, reset, setFocus } = useForm<FormData>({
    defaultValues: {
      name: "",
      amount: { value: "", unit: "" },
    },
  });
  const { displayMessage } = useAlerts();

  const onSubmit = (data: FormData) => {
    const newItem: QuantifiableItemData = {
      key: data.name,
      name: data.name,
      amount: {
        value: data.amount.value === "" ? null : data.amount.value,
        unit: data.amount.unit === "" ? null : data.amount.unit,
      },
      checked: false,
    };

    if (items.find(i => i.name === newItem.name)) {
      displayMessage({ type: "error", message: "This item is already in the list.", fadeOutAfter: 10000 });
      return;
    }

    setItems([...items, newItem]);
    setFocus("name");
    reset();
  };

  return (
    <>
      <QuantifiableItemsList items={items} leftSideAction={leftSideAction} rightSideAction={rightSideAction} />
      <form
        className="new-quantifiable-item"
        onSubmit={handleSubmit(onSubmit, errors => {
          console.error(errors);
        })}>
        <Input
          {...register("name", {
            required: true,
            maxLength: 100,
            setValueAs: (value: string) => value.trim(),
          })}
          maxLength={100}
          autoCapitalize="none"
          placeholder="Name"
        />
        <Input
          {...register("amount.value", {
            required: false,
            maxLength: 20,
            setValueAs: (value: string) => value.trim(),
          })}
          maxLength={20}
          autoCapitalize="none"
          placeholder="Amount"
        />
        <Input
          {...register("amount.unit", {
            required: false,
            maxLength: 10,
            setValueAs: (value: string) => value.trim(),
          })}
          maxLength={10}
          autoCapitalize="none"
          placeholder="Unit"
        />
        {/* This enables submitting by enter/send */}
        <input type="submit" hidden />
      </form>
    </>
  );
};

export default EditableQuantifiableItemsList;

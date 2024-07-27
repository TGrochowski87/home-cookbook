import QuantifiableItemData from "./QuantifiableItemData";

interface ActionData {
  readonly type: "check" | "remove";
  readonly callback: (item: QuantifiableItemData) => void;
}

export default ActionData;

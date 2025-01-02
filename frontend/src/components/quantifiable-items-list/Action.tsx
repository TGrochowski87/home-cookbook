import Checkbox from "components/Checkbox";
import ActionData from "../../models/ActionData";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import { X } from "lucide-react";

interface ActionProps {
  readonly item: QuantifiableItemData;
  readonly action: ActionData;
  readonly isLeftSide?: boolean;
}

const Action = ({ item, action, isLeftSide = false }: ActionProps) => {
  return (
    <span className={`action-button ${isLeftSide ? "left-side-action" : ""}`} onClick={() => action.callback(item)}>
      {action.type === "check" ? (
        <Checkbox checked={item.checked} />
      ) : (
        <button className="icon-only-button">
          <X />
        </button>
      )}
    </span>
  );
};

export default Action;

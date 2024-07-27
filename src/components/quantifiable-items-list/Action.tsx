import Checkbox from "components/Checkbox";
import ActionData from "../../models/ActionData";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import PlusIcon from "components/icons/PlusIcon";

interface ActionProps {
  readonly item: QuantifiableItemData;
  readonly action: ActionData;
  readonly isLeftSide?: boolean;
}

const Action = ({ item, action, isLeftSide = false }: ActionProps) => {
  return (
    <span className={`${isLeftSide ? "left-side-action" : ""}`} onClick={() => action.callback(item)}>
      {action.type === "check" ? (
        <Checkbox checked={item.checked} />
      ) : (
        <PlusIcon width="18" height="18" thickness={3} />
      )}
    </span>
  );
};

export default Action;

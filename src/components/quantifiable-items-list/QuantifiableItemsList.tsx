import ActionData from "../../models/ActionData";
import QuantifiableItem from "./QuantifiableItem";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import "./styles.less";

interface QuantifiableItemsListProps {
  readonly items: readonly QuantifiableItemData[];
  readonly rightSideAction?: ActionData;
  readonly leftSideAction?: ActionData;
}

const QuantifiableItemsList = ({ items, leftSideAction, rightSideAction }: QuantifiableItemsListProps) => {
  return (
    <ol className="quantifiable-items-list">
      {items.map(i => (
        <QuantifiableItem key={i.key} data={i} rightSideAction={rightSideAction} leftSideAction={leftSideAction} />
      ))}
    </ol>
  );
};

export default QuantifiableItemsList;

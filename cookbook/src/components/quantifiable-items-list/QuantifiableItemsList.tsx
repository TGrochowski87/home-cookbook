import ActionData from "../../models/ActionData";
import QuantifiableItem from "./QuantifiableItem";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import "./styles.less";
import HighlightingList from "components/list/HighlightingList";

interface QuantifiableItemsListProps {
  readonly items: readonly QuantifiableItemData[];
  readonly rightSideAction?: ActionData;
  readonly leftSideAction?: ActionData;
}

const QuantifiableItemsList = ({ items, leftSideAction, rightSideAction }: QuantifiableItemsListProps) => {
  return (
    <HighlightingList
      className="quantifiable-items-list"
      items={items}
      render={item => (
        <QuantifiableItem
          key={item.key}
          data={item}
          rightSideAction={rightSideAction}
          leftSideAction={leftSideAction}
        />
      )}
    />
  );
};

export default QuantifiableItemsList;

import { Amount } from "api/GET/DTOs";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import ActionData from "../../models/ActionData";
import Action from "./Action";

interface QuantifiableItemProps {
  readonly data: QuantifiableItemData;
  readonly rightSideAction?: ActionData;
  readonly leftSideAction?: ActionData;
}

const QuantifiableItem = ({ data, leftSideAction, rightSideAction }: QuantifiableItemProps) => {
  const displayAmount = (amount: Amount): JSX.Element => {
    if (amount.unit) {
      return (
        <>
          <p style={{ width: "6ch" }}>{amount.value}</p>
          <p style={{ width: "5ch" }}>{amount.unit}</p>
        </>
      );
    } else {
      return <p style={{ width: "12ch" }}>{amount.value}</p>;
    }
  };

  return (
    <li className="quantifiable-list-item">
      {leftSideAction && <Action item={data} action={leftSideAction} isLeftSide />}
      <div className={`quantifiable-data ${data.checked ? "checked" : ""}`}>
        <p>{data.name}</p>
        {displayAmount(data.amount)}
        {rightSideAction && <Action item={data} action={rightSideAction} />}
      </div>
    </li>
  );
};

export default QuantifiableItem;

import QuantifiableItemData from "../../models/QuantifiableItemData";
import ActionData from "../../models/ActionData";
import Action from "./Action";
import { Amount } from "api/common-DTOs";

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
    <>
      {leftSideAction && <Action item={data} action={leftSideAction} isLeftSide />}
      <div className={`quantifiable-data ${data.checked ? "checked" : ""}`}>
        <p>{data.name}</p>
        {displayAmount(data.amount)}
        {rightSideAction && <Action item={data} action={rightSideAction} />}
      </div>
    </>
  );
};

export default QuantifiableItem;

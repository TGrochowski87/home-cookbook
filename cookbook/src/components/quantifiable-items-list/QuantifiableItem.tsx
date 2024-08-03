import { Amount } from "api/GET/DTOs";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import ActionData from "../../models/ActionData";
import Action from "./Action";
import { useEffect, useRef } from "react";

interface QuantifiableItemProps {
  readonly data: QuantifiableItemData;
  readonly isHighlighted: boolean;
  readonly handleTouchStart: (item: QuantifiableItemData["key"]) => void;
  readonly rightSideAction?: ActionData;
  readonly leftSideAction?: ActionData;
}

const QuantifiableItem = ({
  data,
  isHighlighted,
  handleTouchStart,
  leftSideAction,
  rightSideAction,
}: QuantifiableItemProps) => {
  const listItemRef = useRef<HTMLLIElement>(null);

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

  useEffect(() => {
    const localTouchStartHandler = () => handleTouchStart(data.key);

    listItemRef.current?.addEventListener("touchstart", localTouchStartHandler, { passive: false });

    return () => {
      listItemRef.current?.removeEventListener("touchstart", localTouchStartHandler);
    };
  }, [listItemRef.current, handleTouchStart]);

  return (
    <li
      ref={listItemRef}
      data-key={data.key}
      className={`quantifiable-list-item ${isHighlighted ? "highlighted" : ""}`}>
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

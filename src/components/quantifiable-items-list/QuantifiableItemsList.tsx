import ActionData from "../../models/ActionData";
import QuantifiableItem from "./QuantifiableItem";
import QuantifiableItemData from "../../models/QuantifiableItemData";
import "./styles.less";
import { useEffect, useRef, useState } from "react";

interface QuantifiableItemsListProps {
  readonly items: readonly QuantifiableItemData[];
  readonly rightSideAction?: ActionData;
  readonly leftSideAction?: ActionData;
}

const QuantifiableItemsList = ({ items, leftSideAction, rightSideAction }: QuantifiableItemsListProps) => {
  const [highlightedItem, setHighlightedItem] = useState<QuantifiableItemData["key"]>();
  const listRef = useRef<HTMLOListElement>(null); // This is needed because React's onTouch events are passive
  const isScrolling = useRef<boolean>(false);

  const handleTouchStart = (key: QuantifiableItemData["key"]) => {
    isScrolling.current = false;
    setHighlightedItem(key);
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();

    isScrolling.current = true;
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY)!;
    if (element) {
      const parent = findParentWithDataKey(element as HTMLElement);
      if (parent) {
        setHighlightedItem(parent.dataset.key);
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (isScrolling.current) {
      event.preventDefault();
    }

    setHighlightedItem(undefined);
    isScrolling.current = false;
  };

  useEffect(() => {
    listRef.current?.addEventListener("touchmove", handleTouchMove, { passive: false });
    listRef.current?.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      listRef.current?.removeEventListener("touchmove", handleTouchMove);
      listRef.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [listRef.current, handleTouchMove, handleTouchEnd]);

  return (
    <ol ref={listRef} className="quantifiable-items-list">
      {items.map(i => (
        <QuantifiableItem
          key={i.key}
          data={i}
          isHighlighted={highlightedItem !== undefined && +highlightedItem === +i.key}
          handleTouchStart={handleTouchStart}
          rightSideAction={rightSideAction}
          leftSideAction={leftSideAction}
        />
      ))}
    </ol>
  );
};

const findParentWithDataKey = (element: HTMLElement): HTMLElement | null => {
  let parent: HTMLElement | null = element;
  while (parent && !parent.dataset.key) {
    parent = parent.parentElement;
  }

  return parent;
};

export default QuantifiableItemsList;

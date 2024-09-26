import "./styles.less";
import { ReactNode, useEffect, useRef, useState } from "react";
import ListItem from "./ListItem";

interface HighlightingListProps<T extends { readonly key: string | number }> {
  readonly items: readonly T[];
  readonly render: (item: T) => ReactNode;
  readonly noMarkers?: boolean;
  readonly className?: string;
}

const HighlightingList = <T extends { readonly key: string | number }>({
  items,
  render,
  className = "",
  noMarkers = false,
}: HighlightingListProps<T>) => {
  const [highlightedItem, setHighlightedItem] = useState<T["key"]>();
  const listRef = useRef<HTMLOListElement>(null); // This is needed because React's onTouch events are passive
  const isScrolling = useRef<boolean>(false);

  const handleTouchStart = (key: T["key"]) => {
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
    <ol ref={listRef} className={`highlighting-list ${className} ${noMarkers ? "no-markers" : ""}`}>
      {items.map(i => (
        <ListItem
          key={i.key}
          dataKey={i.key}
          isHighlighted={highlightedItem !== undefined && +highlightedItem === +i.key}
          handleTouchStart={handleTouchStart}>
          {render(i)}
        </ListItem>
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

export default HighlightingList;

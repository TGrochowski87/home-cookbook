import "./styles.less";
import { ReactNode, useEffect, useRef, useState } from "react";
import ListItem from "./ListItem";

interface HighlightingListProps<T extends { readonly key: string | number }> {
  readonly items: readonly T[];
  readonly render: (item: T) => ReactNode;
  readonly noMarkers?: boolean;
  readonly className?: string;
}

/**
 * A list of items that get highlighted when the user moves their finger over them.
 */
const HighlightingList = <T extends { readonly key: string | number }>({
  items,
  render,
  className = "",
  noMarkers = false,
}: HighlightingListProps<T>) => {
  const [highlightedItem, setHighlightedItem] = useState<T["key"]>();
  const listRef = useRef<HTMLOListElement>(null); // This is needed for setting up event handlers because React's onTouch events are passive.

  /**
   * These two hooks are used for enabling highlighting only after a short time of holding the touch.
   * Highlighting should not hijack every page scrolling attempt.
   */
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  const [highlightingActive, setHighlightingActive] = useState<boolean>(false);

  const handleTouchStart = (key: T["key"]) => {
    // We enable highlighting only if the user holds the touch for a bit without moving.
    timeoutId.current = setTimeout(() => {
      setHighlightedItem(key);
      setHighlightingActive(true);
    }, 200);
  };

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      // Immediate movement means page scrolling attempt. (No highlighting.)
      if (highlightingActive === false) {
        clearTimeout(timeoutId.current);
        return;
      }

      event.preventDefault();

      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY)!;
      if (element) {
        const parent = findParentWithDataKey(element as HTMLElement);
        if (parent) {
          setHighlightedItem(parent.dataset.key);
        }
      }
    };

    const handleTouchEnd = () => {
      // Immediate release means clicking. (No highlighting.)
      if (highlightingActive === false) {
        clearTimeout(timeoutId.current);
        return;
      }

      setHighlightingActive(false);
      setHighlightedItem(undefined);
    };

    const listElement = listRef.current;

    listElement?.addEventListener("touchmove", handleTouchMove, { passive: false });
    listElement?.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      listElement?.removeEventListener("touchmove", handleTouchMove);
      listElement?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [highlightingActive]);

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

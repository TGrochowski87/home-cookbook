import { PropsWithChildren, useEffect, useRef } from "react";

interface ListItemProps extends PropsWithChildren {
  readonly isHighlighted: boolean;
  readonly handleTouchStart: (key: string | number) => void;
  readonly dataKey: string | number;
}

const ListItem = ({ isHighlighted, handleTouchStart, dataKey, children }: ListItemProps) => {
  const listItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const listElement = listItemRef.current;
    const localTouchStartHandler = () => handleTouchStart(dataKey);

    listElement?.addEventListener("touchstart", localTouchStartHandler, { passive: false });

    return () => {
      listElement?.removeEventListener("touchstart", localTouchStartHandler);
    };
  }, [handleTouchStart, dataKey]);

  return (
    <li ref={listItemRef} data-key={dataKey} className={`list-item ${isHighlighted ? "highlighted" : ""}`}>
      {children}
    </li>
  );
};

export default ListItem;

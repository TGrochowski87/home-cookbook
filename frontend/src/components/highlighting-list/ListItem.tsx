import { PropsWithChildren, useEffect, useRef } from "react";

interface ListItemProps extends PropsWithChildren {
  readonly isHighlighted: boolean;
  readonly handleTouchStart: (key: string | number) => void;
  readonly dataKey: string | number;
}

const ListItem = ({ isHighlighted, handleTouchStart, dataKey, children }: ListItemProps) => {
  const listItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const localTouchStartHandler = () => handleTouchStart(dataKey);

    listItemRef.current?.addEventListener("touchstart", localTouchStartHandler, { passive: false });

    return () => {
      listItemRef.current?.removeEventListener("touchstart", localTouchStartHandler);
    };
  }, [listItemRef.current, handleTouchStart]);

  return (
    <li ref={listItemRef} data-key={dataKey} className={`list-item ${isHighlighted ? "highlighted" : ""}`}>
      {children}
    </li>
  );
};

export default ListItem;

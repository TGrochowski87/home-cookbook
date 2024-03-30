import { useState } from "react";

interface CategoryIndicatorProps {
  readonly categoryName: string;
  readonly categoryColor: string;
}

const CategoryIndicator = ({ categoryName, categoryColor }: CategoryIndicatorProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <div
        className="category-indicator-interaction-space"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(prev => !prev)}
      />
      {/* @ts-ignore */}
      <div style={{ "--color": categoryColor }} className={`category-indicator ${show ? "show" : ""}`}>
        <p>{categoryName}</p>
      </div>
    </>
  );
};

export default CategoryIndicator;

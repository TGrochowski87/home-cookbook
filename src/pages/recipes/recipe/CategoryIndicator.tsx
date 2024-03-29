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
      <div className={`category-indicator ${show ? "show" : ""}`} style={{ background: categoryColor }}>
        <p>{categoryName}</p>
      </div>
    </>
  );
};

export default CategoryIndicator;

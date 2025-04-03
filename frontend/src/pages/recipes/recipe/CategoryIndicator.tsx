import { CategoryGetDto } from "api/categories/DTOs";
import { useState } from "react";

interface CategoryIndicatorProps {
  readonly category: CategoryGetDto;
}

const CategoryIndicator = ({ category }: CategoryIndicatorProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div
      className="category-indicator-interaction-space"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(prev => !prev)}
      onClick={event => event.stopPropagation()}>
      <span className="svg-space" dangerouslySetInnerHTML={{ __html: category.symbol }} />
      <div
        style={{ "--color": category.color } as React.CSSProperties}
        className={`category-indicator ${show ? "show" : ""}`}>
        <p>{category.name}</p>
      </div>
    </div>
  );
};

export default CategoryIndicator;

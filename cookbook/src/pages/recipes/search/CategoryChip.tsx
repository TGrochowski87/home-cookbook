import { CategoryGetDto } from "api/GET/DTOs";
import "./styles.less";

interface CategoryChipProps {
  readonly category: CategoryGetDto;
}

// TODO: Consider Radix
const CategoryChip = ({ category }: CategoryChipProps) => {
  return (
    <>
      <input type="radio" name="category" id={category.name} value={category.name} />
      {/* @ts-ignore */}
      <label
        className="category-chip block floating interactive-element"
        style={{ "--color": category.color }}
        htmlFor={category.name}>
        {category.name}
      </label>
    </>
  );
};

export default CategoryChip;

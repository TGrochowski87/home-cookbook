import { CategoryGetDto } from "api/GET/DTOs";
import "./styles.less";

interface CategoryChipProps {
  readonly category: CategoryGetDto;
  readonly checked: boolean;
  readonly onChange: (value: string) => void;
}

// TODO: Consider Radix
const CategoryChip = ({ category, checked, onChange }: CategoryChipProps) => {
  return (
    <>
      <input
        type="radio"
        name="category"
        id={category.name}
        value={category.name}
        checked={checked}
        onChange={event => onChange(event.target.value)}
      />
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

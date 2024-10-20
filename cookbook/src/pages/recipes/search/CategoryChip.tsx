import { CategoryGetDto } from "api/GET/DTOs";
import "./styles.less";

interface CategoryChipProps {
  readonly category: CategoryGetDto;
  readonly checked: boolean;
  readonly onChange: (category: string) => void;
}

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
        <span dangerouslySetInnerHTML={{ __html: category.symbol }} />
      </label>
    </>
  );
};

export default CategoryChip;

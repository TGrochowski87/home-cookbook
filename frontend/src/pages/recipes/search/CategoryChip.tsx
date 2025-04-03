import { CategoryGetDto } from "api/categories/DTOs";
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
        type="checkbox"
        name="category"
        id={category.name}
        value={category.name}
        checked={checked}
        onChange={event => {
          if (checked) {
            onChange("");
          } else {
            onChange(event.target.value);
          }
        }}
      />
      <label
        className="category-chip block floating interactive-element"
        style={{ "--color": category.color } as React.CSSProperties}
        htmlFor={category.name}>
        {category.name}
        <span dangerouslySetInnerHTML={{ __html: category.symbol }} />
      </label>
    </>
  );
};

export default CategoryChip;

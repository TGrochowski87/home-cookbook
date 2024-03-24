import BaseChip from "./BaseChip";
import "../styles.less";

interface CategoryChipProps {
  readonly name: string;
}

const CategoryChip = ({ name }: CategoryChipProps) => {
  return <BaseChip className="category-chip" name={name} />;
};

export default CategoryChip;

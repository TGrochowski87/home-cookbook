import BaseChip from "./BaseChip";
import "../styles.less";

interface TagChipProps {
  readonly name: string;
}

const TagChip = ({ name }: TagChipProps) => {
  return <BaseChip className="tag-chip" name={name} />;
};

export default TagChip;

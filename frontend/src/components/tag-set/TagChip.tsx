import TagSize from "./TagSize";
import "./styles.less";

interface TagChipProps {
  readonly tagName: string;
  readonly size: TagSize;
  readonly disableShadow?: boolean;
}

const TagChip = ({ tagName, size, disableShadow = false }: TagChipProps) => {
  return <div className={`block tag-chip ${disableShadow ? "" : "floating"} ${size}`}>{tagName}</div>;
};

export default TagChip;

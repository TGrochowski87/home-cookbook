import { TagGetDto } from "api/GET/DTOs";
import "./styles.less";

interface TagChipProps {
  readonly tag: TagGetDto;
  readonly disableShadow?: boolean;
}

const TagChip = ({ tag, disableShadow = false }: TagChipProps) => {
  return <div className={`block tag-chip ${disableShadow ? "" : "floating"}`}>{tag.name}</div>;
};

export default TagChip;

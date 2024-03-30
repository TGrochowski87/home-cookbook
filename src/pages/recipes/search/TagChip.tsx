import { TagGetDto } from "api/GET/DTOs";
import "../styles.less";

interface TagChipProps {
  readonly tag: TagGetDto;
}

const TagChip = ({ tag }: TagChipProps) => {
  return (
    <>
      <input type="checkbox" name="tags" value={tag.name} id={tag.name} />
      <label className="tag-chip block floating" htmlFor={tag.name}>
        {tag.name}
      </label>
    </>
  );
};

export default TagChip;

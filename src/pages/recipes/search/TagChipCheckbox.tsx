import { TagGetDto } from "api/GET/DTOs";
import "../styles.less";

interface TagChipProps {
  readonly tag: TagGetDto;
}

// TODO: Consider Radix
const TagChipCheckbox = ({ tag }: TagChipProps) => {
  return (
    <>
      <input type="checkbox" name="tags" value={tag.name} id={tag.name} />
      <label className="tag-chip-checkbox block floating" htmlFor={tag.name}>
        {tag.name}
      </label>
    </>
  );
};

export default TagChipCheckbox;

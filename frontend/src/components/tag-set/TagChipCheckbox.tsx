import * as Checkbox from "@radix-ui/react-checkbox";
import "./styles.less";
import TagSize from "./TagSize";
import { TagGetDto } from "api/tags/DTOs";

interface TagChipProps {
  readonly tag: TagGetDto;
  readonly size: TagSize;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly disableShadow?: boolean;
}

const TagChipCheckbox = ({ tag, size, checked, onCheckedChange, disableShadow }: TagChipProps) => {
  return (
    <>
      <Checkbox.Root
        name="tags"
        value={tag.name}
        id={tag.name}
        checked={checked}
        onCheckedChange={checked => onCheckedChange(!!checked)}
      />
      <label
        className={`tag-chip tag-chip-interactive block ${disableShadow ? "" : "floating"} ${size}`}
        htmlFor={tag.name}>
        {tag.name}
      </label>
    </>
  );
};

export default TagChipCheckbox;

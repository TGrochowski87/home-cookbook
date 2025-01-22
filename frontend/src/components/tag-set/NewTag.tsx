import TagChip from "./TagChip";
import TagSize from "./TagSize";
import ConfirmationPopover from "components/ConfirmationPopover";

interface NewTagProps {
  readonly tagName: string;
  readonly size: TagSize;
  readonly onDelete: () => void;
}

const NewTag = ({ tagName, size, onDelete }: NewTagProps) => {
  return (
    <ConfirmationPopover text="Delete tag?" onConfirm={onDelete}>
      <TagChip tagName={tagName} size={size} />
    </ConfirmationPopover>
  );
};

export default NewTag;

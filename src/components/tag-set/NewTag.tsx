import Button from "components/Button";
import TagChip from "./TagChip";
import TagSize from "./TagSize";
import * as Popover from "@radix-ui/react-popover";

interface NewTagProps {
  readonly tagName: string;
  readonly size: TagSize;
  readonly onDelete: () => void;
}

const NewTag = ({ tagName, size, onDelete }: NewTagProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span>
          <TagChip tagName={tagName} size={size} />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="new-tag-popover-content floating" side="top" sideOffset={2}>
          <p>Usunąć tag?</p>
          <Button onClick={onDelete} className="delete-tag-button" disableShadow>
            tak
          </Button>
          <Popover.Arrow className="popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default NewTag;

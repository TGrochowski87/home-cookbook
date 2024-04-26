import Button from "components/Button";
import WidthAdjustingInput from "components/WidthAdjustingInput";
import PlusIcon from "components/PlusIcon";
import { useState } from "react";
import TagSize from "./TagSize";

interface NewTagProps {
  readonly onCreate: (name: string) => void;
  readonly size: TagSize;
}

const CreateTagButton = ({ onCreate, size }: NewTagProps) => {
  const [isInInputMode, setIsInInputMode] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  return isInInputMode ? (
    <WidthAdjustingInput
      className="floating tag-chip-interactive tag-creation"
      minWidth="16ch"
      autoFocus
      maxLength={20}
      value={input}
      onChange={event => {
        setInput(event.target.value);
      }}
      onBlur={() => {
        setIsInInputMode(false);
        if (input) {
          onCreate(input.trim());
        }
        setInput("");
      }}
    />
  ) : (
    <Button className={`tag-chip tag-chip-interactive tag-creation ${size}`} onClick={() => setIsInInputMode(true)}>
      nowy tag <PlusIcon width="16px" height="16px" thickness={2} />
    </Button>
  );
};

export default CreateTagButton;

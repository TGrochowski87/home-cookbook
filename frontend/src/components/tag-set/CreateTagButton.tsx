import Button from "components/buttons/Button";
import WidthAdjustingInput from "components/WidthAdjustingInput";
import PlusIcon from "components/icons/PlusIcon";
import { useState } from "react";
import TagSize from "./TagSize";

interface NewTagProps {
  readonly onCreate: (name: string) => void;
  readonly size: TagSize;
}

// TODO: Use useForm, so it can be submitted on enter/send
const CreateTagButton = ({ onCreate, size }: NewTagProps) => {
  const [isInInputMode, setIsInInputMode] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const submitHandler = () => {
    setIsInInputMode(false);
    if (input) {
      onCreate(input.trim());
    }
    setInput("");
  };

  return isInInputMode ? (
    <form
      onSubmit={event => {
        event.preventDefault();
        submitHandler();
      }}>
      <WidthAdjustingInput
        className="floating tag-chip-interactive tag-creation"
        minWidth="15ch"
        autoFocus
        maxLength={20}
        value={input}
        onChange={event => {
          setInput(event.target.value);
        }}
        onBlur={() => submitHandler()}
      />
    </form>
  ) : (
    <Button className={`tag-chip tag-chip-interactive ${size} tag-creation`} onClick={() => setIsInInputMode(true)}>
      new tag <PlusIcon width="16px" height="16px" thickness={2} />
    </Button>
  );
};

export default CreateTagButton;

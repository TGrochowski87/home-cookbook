import Button from "components/Button";
import PlusIcon from "components/PlusIcon";
import { useState } from "react";

interface NewTagProps {
  readonly onCreate: (name: string) => void;
}

const CreateTagButton = ({ onCreate }: NewTagProps) => {
  const [isInInputMode, setIsInInputMode] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  return isInInputMode ? (
    <span className="input-sizing-wrapper">
      <p>{input}</p>
      <input
        className="floating tag-chip-checkbox new-tag"
        autoFocus
        value={input}
        onChange={event => {
          setInput(event.target.value);
        }}
        onBlur={() => {
          setIsInInputMode(false);
          if (input) {
            onCreate(input);
          }
          setInput("");
        }}
      />
    </span>
  ) : (
    <Button className="new-tag" onClick={() => setIsInInputMode(true)}>
      nowy tag <PlusIcon width="16px" height="16px" thickness={2} />
    </Button>
  );
};

export default CreateTagButton;

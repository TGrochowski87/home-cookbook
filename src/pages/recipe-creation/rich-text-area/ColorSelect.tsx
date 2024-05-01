import { Editor } from "@tiptap/react";
import { HighlighterIcon } from "lucide-react";
import SelectToggle from "./SelectToggle";

interface ColorSelectProps {
  readonly editor: Editor | null;
  readonly currentColor: string;
  readonly setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  readonly colors: readonly string[];
}

const ColorSelect = ({ currentColor, setCurrentColor, colors, editor }: ColorSelectProps) => {
  return (
    <SelectToggle
      editor={editor}
      toggleValue="highlight"
      ariaLabel="Highlight"
      options={colors}
      renderOption={(option: string) => <div className="toolbar-select-option" style={{ backgroundColor: option }} />}
      selectedOption={currentColor}
      setSelectedOption={(newValue: string) => setCurrentColor(newValue)}
      triggerIcon={<HighlighterIcon width={15} height={15} />}>
      <div className="color-select-current" style={{ backgroundColor: currentColor }} />
    </SelectToggle>
  );
};

export default ColorSelect;

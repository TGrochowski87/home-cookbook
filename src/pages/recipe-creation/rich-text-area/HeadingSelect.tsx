import { Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3, Heading4 } from "lucide-react";
import { ReactNode, useEffect } from "react";
import SelectToggle from "./SelectToggle";

const headingIcons: Record<string, ReactNode> = {
  1: <Heading1 width={16} height={16} />,
  2: <Heading2 width={16} height={16} />,
  3: <Heading3 width={16} height={16} />,
  4: <Heading4 width={16} height={16} />,
};

interface HeadingSelectProps {
  readonly editor: Editor | null;
  readonly headingLevel: number;
  readonly setHeadingLevel: React.Dispatch<React.SetStateAction<number>>;
}

const HeadingSelect = ({ headingLevel, setHeadingLevel, editor }: HeadingSelectProps) => {
  /**
   * This is the only option I found to call focus() after editor's blur event.
   * Also, it would be ideal to move this to parent, but for some reason it causes
   * "Internal React error: Expected static flag was missing".
   */
  useEffect(() => {
    const resetFocus = () => {
      if (document.activeElement?.className === "toolbar-select-trigger") {
        editor?.commands.focus();
      }
    };

    document.addEventListener("selectionchange", resetFocus);

    return () => {
      document.removeEventListener("selectionchange", resetFocus);
    };
  }, []);

  return (
    <SelectToggle
      editor={editor}
      toggleValue="heading"
      ariaLabel="Heading"
      options={Object.keys(headingIcons)}
      renderOption={(option: string) => headingIcons[option]}
      selectedOption={headingLevel.toString()}
      setSelectedOption={(newValue: string) => setHeadingLevel(+newValue)}
      triggerIcon={headingIcons[headingLevel]}
    />
  );
};

export default HeadingSelect;

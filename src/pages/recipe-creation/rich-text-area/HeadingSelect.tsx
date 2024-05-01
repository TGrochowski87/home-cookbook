import { Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3, Heading4 } from "lucide-react";
import { ReactNode } from "react";
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

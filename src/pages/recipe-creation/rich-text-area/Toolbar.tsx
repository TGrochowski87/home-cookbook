import * as RadixToolbar from "@radix-ui/react-Toolbar";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import "./styles.less";
import ColorSelect from "./ColorSelect";
import { useState } from "react";
import HeadingSelect from "./HeadingSelect";
import { Level } from "@tiptap/extension-heading";

const multiTogglesArray = ["bold", "italic", "underline", "strike", "highlight", "heading"] as const;
type MultiToggle = (typeof multiTogglesArray)[number];

const singleTogglesArray = ["bulletList", "orderedList", "taskList"] as const;
type SingleToggle = (typeof singleTogglesArray)[number];

const highlightColors: readonly string[] = [
  "#E4E434", // yellow
  "#E43434", // red
  "#81E434", // green
  "#34E4D1", // cyan
  "#349CE4", // blue
  "#A434E4", // violet
  "#E434BC", // pink
];

const toggleActions: Record<MultiToggle | SingleToggle, (editor: Editor, ...params: any) => void> = {
  bold: editor => {
    editor.view.focus();
    editor.chain().focus().toggleBold().run();
  },
  italic: editor => {
    editor.view.focus();
    editor.chain().focus().toggleItalic().run();
  },
  underline: editor => {
    editor.view.focus();
    editor.chain().focus().toggleUnderline().run();
  },
  strike: editor => {
    editor.view.focus();
    editor.chain().focus().toggleStrike().run();
  },
  highlight: (editor, color: string) => {
    editor.view.focus();
    editor.chain().focus().toggleHighlight({ color: color }).run();
  },
  heading: (editor, level: number) => {
    editor.view.focus();
    editor
      .chain()
      .focus()
      .toggleHeading({ level: level as Level })
      .run();
  },
  bulletList: editor => {
    editor.view.focus();
    editor.chain().focus().toggleBulletList().run();
  },
  orderedList: editor => {
    editor.view.focus();
    editor.chain().focus().toggleOrderedList().run();
  },
  taskList: editor => {
    editor.view.focus();
    editor.chain().focus().toggleTaskList().run();
  },
};

interface ToolbarProps {
  readonly editor: Editor | null;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  const [highlightColor, setHighlightColor] = useState<string>(highlightColors[0]);
  const [headingLevel, setHeadingLevel] = useState<number>(1);

  const isModifierActive = (modifier: MultiToggle | SingleToggle): boolean => {
    switch (modifier) {
      case "highlight":
        return editor.isActive("highlight", { color: highlightColor });

      case "heading":
        return editor.isActive("heading", { level: headingLevel });

      default:
        return editor.isActive(modifier);
    }
  };

  const invokeToggleAction = (modifier: MultiToggle | SingleToggle): void => {
    switch (modifier) {
      case "highlight":
        toggleActions[modifier](editor, highlightColor);
        break;

      case "heading":
        toggleActions[modifier](editor, headingLevel);
        break;

      default:
        toggleActions[modifier](editor);
        break;
    }
  };

  return (
    <RadixToolbar.Root className="toolbar-root block floating" aria-label="Formatting options">
      <RadixToolbar.ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        value={multiTogglesArray.filter(t => isModifierActive(t))}
        onValueChange={(value: string[]) => {
          const stateArray = multiTogglesArray.filter(t => isModifierActive(t)) as string[];
          const changes = stateArray
            .filter(x => value.includes(x) === false)
            .concat(value.filter(x => stateArray.includes(x) === false));

          if (changes.length > 1) {
            console.warn("RichTextArea's toolbar has performed multiple actions at once.");
          }

          if (multiTogglesArray.find(x => x === changes[0]) === undefined) {
            throw Error(`RichTextArea's toolbar has a value not present in Toggles type: ${changes[0]}`);
          }

          invokeToggleAction(changes[0] as MultiToggle);
        }}>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="bold" aria-label="Bold">
          <BoldIcon width={15} height={15} />
        </RadixToolbar.ToggleItem>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="italic" aria-label="Italic">
          <ItalicIcon width={15} height={15} />
        </RadixToolbar.ToggleItem>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="underline" aria-label="Underline">
          <UnderlineIcon width={15} height={15} />
        </RadixToolbar.ToggleItem>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="strike" aria-label="Strike through">
          <StrikethroughIcon width={15} height={15} />
        </RadixToolbar.ToggleItem>
        <HeadingSelect editor={editor} headingLevel={headingLevel} setHeadingLevel={setHeadingLevel} />
        <ColorSelect
          editor={editor}
          currentColor={highlightColor}
          setCurrentColor={setHighlightColor}
          colors={highlightColors}
        />
      </RadixToolbar.ToggleGroup>

      <RadixToolbar.Separator className="toolbar-separator" />

      <RadixToolbar.ToggleGroup
        type="single"
        aria-label="Lists"
        value={singleTogglesArray.find(t => isModifierActive(t)) ?? ""}
        onValueChange={(value: string) => {
          console.log(value);
          const toToggle = value === "" ? singleTogglesArray.find(t => isModifierActive(t)) : value;
          console.log(toToggle);
          invokeToggleAction(toToggle as SingleToggle);
        }}>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="bulletList" aria-label="Bullet list">
          <ListIcon width={18} height={18} />
        </RadixToolbar.ToggleItem>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="orderedList" aria-label="Ordered list">
          <ListOrderedIcon width={18} height={18} />
        </RadixToolbar.ToggleItem>
        <RadixToolbar.ToggleItem className="toolbar-toggle" value="taskList" aria-label="Task list">
          <ListTodoIcon width={18} height={18} />
        </RadixToolbar.ToggleItem>
      </RadixToolbar.ToggleGroup>
    </RadixToolbar.Root>
  );
};

export default Toolbar;

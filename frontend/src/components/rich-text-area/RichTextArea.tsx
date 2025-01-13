import { useEditor, EditorContent } from "@tiptap/react";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Bold from "@tiptap/extension-bold";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import History from "@tiptap/extension-history";
import Toolbar from "./Toolbar";
import "./styles.less";
import CustomHeading from "./extensions/CustomHeading";
import { useEffect } from "react";
import CustomListItem from "./extensions/CustomListItem";
import CustomTaskItem from "./extensions/CustomTaskItem";

interface RichTextAreaProps {
  readonly value: string;
  readonly editable?: boolean;
  readonly onChange?: (value: string) => void;
}

// TODO: Mobile context menu can cover the toolbar. Maybe the toolbar should be below the text are on mobile.
const RichTextArea = ({ value, onChange, editable = false }: RichTextAreaProps) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strike,
      Highlight.configure({ multicolor: true }),
      CustomHeading,
      BulletList.configure({ keepAttributes: true, keepMarks: true }),
      OrderedList.configure({ keepAttributes: true, keepMarks: true }),
      CustomListItem,
      TaskList,
      CustomTaskItem,
      History,
    ],
    content: value,
    editable: editable,
    onUpdate({ editor }) {
      if (!editable) return;

      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-area-editor",
      },
    },
  });

  useEffect(() => {
    if (document.activeElement?.classList.contains("toolbar-select-trigger")) {
      editor?.commands.focus();
    }
  }, [document.activeElement]);

  return (
    <div className={`rich-text-area ${editable ? "block floating" : ""}`}>
      {editor && editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextArea;

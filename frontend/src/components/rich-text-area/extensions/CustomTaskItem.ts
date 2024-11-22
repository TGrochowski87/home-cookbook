import TaskItem from "@tiptap/extension-task-item";

const CustomTaskItem = TaskItem.extend({
  content() {
    return this.options.nested ? "(paragraph|heading) block*" : "(paragraph|heading)+";
  },
}).configure({
  nested: true,
  HTMLAttributes: {
    /**
     * I haven't found any better way of controlling the checked state.
     * For some reason checkboxes' HTML does not change on click in read-only mode.
     * https://github.com/ueberdosis/tiptap/issues/3676
     */
    onclick:
      "const state = event.target.getAttribute('checked');event.target.setAttribute('checked', state === 'true' ? 'false' : 'true');",
  },
  onReadOnlyChecked() {
    return true;
  },
});

export default CustomTaskItem;

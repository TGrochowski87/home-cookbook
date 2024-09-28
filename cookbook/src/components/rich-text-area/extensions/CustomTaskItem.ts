import TaskItem from "@tiptap/extension-task-item";

const CustomTaskItem = TaskItem.extend({
  content() {
    return this.options.nested ? "(paragraph|heading) block*" : "(paragraph|heading)+";
  },
}).configure({ nested: true });

export default CustomTaskItem;

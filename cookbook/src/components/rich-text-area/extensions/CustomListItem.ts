import ListItem from "@tiptap/extension-list-item";

const CustomListItem = ListItem.extend({ content: "(paragraph|heading) block*" });

export default CustomListItem;

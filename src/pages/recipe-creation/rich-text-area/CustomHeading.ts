import Heading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/react";

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level: number = this.options.levels.includes(node.attrs.level) ? node.attrs.level : this.options.levels[0];
    const classes: Record<number, string> = {
      1: "heading-1",
      2: "heading-2",
      3: "heading-3",
      4: "heading-4",
    };

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`,
      }),
      0,
    ];
  },
}).configure({ levels: [1, 2, 3, 4] });

export default CustomHeading;

import TagChip from "components/chips/TagChip";

interface TagListProps {}

const TagList = ({}: TagListProps) => {
  return (
    <div className="tag-list">
      <TagChip name="dfgdf" />
      <TagChip name="sdgdsfgsdg" />
      <TagChip name=" sadf sda" />
      <TagChip name="sfsadfasg" />
      <TagChip name="sdf" />
      <TagChip name="gas asd" />
      <TagChip name="asdfsdf" />
      <TagChip name="sdfsadfsa " />
      <TagChip name="sdfsa" />
      <TagChip name="sdf" />
    </div>
  );
};

export default TagList;

import { TagGetDto } from "api/GET/DTOs";
import "./styles.less";
import { useEffect, useState } from "react";
import TagChip from "./TagChip";
import TagChipCheckbox from "./TagChipCheckbox";
import CreateTagButton from "./CreateTagButton";
import TagSize from "./TagSize";
import NewTag from "./NewTag";

interface TagSetProps {
  readonly tags: readonly TagGetDto[];
  readonly tagSize: TagSize;
  readonly align?: "start" | "center" | "end";
  readonly disableShadow?: boolean;
  readonly selection?: {
    readonly disabled?: boolean;
    readonly onSelectionChange?: (selectedTagIds: (number | string)[]) => void;
  };
  readonly tagCreationEnabled?: boolean;
}

const TagSet = ({
  tags,
  tagSize,
  disableShadow,
  selection = { disabled: true },
  tagCreationEnabled = false,
  align = "center",
}: TagSetProps) => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTags, setNewTags] = useState<string[]>([]);

  useEffect(() => {
    if (selection.onSelectionChange) {
      selection.onSelectionChange([...selectedTags, ...newTags]);
    }
  }, [selectedTags, newTags]);

  return (
    <div className="tag-set" style={{ justifyContent: align }}>
      {tags.map(tag =>
        selection.disabled ? (
          <TagChip key={tag.id} tagName={tag.name} size={tagSize} disableShadow={disableShadow} />
        ) : (
          <TagChipCheckbox
            key={tag.id}
            tag={tag}
            size={tagSize}
            disableShadow={disableShadow}
            checked={selectedTags.includes(tag.id)}
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                setSelectedTags(prev => [...prev, tag.id]);
              } else {
                setSelectedTags(prev => prev.filter(id => id !== tag.id));
              }
            }}
          />
        )
      )}
      {tagCreationEnabled && (
        <>
          {newTags.map(tag => (
            <NewTag
              key={tag}
              tagName={tag}
              size={tagSize}
              onDelete={() => setNewTags(prev => prev.filter(t => t != tag))}
            />
          ))}
          <CreateTagButton
            size={tagSize}
            onCreate={(name: string) => {
              if (newTags.includes(name) === false) {
                setNewTags(prev => [...prev, name]);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default TagSet;

import { TagGetDto } from "api/GET/DTOs";
import "../styles.less";
import { useState } from "react";
import TagChip from "./TagChip";
import TagChipCheckbox from "./TagChipCheckbox";
import CreateTagButton from "./CreateTagButton";

interface TagSetProps {
  readonly tags: readonly TagGetDto[];
  readonly align?: "start" | "center" | "end";
  readonly disableShadow?: boolean;
  readonly selection?: {
    readonly disabled?: boolean;
    readonly onSelectionChange?: (selectedTagIds: number[]) => void;
  };
  readonly tagCreationEnabled?: boolean;
}

const TagSet = ({
  tags,
  disableShadow,
  selection = { disabled: true },
  tagCreationEnabled = false,
  align = "center",
}: TagSetProps) => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTags, setNewTags] = useState<string[]>([]);

  return (
    <div className="tag-set" style={{ justifyContent: align }}>
      {tags.map(tag =>
        selection.disabled ? (
          <TagChip key={tag.id} tagName={tag.name} disableShadow={disableShadow} />
        ) : (
          <TagChipCheckbox
            key={tag.id}
            tag={tag}
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
      {newTags.map(newTag => (
        <TagChip tagName={newTag} />
      ))}
      {tagCreationEnabled && (
        <>
          {}
          <CreateTagButton onCreate={(name: string) => setNewTags(prev => [...prev, name])} />
        </>
      )}
    </div>
  );
};

export default TagSet;

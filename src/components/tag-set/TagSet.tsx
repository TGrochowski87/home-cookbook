import { TagGetDto } from "api/GET/DTOs";
import "./styles.less";
import { useState } from "react";
import TagChip from "./TagChip";
import TagChipCheckbox from "./TagChipCheckbox";
import CreateTagButton from "./CreateTagButton";
import TagSize from "./TagSize";

interface TagSetProps {
  readonly tags: readonly TagGetDto[];
  readonly tagSize: TagSize;
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
  tagSize,
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
          {}
          <CreateTagButton size={tagSize} onCreate={(name: string) => setNewTags(prev => [...prev, name])} />
        </>
      )}
    </div>
  );
};

export default TagSet;

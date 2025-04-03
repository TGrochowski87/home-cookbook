import "./styles.less";
import { useEffect, useState } from "react";
import TagChip from "./TagChip";
import TagChipCheckbox from "./TagChipCheckbox";
import CreateTagButton from "./CreateTagButton";
import TagSize from "./TagSize";
import NewTag from "./NewTag";
import { TagGetDto } from "api/tags/DTOs";

export interface TagSelection {
  readonly id?: number;
  readonly name: string;
}

interface TagSetProps {
  readonly tags: readonly TagGetDto[];
  readonly tagSize: TagSize;
  readonly align?: "start" | "center" | "end";
  readonly disableShadow?: boolean;
  readonly selection?: {
    readonly disabled?: boolean;
    readonly initiallySelected?: readonly string[];
    readonly onSelectionChange?: (selectedTags: TagSelection[]) => void;
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
  const [selections, setSelections] = useState<readonly TagSelection[]>(
    selection.initiallySelected ? mapInitialSelections(selection.initiallySelected, tags) : []
  );

  useEffect(() => {
    if (selection.onSelectionChange) {
      selection.onSelectionChange([...selections]);
    }
  }, [selections, selection]);

  const newTags = selections.filter(t => t.id === undefined).map(t => t.name);

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
            checked={selections.find(t => t.id === tag.id) !== undefined}
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                setSelections(prev => [...prev, { id: tag.id, name: tag.name }]);
              } else {
                setSelections(prev => prev.filter(s => s.id !== tag.id));
              }
            }}
          />
        )
      )}
      {tagCreationEnabled && (
        <>
          {newTags.map(tagName => (
            <NewTag
              key={tagName}
              tagName={tagName}
              size={tagSize}
              onDelete={() => {
                setSelections(prev => prev.filter(s => s.name !== tagName));
              }}
            />
          ))}
          <CreateTagButton
            size={tagSize}
            onCreate={(name: string) => {
              if (newTags.includes(name) === false && tags.find(t => t.name === name) === undefined) {
                setSelections(prev => [...prev, { name }]);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

const mapInitialSelections = (initialSelections: readonly string[], tags: readonly TagGetDto[]): TagSelection[] => {
  const selections: TagSelection[] = initialSelections.map(selection => ({
    name: selection,
    id: tags.find(t => t.name === selection)?.id,
  }));
  return selections;
};

export default TagSet;

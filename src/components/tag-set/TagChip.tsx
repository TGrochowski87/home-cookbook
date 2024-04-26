import "../styles.less";

interface TagChipProps {
  readonly tagName: string;
  readonly disableShadow?: boolean;
}

const TagChip = ({ tagName, disableShadow = false }: TagChipProps) => {
  return <div className={`block tag-chip ${disableShadow ? "" : "floating"}`}>{tagName}</div>;
};

export default TagChip;

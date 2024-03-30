import { TagGetDto } from "api/GET/DTOs";

interface SmallTagChipProps {
  readonly tag: TagGetDto;
}

const SmallTagChip = ({ tag }: SmallTagChipProps) => {
  return <div className="block small-tag-chip">{tag.name}</div>;
};

export default SmallTagChip;

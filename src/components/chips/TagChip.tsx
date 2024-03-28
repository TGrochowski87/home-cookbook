import { useState } from "react";
import "../styles.less";
import BaseBlock from "components/BaseBlock";

interface TagChipProps {
  readonly name: string;
}

const TagChip = ({ name }: TagChipProps) => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <BaseBlock className={`tag-chip ${active && "active"}`} onClick={() => setActive(prev => !prev)}>
      {name}
    </BaseBlock>
  );
};

export default TagChip;

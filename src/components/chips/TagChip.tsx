import { useState } from "react";
import "../styles.less";
import BaseBlock from "components/BaseBlock";

interface TagChipProps {
  readonly name: string;
  readonly disableShadow?: boolean;
  // readonly active: boolean;
}

const TagChip = ({ name, disableShadow = false }: TagChipProps) => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <BaseBlock
      disableShadow={disableShadow}
      className={`tag-chip ${active ? "active" : ""}`}
      onClick={() => setActive(prev => !prev)}>
      {name}
    </BaseBlock>
  );
};

export default TagChip;

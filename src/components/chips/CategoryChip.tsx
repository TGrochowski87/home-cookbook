import { useState } from "react";
import "../styles.less";
import BaseBlock from "components/BaseBlock";

interface CategoryChipProps {
  readonly name: string;
  readonly activeColor: string;
  // readonly active: boolean;
}

const CategoryChip = ({ name, activeColor }: CategoryChipProps) => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <BaseBlock
      className="category-chip"
      style={active ? { backgroundColor: activeColor } : {}}
      onClick={() => setActive(prev => !prev)}>
      {name}
    </BaseBlock>
  );
};

export default CategoryChip;

import { useState } from "react";
import BaseBlock from "./BaseBlock";
import "./styles.less";

interface CategoryChipProps {
  readonly name: string;
}

const CategoryChip = ({ name }: CategoryChipProps) => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <BaseBlock onClick={() => setActive(prev => !prev)} className={`category-chip ${active && "active"}`}>
      {name}
    </BaseBlock>
  );
};

export default CategoryChip;

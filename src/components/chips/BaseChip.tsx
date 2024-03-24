import BaseBlock from "components/BaseBlock";
import { useState } from "react";

interface BaseChipProps {
  readonly className?: string;
  readonly name: string;
}

const BaseChip = ({ name, className }: BaseChipProps) => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <BaseBlock onClick={() => setActive(prev => !prev)} className={`${active && "active"} ${className}`}>
      {name}
    </BaseBlock>
  );
};

export default BaseChip;

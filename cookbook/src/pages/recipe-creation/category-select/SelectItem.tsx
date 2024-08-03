import { CheckIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { PropsWithChildren } from "react";

interface SelectItemProps extends PropsWithChildren {
  readonly value: string;
}

const SelectItem = ({ value, children }: SelectItemProps) => {
  return (
    <Select.Item className="category-select-item" value={value}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="category-select-item-indicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

export default SelectItem;

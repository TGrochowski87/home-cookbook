import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";

interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange?: (checked: boolean) => void;
  readonly label?: string;
  readonly id?: string;
  readonly className?: string;
}

const Checkbox = ({ checked, onChange, label, id, className }: CheckboxProps) => {
  const idRef = useRef<string>(id ?? uuidv4());

  return (
    <span className={`checkbox-wrapper ${className}`}>
      <RadixCheckbox.Root
        checked={checked}
        onCheckedChange={(checked: boolean | "indeterminate") => {
          if (checked !== "indeterminate") {
            onChange?.(checked);
          }
        }}
        className="checkbox-root"
        id={idRef.current}>
        <RadixCheckbox.Indicator className="indicator" />
      </RadixCheckbox.Root>
      {label && <label htmlFor={idRef.current}>{label}</label>}
    </span>
  );
};

export default Checkbox;

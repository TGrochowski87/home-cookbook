import * as RadixCheckbox from "@radix-ui/react-checkbox";

interface CheckboxProps {
  readonly checked: boolean;
}

const Checkbox = ({ checked }: CheckboxProps) => {
  return (
    <RadixCheckbox.Root checked={checked} className="checkbox-root">
      <RadixCheckbox.Indicator className="indicator" />
    </RadixCheckbox.Root>
  );
};

export default Checkbox;

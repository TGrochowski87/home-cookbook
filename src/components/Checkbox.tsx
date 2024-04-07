import * as RadixCheckbox from "@radix-ui/react-checkbox";

interface CheckboxProps {}

const Checkbox = ({}: CheckboxProps) => {
  return (
    <RadixCheckbox.Root className="checkbox-root">
      <RadixCheckbox.Indicator className="indicator" />
    </RadixCheckbox.Root>
  );
};

export default Checkbox;

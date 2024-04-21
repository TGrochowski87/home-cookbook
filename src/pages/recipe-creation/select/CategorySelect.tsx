import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import SelectItem from "./SelectItem";
import { CategoryGetDto } from "api/GET/DTOs";

interface CustomSelectProps {
  readonly categories: CategoryGetDto[];
  readonly value: string;
  readonly setValue: (categoryId: string) => void;
}

const CategorySelect = ({ categories, value, setValue }: CustomSelectProps) => {
  return (
    <Select.Root value={value} onValueChange={(newValue: string) => setValue(newValue)}>
      <Select.Trigger className="input select-trigger floating" aria-label="Food">
        <Select.Value placeholder="Kategoria..." />
        <Select.Icon className="select-icon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          ref={ref => {
            // Workaround for https://github.com/radix-ui/primitives/issues/1658
            if (ref) {
              ref.ontouchstart = event => {
                event.preventDefault();
              };
            }
          }}
          position="popper"
          className="select-content floating">
          <Select.ScrollUpButton className="select-scroll-button">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="select-viewport">
            {categories.map(category => (
              <SelectItem value={category.id.toString()}>{category.name}</SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="select-scroll-button">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CategorySelect;

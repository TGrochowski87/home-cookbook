import * as Select from "@radix-ui/react-select";
// TODO: Remove @radix-ui/react-icons from the project
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import SelectItem from "./SelectItem";
import { CategoryGetDto } from "api/GET/DTOs";
import { forwardRef } from "react";

interface CustomSelectProps {
  readonly categories: readonly CategoryGetDto[];
  readonly value: string;
  readonly setValue: (categoryId: string) => void;
}

const CategorySelect = forwardRef<HTMLButtonElement, CustomSelectProps>(
  ({ categories, value, setValue }: CustomSelectProps, ref) => {
    return (
      <Select.Root value={value} onValueChange={(newValue: string) => setValue(newValue)}>
        <Select.Trigger ref={ref} className="input category-select-trigger floating" aria-label="Food">
          <Select.Value placeholder="Kategoria..." />
          <Select.Icon className="category-select-icon">
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
            className="category-select-content floating"
            position="popper">
            <Select.ScrollUpButton className="category-select-scroll-button">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="category-select-viewport">
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="category-select-scroll-button">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }
);

export default CategorySelect;

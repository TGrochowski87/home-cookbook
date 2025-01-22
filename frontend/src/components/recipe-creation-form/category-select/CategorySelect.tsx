import * as Select from "@radix-ui/react-select";
import SelectItem from "./SelectItem";
import { CategoryGetDto } from "api/GET/DTOs";
import { forwardRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
          <Select.Value placeholder="Category" />
          <Select.Icon className="category-select-icon">
            <ChevronDown />
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
              <ChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport className="category-select-viewport">
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="category-select-scroll-button">
              <ChevronDown />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }
);

export default CategorySelect;

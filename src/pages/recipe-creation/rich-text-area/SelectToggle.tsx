import * as RadixToolbar from "@radix-ui/react-Toolbar";
import * as Select from "@radix-ui/react-select";
import { Editor } from "@tiptap/react";
import useMobileCheck from "hooks/useMobileCheck";
import { ChevronDown } from "lucide-react";
import { PropsWithChildren, ReactNode, useState } from "react";

interface SelectToggleProps extends PropsWithChildren {
  readonly editor: Editor | null;
  readonly toggleValue: string;
  readonly ariaLabel: string;
  readonly options: readonly string[];
  readonly renderOption: (option: string) => ReactNode;
  readonly triggerIcon: ReactNode;
  readonly selectedOption: string;
  readonly setSelectedOption: (newValue: string) => void;
}

const SelectToggle = ({
  editor,
  toggleValue,
  ariaLabel,
  options,
  renderOption,
  triggerIcon,
  selectedOption,
  setSelectedOption,
  children,
}: SelectToggleProps) => {
  const isMobile = useMobileCheck();
  const [open, setOpen] = useState<boolean>(false);
  const [justOpened, setJustOpened] = useState<boolean>(false);

  return (
    <span className="toolbar-select toolbar-toggle">
      <RadixToolbar.ToggleItem value={toggleValue} aria-label={ariaLabel}>
        {triggerIcon}
      </RadixToolbar.ToggleItem>

      <Select.Root
        value={selectedOption}
        open={open}
        onOpenChange={(open: boolean) => {
          /**
           * For some reason, only on mobile, select gets immediately closed after clicking on the trigger
           * while having textarea focused. This is a workaround to prevent it.
           */
          if (isMobile && justOpened) {
            setJustOpened(false);
            return;
          }
          setOpen(open);

          if (open === false) {
            editor?.commands.focus();
          }
        }}
        onValueChange={(value: string) => {
          setSelectedOption(value);
          editor?.commands.focus();
        }}>
        <Select.Trigger className="toolbar-select-trigger">
          <Select.Icon>
            <ChevronDown width={14} height={14} />
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
            className="floating toolbar-select-content"
            position="popper"
            align="center">
            <Select.Viewport className="toolbar-select-viewport">
              {options.map(option => (
                <Select.Item
                  onFocus={event => {
                    if (event.relatedTarget?.classList.contains("rich-text-area-editor")) {
                      setJustOpened(true);
                    }
                  }}
                  className="toolbar-select-item"
                  key={option}
                  value={option}>
                  {renderOption(option)}
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {children}
    </span>
  );
};

export default SelectToggle;

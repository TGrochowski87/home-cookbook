import * as RadixToolbar from "@radix-ui/react-Toolbar";
import * as Select from "@radix-ui/react-select";
import { Editor } from "@tiptap/react";
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

/**
 * This is a base component for toggles in RichTextArea's toolbar that come with the option selection.
 *
 * There were many problems with this component on mobile, where, with focus on textarea, on click to open,
 * the onOpenChange handler would get called multiple times one after the other.
 * Two times in Firefox and three times on Chromium-based browsers... Only the first call had 'open' set to true.
 * Because, probably, of focus changes, also the virtual keyboard starts jumping up and down.
 * It is very hard to debug, but I implemented some workarounds to prevent this.
 */
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
  // This controls the open state of the select's drawer.
  const [open, setOpen] = useState<boolean>(false);

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
           * For all the excess calls to onOpenChange, the first item is focused, so we can ignore these
           * calls based on this condition.
           *
           * Clicking anywhere removes this focus, so this works as expected.
           */
          if (document.activeElement?.classList.contains("toolbar-select-item")) {
            return;
          }

          setOpen(open);

          // After we close the select, we want to focus the editor.
          if (open === false) {
            editor?.commands.focus();
          }
        }}
        onValueChange={(value: string) => {
          setOpen(false);
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
            onCloseAutoFocus={event => {
              /**
               * If we close the select, the trigger gets focused by default.
               * This means, that closing the select by clicking on the textarea, the textarea does not get focused.
               * This 'preventDefault' prevents that.
               */
              event.preventDefault();
            }}
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
                <Select.Item className="toolbar-select-item" key={option} value={option}>
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

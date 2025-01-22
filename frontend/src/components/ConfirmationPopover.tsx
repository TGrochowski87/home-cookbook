import { PropsWithChildren } from "react";
import * as Popover from "@radix-ui/react-popover";
import Button from "./buttons/Button";

interface ConfirmationPopoverProps extends PropsWithChildren {
  readonly text: string;
  readonly onConfirm: () => void;
  readonly side?: "top" | "right" | "bottom" | "left";
}

const ConfirmationPopover = ({ children, onConfirm, text, side = "top" }: ConfirmationPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {/* I don't remember why, but this <span> is crucial. Without it, the popover does not stick to the child. */}
        <span style={{ display: "flex" }}>{children}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="confirmation-popover-content floating" side={side} sideOffset={2}>
          <p>{text}</p>
          <Button onClick={onConfirm} className="confirmation-popover-button" disableShadow>
            yes
          </Button>
          <Popover.Arrow className="popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ConfirmationPopover;

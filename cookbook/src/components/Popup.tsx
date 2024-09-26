import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PropsWithChildren, ReactNode } from "react";
import "./styles.less";

interface PopupProps extends PropsWithChildren {
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly fullScreen?: boolean;
  readonly className?: string;
}

const Popup = ({ trigger, title, children, className = "", fullScreen = false }: PopupProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="popup-overlay" />
        <Dialog.Content
          className={`popup-content ${className} ${fullScreen ? "full-screen" : "window"}`}
          onOpenAutoFocus={e => e.preventDefault()}>
          <Dialog.Title>{title}</Dialog.Title>
          {/* Description added just to silence the warning. This is currently a private app without a need for accessibility. */}
          <Dialog.Description></Dialog.Description>
          <Dialog.Close asChild>
            <button className="close-button smooth-color-hover">
              <X />
            </button>
          </Dialog.Close>
          <div className="main-content">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Popup;

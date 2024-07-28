import * as Dialog from "@radix-ui/react-dialog";
import { Info, Pencil, X } from "lucide-react";
import { ShoppingList } from "models/ShoppingList";
import formatDate from "utilities/formatDate";

interface InfoModalProps {
  readonly shoppingListInfo: Omit<ShoppingList, "sublists">;
}

const InfoModal = ({ shoppingListInfo }: InfoModalProps) => {
  const timeUntilDeletion: number = calculateTimeUntilDeletion(shoppingListInfo.creationDate);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Info />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="info-modal-overlay" />
        <Dialog.Content className="info-modal-content" onOpenAutoFocus={e => e.preventDefault()}>
          <Dialog.Title className="info-modal-title">
            {shoppingListInfo.name}
            <Pencil width="0.9em" height="0.9em" />
          </Dialog.Title>
          {/* Description added just to silence the warning. This is currently a private app without a need for accessibility. */}
          <Dialog.Description></Dialog.Description>
          <Dialog.Close asChild>
            <button className="close-button smooth-color-hover">
              <X />
            </button>
          </Dialog.Close>
          <div className="info-space">
            <div className="date-info-row">
              <p>utworzono:</p>
              <p>{formatDate(shoppingListInfo.creationDate)}</p>
            </div>
            <div className="date-info-row">
              <p>zaktualizowano:</p>
              <p>{formatDate(shoppingListInfo.updateDate)}</p>
            </div>
            <p>automatyczne usunięcie nastąpi za:</p>
            <p>{millisecondsToTime(timeUntilDeletion)}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// TODO: Consider moving all private functions below components in other folders as well.
const calculateTimeUntilDeletion = (originalCreationDate: string): number => {
  const creationDate = new Date(originalCreationDate);
  const creationDatePlus30Days = new Date(originalCreationDate);
  creationDatePlus30Days.setDate(creationDate.getDate() + 30);

  const timeUntilDeletion = creationDatePlus30Days.getTime() - Date.now();
  return timeUntilDeletion;
};

const millisecondsToTime = (milliseconds: number): string => {
  const days = milliseconds / (1000 * 60 * 60 * 24);
  const hours = (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  const minutes = (milliseconds % (1000 * 60 * 60)) / (1000 * 60);

  let time = "";
  if (days > 0) {
    time += `${Math.floor(days)} dni `;
  }
  if (hours > 0) {
    time += `${Math.floor(hours)} godzin `;
  }
  if (minutes > 0) {
    time += `${Math.floor(minutes)} minut`;
  }

  return time;
};

export default InfoModal;

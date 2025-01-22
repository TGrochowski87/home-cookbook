import Checkbox from "components/Checkbox";
import Input from "components/Input";
import Popup from "components/Popup";
import { Info, Pencil, TriangleAlert } from "lucide-react";
import { ShoppingList } from "models/ShoppingList";
import { ReactNode, useRef, useState } from "react";
import formatDate from "utilities/formatDate";
import { calculateTimeUntilDeletion, OneWeekInMilliseconds } from "utilities/shoppingListUtilities";

interface InfoModalProps {
  readonly shoppingListInfo: Omit<ShoppingList, "sublists">;
  readonly renameHandler: (newName: string) => void;
  readonly autoDeleteToggleHandler: () => void;
}

const InfoModal = ({ shoppingListInfo, renameHandler, autoDeleteToggleHandler }: InfoModalProps) => {
  const [renameActive, setRenameActive] = useState<boolean>(false);
  const [input, setInput] = useState<string>(shoppingListInfo.name);

  // We want this message to change only after we have saved enabling/disabling of autodelete.
  const autoDeleteInfoMessage = useRef<ReactNode>(
    determineAutoDeleteInfoMessage(shoppingListInfo.autoDelete, shoppingListInfo.creationDate)
  );

  return (
    <Popup
      className="shopping-list-info-modal"
      trigger={<Info />}
      title={
        renameActive ? (
          <Input
            className="rename-input"
            disableShadow
            autoFocus
            onBlur={() => {
              renameHandler(input);
              setRenameActive(false);
            }}
            maxLength={100}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          />
        ) : (
          <>
            {shoppingListInfo.name}
            <button className="rename-button" onClick={() => setRenameActive(true)}>
              <Pencil />
            </button>
          </>
        )
      }>
      <div className="info-space">
        <div className="date-info-row">
          <p>Created:</p>
          <p>{formatDate(shoppingListInfo.creationDate)}</p>
        </div>
        <div className="date-info-row">
          <p>Updated:</p>
          <p>{formatDate(shoppingListInfo.updateDate)}</p>
        </div>
        <div className="deletion-info-row">{autoDeleteInfoMessage.current}</div>
        <Checkbox
          className="auto-delete-checkbox"
          checked={shoppingListInfo.autoDelete}
          onChange={autoDeleteToggleHandler}
          label="Automatic deletion"
        />
      </div>
    </Popup>
  );
};

const determineAutoDeleteInfoMessage = (autoDeleteEnabled: boolean, listCreationDate: string): ReactNode => {
  const timeUntilDeletion: number = calculateTimeUntilDeletion(listCreationDate);

  if (autoDeleteEnabled) {
    return (
      <>
        {timeUntilDeletion < OneWeekInMilliseconds && <TriangleAlert />}
        <span>
          <p>Automatic deletion will happen in:</p>
          <p>{millisecondsToTime(timeUntilDeletion)}</p>
        </span>
      </>
    );
  } else {
    if (timeUntilDeletion <= 0) {
      return (
        <>
          <TriangleAlert />
          <span>
            <p>The list would be immediately deleted after enabling automatic deletion</p>
          </span>
        </>
      );
    } else {
      return (
        <>
          <span>
            <p>Automatic deletion would happen in:</p>
            <p>{millisecondsToTime(timeUntilDeletion)}</p>
          </span>
        </>
      );
    }
  }
};

const millisecondsToTime = (milliseconds: number): string => {
  const days = milliseconds / (1000 * 60 * 60 * 24);
  const hours = (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  const minutes = (milliseconds % (1000 * 60 * 60)) / (1000 * 60);

  let time = "";
  if (days > 0) {
    time += `${Math.floor(days)} days `;
  }
  if (hours > 0) {
    time += `${Math.floor(hours)} hours `;
  }
  if (minutes > 0) {
    time += `${Math.floor(minutes)} minutes`;
  }

  return time;
};

export default InfoModal;

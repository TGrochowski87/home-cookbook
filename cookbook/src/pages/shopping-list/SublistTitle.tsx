import { CircleMinus, CirclePlus, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationPopover from "components/ConfirmationPopover";
import { ShoppingListSublist } from "models/ShoppingList";

interface SublistTitleProps {
  readonly sublist: ShoppingListSublist;
  readonly onIncrement: (sublistId: number) => void;
  readonly onDecrement: (sublistId: number) => void;
  readonly onRemove: (sublistId: number) => void;
}

const SublistTitle = ({ sublist, onIncrement, onDecrement, onRemove }: SublistTitleProps) => {
  return (
    <div className="sublist-title">
      <Link to={`/recipes/${sublist.recipeId}`}>
        <h2>{sublist.name}</h2>
        <Link2 width="1.3em" height="1.3em" />
      </Link>

      <CirclePlus width="1.5em" height="1.5em" onClick={() => onIncrement(sublist.id)} />

      <h2>{`x${sublist.count.toFixed(1)}`}</h2>

      {sublist.count === 0.5 ? (
        <ConfirmationPopover text="Usunąć listę?" onConfirm={() => onRemove(sublist.id)} side="left">
          <CircleMinus className="delete-icon" width="1.5em" height="1.5em" />
        </ConfirmationPopover>
      ) : (
        <CircleMinus className="delete-icon" width="1.5em" height="1.5em" onClick={() => onDecrement(sublist.id)} />
      )}
    </div>
  );
};

export default SublistTitle;

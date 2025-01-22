import { CircleMinus, CirclePlus, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationPopover from "components/ConfirmationPopover";
import { ShoppingListSublist } from "models/ShoppingList";

interface SublistTitleProps {
  readonly sublist: ShoppingListSublist;
  readonly onIncrement: (sublist: ShoppingListSublist) => void;
  readonly onDecrement: (sublist: ShoppingListSublist) => void;
}

const SublistTitle = ({ sublist, onIncrement, onDecrement }: SublistTitleProps) => {
  return (
    <div className="sublist-title">
      <Link to={`/recipes/${sublist.recipeId}`}>
        <h2>{sublist.name}</h2>
        <Link2 width="1.3em" height="1.3em" />
      </Link>

      <CirclePlus width="1.5em" height="1.5em" onClick={() => onIncrement(sublist)} />

      <h2>{`x${sublist.count.toFixed(1)}`}</h2>

      {sublist.count === 0.5 ? (
        <ConfirmationPopover text="Remove sublist?" onConfirm={() => onDecrement(sublist)} side="left">
          <CircleMinus className="delete-icon" width="1.5em" height="1.5em" />
        </ConfirmationPopover>
      ) : (
        <CircleMinus className="delete-icon" width="1.5em" height="1.5em" onClick={() => onDecrement(sublist)} />
      )}
    </div>
  );
};

export default SublistTitle;

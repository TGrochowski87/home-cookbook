import { CircleMinus, CirclePlus, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationPopover from "components/ConfirmationPopover";

interface SublistTitleProps {
  readonly title: string;
  readonly recipeId?: number;
  readonly count: number;
  readonly onIncrement: () => void;
  readonly onDecrement: () => void;
}

const SublistTitle = ({ title, count, onIncrement, onDecrement, recipeId }: SublistTitleProps) => {
  return (
    <div className="sublist-title">
      <Link to={`/recipes/${recipeId}`}>
        <h2>{title}</h2>
        <Link2 width="1.3em" height="1.3em" />
      </Link>

      <CirclePlus width="1.5em" height="1.5em" onClick={onIncrement} />

      <h2>{`x${count}`}</h2>

      {count === 1 ? (
        <ConfirmationPopover text="Usunąć listę?" onConfirm={onDecrement} side="left">
          <CircleMinus className="delete-icon" width="1.5em" height="1.5em" onClick={onDecrement} />
        </ConfirmationPopover>
      ) : (
        <CircleMinus className="delete-icon" width="1.5em" height="1.5em" onClick={onDecrement} />
      )}
    </div>
  );
};

export default SublistTitle;

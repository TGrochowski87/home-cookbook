import { CircleMinus, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationPopover from "components/ConfirmationPopover";

interface SublistTitleProps {
  readonly title: string;
  readonly recipeId?: number;
  readonly count: number;
  readonly onDelete: () => void;
}

const SublistTitle = ({ title, count, onDelete, recipeId }: SublistTitleProps) => {
  return (
    <div className="sublist-title">
      {recipeId ? (
        <Link to={`/recipes/${recipeId}`}>
          <h2>{title}</h2>
          <Link2 width="1.3em" height="1.3em" />
        </Link>
      ) : (
        <h2>{title}</h2>
      )}

      <h2>{`x${count}`}</h2>

      {count === 1 ? (
        <ConfirmationPopover text="Usunąć listę?" onConfirm={onDelete} side="left">
          <CircleMinus className="delete-icon" width="1.5em" height="1.5em" onClick={onDelete} />
        </ConfirmationPopover>
      ) : (
        <CircleMinus className="delete-icon" width="1.5em" height="1.5em" onClick={onDelete} />
      )}
    </div>
  );
};

export default SublistTitle;

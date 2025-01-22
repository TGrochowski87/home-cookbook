import api from "api/api";
import { ShoppingListGetDto } from "api/GET/DTOs";
import { useAlerts } from "components/alert/AlertStack";
import { TriangleAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import storeActions from "storage/redux/actions";
import { useAppDispatch } from "storage/redux/hooks";
import { calculateTimeUntilDeletion, OneWeekInMilliseconds } from "utilities/shoppingListUtilities";

interface ShoppingListProps {
  readonly listData: ShoppingListGetDto;
}

const ShoppingList = ({ listData }: ShoppingListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { displayMessage } = useAlerts();

  const soonToBeDeleted: boolean = calculateTimeUntilDeletion(listData.creationDate) < OneWeekInMilliseconds;

  return (
    <article
      className={`shopping-list block floating interactive-element ${listData.autoDelete ? "" : "persistent"}`}
      onClick={() => navigate(`/shopping-lists/${listData.id}`)}>
      <button
        className="delete-button"
        onClick={async event => {
          event.stopPropagation();

          if (window.confirm("Delete the shopping list?")) {
            try {
              await api.delete.deleteShoppingList(listData.id, listData.updateDate);
              dispatch(storeActions.shoppingLists.removeShoppingList(listData.id));
            } catch (error) {
              displayMessage({ type: "error", message: "Could not dele the list.", fadeOutAfter: 5000 });
            }
          }
        }}>
        <X />
      </button>
      {listData.autoDelete && soonToBeDeleted && <TriangleAlert className="warning-icon" />}
      <h2>{listData.name}</h2>
      <div className="dates-row">
        <p>{`Created: ${new Date(listData.creationDate).toLocaleDateString("pl-PL")}`}</p>
        <p>{`Updated: ${new Date(listData.updateDate).toLocaleDateString("pl-PL")}`}</p>
      </div>
    </article>
  );
};

export default ShoppingList;

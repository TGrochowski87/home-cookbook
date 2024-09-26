import { ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import Popup from "components/Popup";
import { useAlerts } from "components/alert/AlertStack";
import HighlightingList from "components/list/HighlightingList";
import { useNavigate } from "react-router-dom";

interface AddToShoppingListScreenProps {
  readonly recipeId: number;
  readonly shoppingLists: readonly ShoppingListGetDto[];
}

const AddToShoppingListScreen = ({ recipeId, shoppingLists }: AddToShoppingListScreenProps) => {
  const navigate = useNavigate();
  const { displayMessage } = useAlerts();

  const listClickHandler = async (listId: number) => {
    try {
      await api.post.createShoppingListSublist(listId, recipeId);
      displayMessage({ type: "success", message: "Przepis został dodany.", fadeOutAfter: 5000 });
      navigate(`/shopping-lists/${listId}`);
    } catch (error) {
      displayMessage({ type: "error", message: "Wystąpił nieoczekiwany błąd.", fadeOutAfter: 5000 });
    }
  };

  return (
    <Popup
      className="add-to-shopping-list-popup"
      trigger={
        <div className="add-to-shopping-list-button-space">
          <button>Dodaj niezaznaczone do listy zakupów</button>
        </div>
      }
      title="Wybierz listę"
      fullScreen>
      <HighlightingList
        className="shopping-lists"
        noMarkers
        items={shoppingLists.map(sl => ({ ...sl, key: sl.id }))}
        render={list => (
          <button key={list.id} onClick={() => listClickHandler(list.id)}>
            {list.name}
          </button>
        )}
      />
    </Popup>
  );
};

export default AddToShoppingListScreen;

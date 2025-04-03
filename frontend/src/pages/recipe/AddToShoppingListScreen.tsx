import api from "api/api";
import { ShoppingListGetDto } from "api/shopping-lists/DTOs";
import axios from "axios";
import Popup from "components/Popup";
import { useAlerts } from "components/alert/AlertStack";
import HighlightingList from "components/highlighting-list/HighlightingList";
import { useNavigate } from "react-router-dom";
import storeActions from "storage/redux/actions";
import { useAppDispatch } from "storage/redux/hooks";

interface AddToShoppingListScreenProps {
  readonly recipeId: number;
  readonly shoppingLists: readonly ShoppingListGetDto[];
}

const AddToShoppingListScreen = ({ recipeId, shoppingLists }: AddToShoppingListScreenProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { displayMessage } = useAlerts();

  const listClickHandler = async (listId: number) => {
    try {
      await api.shoppingLists.createShoppingListSublist(listId, recipeId);
      const updatedShoppingList = await api.shoppingLists.getShoppingList(listId);
      dispatch(storeActions.shoppingLists.updateCachedShoppingList(updatedShoppingList));
      displayMessage({ type: "success", message: "Przepis został dodany.", fadeOutAfter: 5000 });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        displayMessage({
          type: "info",
          message: "Przepis już jest na tej liście zakupów.",
          fadeOutAfter: 5000,
        });
      } else {
        throw error;
      }
    }

    navigate(`/shopping-lists/${listId}`);
  };

  return (
    <Popup
      className="add-to-shopping-list-popup"
      trigger={
        <div className="add-to-shopping-list-button-space">
          <button>Dodaj składniki do listy zakupów</button>
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

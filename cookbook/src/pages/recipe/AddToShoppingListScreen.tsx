import { ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import axios from "axios";
import Popup from "components/Popup";
import { useAlerts } from "components/alert/AlertStack";
import HighlightingList from "components/highlighting-list/HighlightingList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "storage/redux/hooks";
import { fetchShoppingListDetails } from "storage/redux/slices/shoppingListsSlice";

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
      await api.post.createShoppingListSublist(listId, recipeId);
      // po prostu API call i nadpisanie stanu przez zwykły reducer. W zwykłym reducerze będzie sortowanie/wstawianie na początek listy.
      dispatch(fetchShoppingListDetails({ id: listId, forceUpdate: true }));
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

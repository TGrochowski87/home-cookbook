import ShoppingListItem from "./ShoppingList";
import "./styles.less";
import api from "api/api";
import { useNavigate } from "react-router-dom";
import AddButton from "components/buttons/AddButton";
import BottomPageFadeout from "components/BottomPageFadeout";
import store from "storage/redux/store";
import { useAppDispatch, useAppSelector } from "storage/redux/hooks";
import storeActions from "storage/redux/actions";

export async function loader(): Promise<null> {
  /**
   * TODO: This loader gets called before the ShoppingList.tsx useEffect that updates the shopping list in component cleanup.
   * Maybe it will get fixed in the meantime, while implementing redux.
   */
  await store.dispatch(storeActions.shoppingLists.async.fetchShoppingLists()).unwrap();
  return null;
}

const ShoppingPage = () => {
  const dispatch = useAppDispatch();
  const { shoppingLists } = useAppSelector(state => state.shoppingLists);
  const navigate = useNavigate();

  const handleShoppingListCreate = async () => {
    const name = new Date().toLocaleDateString("pl-PL");
    const newShoppingList = await api.post.createShoppingList(name);
    dispatch(storeActions.shoppingLists.addShoppingList(newShoppingList));
    navigate(`/shopping-lists/${newShoppingList.id}`);
  };

  return (
    <div className="shopping-page">
      {shoppingLists.map(list => (
        <ShoppingListItem key={list.id} listData={list} />
      ))}
      <BottomPageFadeout />
      <AddButton onClick={handleShoppingListCreate} />
    </div>
  );
};

export default ShoppingPage;

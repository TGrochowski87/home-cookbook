import { ShoppingListGetDto } from "api/GET/DTOs";
import ShoppingListItem from "./ShoppingList";
import "./styles.less";
import api from "api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import AddButton from "components/AddButton";
import BottomPageFadeout from "components/BottomPageFadeout";

interface LoaderResponse {
  readonly lists: readonly ShoppingListGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  /**
   * TODO: This loader gets called before the ShoppingList.tsx useEffect that updates the shopping list in component cleanup.
   * Maybe it will get fixed in the meantime, while implementing redux.
   */
  const lists = await api.get.getShoppingLists();
  return { lists };
}

const ShoppingPage = () => {
  const { lists } = useLoaderData() as LoaderResponse;
  const navigate = useNavigate();

  const handleShoppingListCreate = async () => {
    const name = new Date().toLocaleDateString("pl-PL");
    const shoppingListId = await api.post.createShoppingList(name);
    navigate(`/shopping-lists/${shoppingListId}`);
  };

  return (
    <div className="shopping-page">
      {lists.map(list => (
        <ShoppingListItem key={list.id} listData={list} />
      ))}
      <BottomPageFadeout />
      <AddButton onClick={handleShoppingListCreate} />
    </div>
  );
};

export default ShoppingPage;

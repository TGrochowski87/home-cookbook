import { ShoppingListGetDto } from "api/GET/DTOs";
import ShoppingListItem from "./ShoppingList";
import "./styles.less";
import api from "api/api";
import { useLoaderData } from "react-router-dom";

interface LoaderResponse {
  readonly lists: readonly ShoppingListGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const lists = await api.get.getShoppingLists();
  return { lists };
}

const ShoppingPage = () => {
  const { lists } = useLoaderData() as LoaderResponse;

  return (
    <div className="shopping-page">
      {lists.map(list => (
        <ShoppingListItem key={list.id} listData={list} />
      ))}
    </div>
  );
};

export default ShoppingPage;

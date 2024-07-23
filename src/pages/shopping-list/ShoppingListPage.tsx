import { ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
  const shoppingList = await api.get.getShoppingList(params.id);
  return shoppingList;
}

const ShoppingListPage = () => {
  const shoppingList = useLoaderData() as ShoppingListGetDto;

  return (
    <div className="page shopping-list-page">
      <h1>{shoppingList.name}</h1>
    </div>
  );
};

export default ShoppingListPage;

import { baseUrl } from "api/api";
import axios from "axios";
import { ShoppingListUpdateDto } from "./DTOs";

export const updateShoppingSublistCount = async (sublistId: number, count: number) => {
  const url = `${baseUrl}/shopping-lists/sublists/${sublistId}`;
  const response = await axios.patch(url, { count });
  return response.data;
};

export const updateShoppingList = async (shoppingListId: number, dto: ShoppingListUpdateDto) => {
  const url = `${baseUrl}/shopping-lists/${shoppingListId}`;
  const response = await axios.patch(url, { dto });
  return response.data;
};

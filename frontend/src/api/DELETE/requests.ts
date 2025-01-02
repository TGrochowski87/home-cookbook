import { baseUrl } from "api/api";
import axios from "axios";

export const deleteShoppingListSublist = async (sublistId: number): Promise<void> => {
  const url = `${baseUrl}/shopping-lists/sublists/${sublistId}`;
  const response = await axios.delete(url);
  return response.data;
};

export const deleteShoppingList = async (listId: number, resourceStateTimestamp: string): Promise<void> => {
  const url = `${baseUrl}/shopping-lists/${listId}`;
  const response = await axios.delete(url, { headers: { "If-Unmodified-Since": resourceStateTimestamp } });
  return response.data;
};

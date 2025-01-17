import { BaseUrl } from "api/api";
import axios from "axios";

export const deleteShoppingList = async (listId: number, resourceStateTimestamp: string): Promise<void> => {
  const url = `${BaseUrl}/shopping-lists/${listId}`;
  const response = await axios.delete(url, { headers: { "If-Unmodified-Since": resourceStateTimestamp } });
  return response.data;
};

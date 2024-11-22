import { baseUrl } from "api/api";
import axios from "axios";

export const deleteShoppingListSublist = async (sublistId: number) => {
  const url = `${baseUrl}/shopping-lists/sublists/${sublistId}`;
  const response = await axios.delete(url);
  return response.data;
};

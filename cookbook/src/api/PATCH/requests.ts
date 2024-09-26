import { baseUrl } from "api/api";
import axios from "axios";

export const updateShoppingSublistCount = async (sublistId: number, count: number) => {
  const url = `${baseUrl}/shopping-lists/sublists/${sublistId}`;
  const response = await axios.patch(url, { count });
  return response.data;
};

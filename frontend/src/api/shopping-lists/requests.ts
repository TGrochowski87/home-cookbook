import { BaseUrl } from "api/api";
import axios from "axios";
import { ShoppingListGetDto, ShoppingListDetailsGetDto, ShoppingListUpdateDto } from "./DTOs";

export const getShoppingLists = async (): Promise<ShoppingListGetDto[]> => {
  const url = `${BaseUrl}/shopping-lists`;
  const response = await axios.get<ShoppingListGetDto[]>(url);
  return response.data;
};

export const getShoppingList = async (id: number): Promise<ShoppingListDetailsGetDto> => {
  const url = `${BaseUrl}/shopping-lists/${id}`;
  const response = await axios.get<ShoppingListDetailsGetDto>(url);
  return response.data;
};

export const createShoppingListSublist = async (shoppingListId: number, recipeId: number) => {
  const url = `${BaseUrl}/shopping-lists/${shoppingListId}/sublists`;
  const response = await axios.post(url, { recipeId });
  return response.data;
};

export const createShoppingList = async (name: string): Promise<ShoppingListDetailsGetDto> => {
  const url = `${BaseUrl}/shopping-lists`;
  const response = await axios.post(url, { name });
  return response.data;
};

export const updateShoppingList = async (
  shoppingListId: number,
  resourceStateTimestamp: string,
  dto: ShoppingListUpdateDto
): Promise<ShoppingListDetailsGetDto> => {
  const url = `${BaseUrl}/shopping-lists/${shoppingListId}`;
  const response = await axios.put(url, dto, {
    headers: {
      "If-Unmodified-Since": resourceStateTimestamp,
    },
  });
  return response.data;
};

/**
 * This version of updateShoppingListWithFetch is used when I need to just send the request without checking the response,
 * e.g. when unmounting component or losing focus on browser tab.
 */
export const updateShoppingListWithFetch = async (
  shoppingListId: number,
  resourceStateTimestamp: string,
  dto: ShoppingListUpdateDto
): Promise<ShoppingListDetailsGetDto> => {
  const url = `${BaseUrl}/shopping-lists/${shoppingListId}`;
  const bodyJsonString = JSON.stringify(dto);

  // The options are either fetch with keepalive or navigator.sendBeacon, but the latter is much more restrictive.
  const response = await fetch(url, {
    method: "PUT",
    keepalive: true, // This allows the request to outlive the page.
    headers: {
      "Content-Type": "application/json",
      "If-Unmodified-Since": resourceStateTimestamp,
    },
    body: bodyJsonString,
  });

  return response.json();
};

export const deleteShoppingList = async (listId: number, resourceStateTimestamp: string): Promise<void> => {
  const url = `${BaseUrl}/shopping-lists/${listId}`;
  const response = await axios.delete(url, { headers: { "If-Unmodified-Since": resourceStateTimestamp } });
  return response.data;
};

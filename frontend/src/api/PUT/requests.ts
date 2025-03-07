import { RecipeCreateDto } from "api/POST/DTOs";
import { prepareRecipeFormData } from "api/POST/requests";
import { BaseUrl } from "api/api";
import axios from "axios";
import { ShoppingListUpdateDto } from "./DTOs";
import { RecipeDetailsGetDto, ShoppingListDetailsGetDto } from "api/GET/DTOs";

export const updateRecipe = async (
  recipeId: number,
  resourceStateTimestamp: string,
  data: RecipeCreateDto
): Promise<RecipeDetailsGetDto> => {
  const formData = prepareRecipeFormData(data);
  const url = `${BaseUrl}/recipes/${recipeId}`;
  const response = await axios.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "If-Unmodified-Since": resourceStateTimestamp,
    },
  });
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

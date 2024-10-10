import { RecipeCreateDto } from "api/POST/DTOs";
import { prepareRecipeFormData } from "api/POST/requests";
import { baseUrl } from "api/api";
import axios from "axios";
import { ShoppingListUpdateDto } from "./DTOs";
import { ShoppingListDetailsGetDto } from "api/GET/DTOs";

export const updateRecipe = async (recipeId: number, data: RecipeCreateDto): Promise<void> => {
  const formData = prepareRecipeFormData(data);
  const url = `${baseUrl}/recipes/${recipeId}`;
  const response = await axios.put(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateShoppingList = async (
  shoppingListId: number,
  dto: ShoppingListUpdateDto
): Promise<ShoppingListDetailsGetDto> => {
  const url = `${baseUrl}/shopping-lists/${shoppingListId}`;
  const response = await axios.put(url, dto);
  return response.data;
};

/**
 * This version of updateShoppingListWithFetch is used when I need to just send the request without checking the response,
 * e.g. when unmounting component or losing focus on browser tab.
 */
export const updateShoppingListWithFetch = (shoppingListId: number, dto: ShoppingListUpdateDto) => {
  const url = `${baseUrl}/shopping-lists/${shoppingListId}`;
  const bodyJsonString = JSON.stringify(dto);

  // The options are either fetch with keepalive or navigator.sendBeacon, but the latter is much more restrictive.
  fetch(url, {
    method: "PUT",
    keepalive: true, // This allows the request to outlive the page.
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyJsonString,
  });
};

import axios from "axios";
import {
  CategoryGetDto,
  GetRecipesResponseDto,
  RecipeDetailsGetDto,
  ShoppingListDetailsGetDto,
  ShoppingListGetDto,
  TagGetDto,
} from "./DTOs";
import { baseUrl } from "api/api";

// TODO: Cancellation token

export const getCategories = async (): Promise<CategoryGetDto[]> => {
  const url = `${baseUrl}/categories`;
  const response = await axios.get<CategoryGetDto[]>(url);
  return response.data;
};

export const getTags = async (): Promise<TagGetDto[]> => {
  const url = `${baseUrl}/tags`;
  const response = await axios.get<TagGetDto[]>(url);
  return response.data;
};

export type GetRecipesURL = { type: "Query"; query: string } | { type: "Whole"; url: string };

export const getRecipes = async (url: GetRecipesURL): Promise<GetRecipesResponseDto> => {
  const finalUrl = url.type === "Query" ? `${baseUrl}/recipes${url.query}` : url.url;

  // await new Promise(resolve => {
  //   setTimeout(resolve, 3000);
  // });

  const response = await axios.get<GetRecipesResponseDto>(finalUrl);
  return response.data;
};

export const getRecipe = async (id: number): Promise<RecipeDetailsGetDto> => {
  const url = `${baseUrl}/recipes/${id}`;
  const response = await axios.get<RecipeDetailsGetDto>(url);
  return response.data;
};

export const getShoppingLists = async (): Promise<ShoppingListGetDto[]> => {
  const url = `${baseUrl}/shopping-lists`;
  const response = await axios.get<ShoppingListGetDto[]>(url);
  return response.data;
};

export const getShoppingList = async (id: number): Promise<ShoppingListDetailsGetDto> => {
  const url = `${baseUrl}/shopping-lists/${id}`;
  const response = await axios.get<ShoppingListDetailsGetDto>(url);
  return response.data;
};

import axios from "axios";
import {
  CategoryGetDto,
  GetRecipesResponseDto,
  RecipeDetailsGetDto,
  ShoppingListDetailsGetDto,
  ShoppingListGetDto,
  TagGetDto,
} from "./DTOs";
import { BaseUrl } from "api/api";
import dbData from "db/data";

export const getCategories = async (): Promise<CategoryGetDto[]> => {
  return [...dbData.categories];
};

export const getTags = async (): Promise<TagGetDto[]> => {
  return [...dbData.tags];
};

export type GetRecipesURL = { type: "Query"; query: string } | { type: "FullUrl"; url: string };

export const getRecipes = async (url: GetRecipesURL): Promise<GetRecipesResponseDto> => {
  const finalUrl = url.type === "Query" ? `${BaseUrl}/recipes${url.query}` : url.url;

  // await new Promise(resolve => {
  //   setTimeout(resolve, 3000);
  // });

  const response = await axios.get<GetRecipesResponseDto>(finalUrl);
  return response.data;
};

export const getRecipe = async (id: number): Promise<RecipeDetailsGetDto> => {
  const url = `${BaseUrl}/recipes/${id}`;
  const response = await axios.get<RecipeDetailsGetDto>(url);
  return response.data;
};

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

export const getImage = async (url: string): Promise<Blob> => {
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

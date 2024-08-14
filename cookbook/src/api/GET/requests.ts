import axios from "axios";
import {
  CategoryGetDto,
  RecipeDetailsGetDto,
  RecipeGetDto,
  ShoppingListDetailsGetDto,
  ShoppingListGetDto,
  TagGetDto,
} from "./DTOs";
import { baseUrl } from "api/api";

// TODO: Extends on real API
// TODO: Cancellation token

export const getCategories = async (): Promise<CategoryGetDto[]> => {
  const url = `http://192.168.0.164:5212/categories`;
  const response = await axios.get<CategoryGetDto[]>(url);
  return response.data;
};

export const getTags = async (): Promise<TagGetDto[]> => {
  const url = `http://192.168.0.164:5212/tags`;
  const response = await axios.get<TagGetDto[]>(url);
  return response.data;
};

export const getRecipes = async (): Promise<RecipeGetDto[]> => {
  const url = `http://192.168.0.164:5212/recipes`;
  const response = await axios.get<RecipeGetDto[]>(url);
  return response.data;
};

export const getRecipe = async (id: number): Promise<RecipeDetailsGetDto> => {
  const url = `http://192.168.0.164:5212/recipes/${id}`;
  const response = await axios.get<RecipeDetailsGetDto>(url);
  return response.data;
};

export const getShoppingLists = async (): Promise<ShoppingListGetDto[]> => {
  const url = `http://192.168.0.164:5212/shopping-lists`;
  const response = await axios.get<ShoppingListGetDto[]>(url);
  return response.data;
};

export const getShoppingList = async (id: number): Promise<ShoppingListDetailsGetDto> => {
  const url = `http://192.168.0.164:5212/shopping-lists/${id}`;
  const response = await axios.get<ShoppingListDetailsGetDto>(url);
  return response.data;
};

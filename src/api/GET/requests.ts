import axios from "axios";
import { CategoryGetDto, RecipeDetailsGetDto, RecipeGetDto, TagGetDto } from "./DTOs";
import { baseUrl } from "api/api";

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

export const getRecipes = async (): Promise<RecipeGetDto[]> => {
  const url = `${baseUrl}/recipes`;
  const response = await axios.get<RecipeGetDto[]>(url);
  return response.data;
};

export const getRecipe = async (id: number): Promise<RecipeDetailsGetDto> => {
  const url = `${baseUrl}/recipes/${id}`;
  const response = await axios.get<RecipeDetailsGetDto>(url);
  return response.data;
};

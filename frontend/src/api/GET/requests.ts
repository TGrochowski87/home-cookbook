import axios from "axios";
import {
  CategoryGetDto,
  GetRecipesResponseDto,
  RecipeDetailsGetDto,
  ShoppingListDetailsGetDto,
  ShoppingListGetDto,
  TagGetDto,
} from "./DTOs";
import dbData from "db/data";

export const getCategories = async (): Promise<CategoryGetDto[]> => {
  return [...dbData.categories];
};

export const getTags = async (): Promise<TagGetDto[]> => {
  return [...dbData.tags];
};

export type GetRecipesURL = { type: "Query"; query: string };

export const getRecipes = async (url: GetRecipesURL): Promise<GetRecipesResponseDto> => {
  console.log(url.query);

  let recipes = [...dbData.recipes];
  const filters = {
    name: url.query.match(/(?<=name=)[^&]*/g)?.[0] ?? null,
    category: url.query.match(/(?<=category=)[^&]*/g)?.[0] ?? null,
    tags: url.query.match(/(?<=tags=)[^&]*/g) ?? null,
  };
  console.log(filters);

  if (filters.name) {
    recipes = recipes.filter(r => r.name.toLowerCase().includes(filters.name!.toLowerCase()));
  }
  if (filters.category) {
    recipes = recipes.filter(r => r.category.name === filters.category);
  }
  if (filters.tags) {
    recipes = recipes.filter(r => filters.tags!.every(tag => r.tags.some(t => t.name === tag)));
  }

  return {
    nextPage: null,
    recipes,
  };
};

export const getRecipe = async (id: number): Promise<RecipeDetailsGetDto> => {
  const recipe = dbData.recipes.find(r => r.id === id);
  if (recipe === undefined) {
    throw new Error("Recipe not found");
  }

  return recipe;
};

export const getShoppingLists = async (): Promise<ShoppingListGetDto[]> => {
  return [...dbData.shoppingLists];
};

export const getShoppingList = async (id: number): Promise<ShoppingListDetailsGetDto> => {
  const list = dbData.shoppingLists.find(l => l.id === id);
  if (list === undefined) {
    throw new Error("List not found");
  }

  return list;
};

export const getImage = async (url: string): Promise<Blob> => {
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

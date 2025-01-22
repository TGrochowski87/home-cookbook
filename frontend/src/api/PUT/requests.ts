import { RecipeCreateDto } from "api/POST/DTOs";
import { BaseUrl } from "api/api";
import axios from "axios";
import { ShoppingListUpdateDto } from "./DTOs";
import { QuantifiableItemGetDto, RecipeDetailsGetDto, ShoppingListDetailsGetDto, TagGetDto } from "api/GET/DTOs";
import dbData from "db/data";

export const updateRecipe = async (
  recipeId: number,
  resourceStateTimestamp: string,
  data: RecipeCreateDto
): Promise<RecipeDetailsGetDto> => {
  const recipeTags = data.tagIds.map(id => dbData.tags.find(t => t.id === id)!);
  for (const tag of data.newTags) {
    const newTag: TagGetDto = {
      id: dbData.tags.length + 1,
      name: tag.name,
    };
    dbData.tags = [newTag, ...dbData.tags];

    recipeTags.push(newTag);
  }

  const recipeIngredients: QuantifiableItemGetDto[] = data.ingredients.map((ingredient, index) => ({
    id: index + 1,
    name: ingredient.name,
    amount: ingredient.amount,
    checked: false,
  }));

  const updatedRecipe: RecipeDetailsGetDto = {
    id: dbData.recipes.length + 1,
    name: data.name,
    description: data.description,
    category: dbData.categories.find(c => c.id === data.categoryId)!,
    creationDate: new Date().toLocaleDateString(),
    updateDate: new Date().toLocaleDateString(),
    tags: recipeTags,
    ingredients: recipeIngredients,
    imageSrc: data.image ? URL.createObjectURL(data.image) : undefined,
  };

  dbData.recipes = dbData.recipes.map(r => (r.id === recipeId ? updatedRecipe : r));

  return updatedRecipe;
};

export const updateShoppingList = async (
  shoppingListId: number,
  resourceStateTimestamp: string,
  dto: ShoppingListUpdateDto
): Promise<ShoppingListDetailsGetDto> => {
  const currentState = dbData.shoppingLists.find(l => l.id === shoppingListId)!;
  const newList: ShoppingListDetailsGetDto = {
    id: shoppingListId,
    name: dto.name,
    creationDate: currentState.creationDate,
    updateDate: new Date().toLocaleDateString(),
    autoDelete: dto.autoDelete,
    sublists: dto.sublists.map(sub => ({
      id: sub.id,
      name: sub.name,
      recipeId: currentState.sublists.find(s => s.id === sub.id)!.recipeId,
      count: sub.count,
      items: sub.items.map(item => ({
        ...item,
        id: item.id ?? Math.max(...currentState.sublists.find(s => s.id === sub.id)!.items.map(i => i.id)) + 1,
      })),
    })),
  };
  dbData.shoppingLists = [newList, ...dbData.shoppingLists];
  return newList;
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
  const currentState = dbData.shoppingLists.find(l => l.id === shoppingListId)!;
  const newList: ShoppingListDetailsGetDto = {
    id: shoppingListId,
    name: dto.name,
    creationDate: currentState.creationDate,
    updateDate: new Date().toLocaleDateString(),
    autoDelete: dto.autoDelete,
    sublists: dto.sublists.map(sub => ({
      id: sub.id,
      name: sub.name,
      recipeId: currentState.sublists.find(s => s.id === sub.id)!.recipeId,
      count: sub.count,
      items: sub.items.map(item => ({
        ...item,
        id: item.id ?? Math.max(...currentState.sublists.find(s => s.id === sub.id)!.items.map(i => i.id)) + 1,
      })),
    })),
  };
  dbData.shoppingLists = [newList, ...dbData.shoppingLists];
  return newList;
};

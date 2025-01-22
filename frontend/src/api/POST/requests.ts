import { BaseUrl } from "api/api";
import { RecipeCreateDto } from "./DTOs";
import axios from "axios";
import {
  QuantifiableItemGetDto,
  RecipeDetailsGetDto,
  ShoppingListDetailsGetDto,
  ShoppingListSublistGetDto,
  TagGetDto,
} from "api/GET/DTOs";
import dbData from "db/data";

export const createShoppingListSublist = async (shoppingListId: number, recipeId: number) => {
  const shoppingList = dbData.shoppingLists.find(l => l.id === shoppingListId)!;
  const recipe = dbData.recipes.find(r => r.id === recipeId)!;
  const recipeIngredients = recipe.ingredients.map(i => ({ ...i, checked: false }));

  const newShoppingListSublist: ShoppingListSublistGetDto = {
    id: shoppingList.sublists.length + 1,
    name: recipe.name,
    recipeId,
    count: 1,
    items: recipeIngredients,
  };

  dbData.shoppingLists = dbData.shoppingLists.map(l =>
    l.id === shoppingListId ? { ...l, sublists: [...l.sublists, newShoppingListSublist] } : l
  );
};

export const createShoppingList = async (name: string): Promise<ShoppingListDetailsGetDto> => {
  const newList: ShoppingListDetailsGetDto = {
    id: dbData.shoppingLists.length + 1,
    name,
    creationDate: new Date().toLocaleDateString(),
    updateDate: new Date().toLocaleDateString(),
    autoDelete: true,
    sublists: [
      {
        id: 1,
        name: "Manual sublist",
        recipeId: null,
        count: 1,
        items: [],
      },
    ],
  };
  dbData.shoppingLists = [newList, ...dbData.shoppingLists];
  return newList;
};

export const createRecipe = async (recipe: RecipeCreateDto): Promise<RecipeDetailsGetDto> => {
  const recipeTags = recipe.tagIds.map(id => dbData.tags.find(t => t.id === id)!);
  for (const tag of recipe.newTags) {
    const newTag: TagGetDto = {
      id: dbData.tags.length + 1,
      name: tag.name,
    };
    dbData.tags = [newTag, ...dbData.tags];

    recipeTags.push(newTag);
  }

  const recipeIngredients: QuantifiableItemGetDto[] = recipe.ingredients.map((ingredient, index) => ({
    id: index + 1,
    name: ingredient.name,
    amount: ingredient.amount,
    checked: false,
  }));

  const newRecipe: RecipeDetailsGetDto = {
    id: dbData.recipes.length + 1,
    name: recipe.name,
    description: recipe.description,
    category: dbData.categories.find(c => c.id === recipe.categoryId)!,
    creationDate: new Date().toLocaleDateString(),
    updateDate: new Date().toLocaleDateString(),
    tags: recipeTags,
    ingredients: recipeIngredients,
    imageSrc: recipe.image ? URL.createObjectURL(recipe.image) : undefined,
  };

  dbData.recipes = [newRecipe, ...dbData.recipes];
  return newRecipe;
};

import { BaseUrl } from "api/api";
import { RecipeCreateDto } from "./DTOs";
import axios from "axios";
import { RecipeDetailsGetDto, ShoppingListDetailsGetDto } from "api/GET/DTOs";

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

export const createRecipe = async (recipe: RecipeCreateDto): Promise<RecipeDetailsGetDto> => {
  const formData = prepareRecipeFormData(recipe);
  const url = `${BaseUrl}/recipes`;
  const response = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const prepareRecipeFormData = (recipe: RecipeCreateDto): FormData => {
  const formData = new FormData();
  formData.append("name", recipe.name);
  formData.append("categoryId", recipe.categoryId.toString());
  if (recipe.image) {
    formData.append("image", recipe.image);
  }
  recipe.tagIds.forEach(id => {
    formData.append("tagIds", JSON.stringify(id));
  });
  recipe.newTags.forEach((tag, index) => {
    formData.append(`newTags[${index}].name`, tag.name);
  });
  recipe.ingredients.forEach((ingredient, index) => {
    formData.append(`ingredients[${index}].name`, ingredient.name);

    if (ingredient.amount.value) {
      formData.append(`ingredients[${index}].amount.value`, ingredient.amount.value);
    }
    if (ingredient.amount.unit) {
      formData.append(`ingredients[${index}].amount.unit`, ingredient.amount.unit);
    }
  });
  formData.append("description", recipe.description);

  return formData;
};

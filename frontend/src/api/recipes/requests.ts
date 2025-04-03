import { BaseUrl } from "api/api";
import axios from "axios";
import { GetRecipesResponseDto, RecipeDetailsGetDto, RecipeCreateDto } from "./DTOs";

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

export const getImage = async (url: string): Promise<Blob> => {
  const response = await axios.get(url, { responseType: "blob" });
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

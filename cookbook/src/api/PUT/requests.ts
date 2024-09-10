import { RecipeCreateDto } from "api/POST/DTOs";
import { prepareRecipeFormData } from "api/POST/requests";
import { baseUrl } from "api/api";
import axios from "axios";

export const updateRecipe = async (recipeId: number, data: RecipeCreateDto): Promise<void> => {
  const formData = prepareRecipeFormData(data);
  const url = `${baseUrl}/recipes/${recipeId}`;
  const response = await axios.put(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

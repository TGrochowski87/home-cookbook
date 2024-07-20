import { baseUrl } from "api/api";
import { RecipeCreateDto } from "./DTOs";
import axios from "axios";

export const createRecipe = async (recipe: RecipeCreateDto): Promise<void> => {
  const url = `${baseUrl}/recipes`;
  const response = await axios.post(url, recipe);
  return response.data;
};

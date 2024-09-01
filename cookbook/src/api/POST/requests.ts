import { baseUrl } from "api/api";
import { RecipeCreateDto } from "./DTOs";
import axios from "axios";

export const createRecipe = async (recipe: RecipeCreateDto): Promise<void> => {
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
    formData.append(`ingredients[${index}].amount.value`, ingredient.amount.value);

    if (ingredient.amount.unit) {
      formData.append(`ingredients[${index}].amount.unit`, ingredient.amount.unit);
    }
  });
  formData.append("description", recipe.description);

  const url = `${baseUrl}/recipes`;
  const response = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

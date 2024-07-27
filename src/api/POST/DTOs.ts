import { IngredientGetDto } from "api/GET/DTOs";

export interface RecipeCreateDto {
  readonly name: string;
  readonly categoryId: number;
  readonly image?: Blob;
  readonly tags: ReadonlyArray<number | string>;
  readonly ingredients: ReadonlyArray<IngredientCreateDto>;
  readonly description: string;
}

export type IngredientCreateDto = Omit<IngredientGetDto, "id">;

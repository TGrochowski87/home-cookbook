import Ingredient from "models/Ingredient";

export interface RecipeCreateDto {
  readonly name: string;
  readonly categoryId: number;
  readonly image?: Blob;
  readonly tags: ReadonlyArray<number | string>;
  readonly ingredients: ReadonlyArray<Ingredient>;
  readonly description: string;
}

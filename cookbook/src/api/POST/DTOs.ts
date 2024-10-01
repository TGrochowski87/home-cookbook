import { QuantifiableItemGetDto } from "api/GET/DTOs";

export interface RecipeCreateDto {
  readonly name: string;
  readonly categoryId: number;
  readonly image?: Blob;
  readonly tagIds: ReadonlyArray<number>;
  readonly newTags: ReadonlyArray<TagCreateDto>;
  readonly ingredients: ReadonlyArray<IngredientCreateDto>;
  readonly description: string;
}

export type IngredientCreateDto = Omit<QuantifiableItemGetDto, "id">;

export interface TagCreateDto {
  readonly name: string;
}

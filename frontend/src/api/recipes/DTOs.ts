import { CategoryGetDto } from "api/categories/DTOs";
import { QuantifiableItemGetDto } from "api/common-DTOs";
import { TagGetDto, TagCreateDto } from "api/tags/DTOs";

export interface GetRecipesResponseDto {
  readonly nextPage: string | null;
  readonly recipes: readonly RecipeGetDto[];
}

export interface RecipeGetDto {
  readonly id: number;
  readonly name: string;
  readonly category: CategoryGetDto;
  readonly tags: readonly TagGetDto[];
  readonly imageSrc?: string;
  readonly creationDate: string;
  readonly updateDate: string;
}

export interface RecipeDetailsGetDto extends RecipeGetDto {
  readonly ingredients: readonly QuantifiableItemGetDto[];
  readonly description: string;
}

export interface RecipeCreateDto {
  readonly name: string;
  readonly categoryId: number;
  readonly image: Blob | null;
  readonly tagIds: ReadonlyArray<number>;
  readonly newTags: ReadonlyArray<TagCreateDto>;
  readonly ingredients: ReadonlyArray<IngredientCreateDto>;
  readonly description: string;
}

export type IngredientCreateDto = Omit<QuantifiableItemGetDto, "id">;

export interface TagGetDto {
  readonly id: number;
  readonly name: string;
}

export interface CategoryGetDto {
  readonly id: number;
  readonly name: string;
  readonly color: string;
  readonly symbol: string;
}

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

export type QuantifiableItemGetDto = {
  readonly id: number;
  readonly name: string;
  readonly amount: Amount;
  readonly checked: boolean;
};

export interface Amount {
  readonly value: string | null;
  readonly unit: string | null;
}

export interface ShoppingListGetDto {
  readonly id: number;
  readonly name: string;
  readonly autoDelete: boolean;
  readonly creationDate: string;
  readonly updateDate: string;
}

export interface ShoppingListDetailsGetDto extends ShoppingListGetDto {
  readonly sublists: readonly ShoppingListSublistGetDto[];
}

export interface ShoppingListSublistGetDto {
  readonly id: number;
  readonly name: string;
  readonly recipeId: number | null;
  readonly count: number;
  readonly items: readonly QuantifiableItemGetDto[];
}

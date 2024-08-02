export interface TagGetDto {
  readonly id: number;
  readonly name: string;
}

export interface CategoryGetDto {
  readonly id: number;
  readonly name: string;
  readonly color: string;
}

export interface RecipeGetDto {
  readonly id: number;
  readonly name: string; // TODO: Devise a proper character limit
  readonly category: CategoryGetDto;
  readonly tags: readonly TagGetDto[];
  readonly imageSrc?: string;
}

export interface RecipeDetailsGetDto extends RecipeGetDto {
  readonly ingredients: readonly IngredientGetDto[];
  readonly description: string;
}

export type IngredientGetDto = {
  readonly id: number;
  readonly name: string;
  readonly amount: Amount;
};

export interface Amount {
  readonly value: string;
  readonly unit: string | null;
}

export interface ShoppingListGetDto {
  readonly id: number;
  readonly name: string;
  readonly creationDate: string;
  readonly updateDate: string;
  readonly sublists?: readonly ShoppingListSublistGetDto[];
}

export interface ShoppingListSublistGetDto {
  readonly id: number;
  readonly name: string;
  readonly recipeId?: number;
  readonly count: number;
  readonly items: readonly ShoppingItemGetDto[];
}

export interface ShoppingItemGetDto extends IngredientGetDto {
  readonly checked: boolean;
}

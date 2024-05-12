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
  readonly title: string;
  readonly description: string;
  readonly category: CategoryGetDto;
  readonly tags: TagGetDto[];
  readonly imageSrc?: string;
}

export interface RecipeDetailsGetDto extends RecipeGetDto {
  readonly ingredients: IngredientGetDto[];
  readonly text: string;
}

export interface IngredientGetDto {
  readonly id: number;
  readonly name: string;
  readonly amount: Amount;
}

export interface Amount {
  readonly value: string;
  readonly unit: string | null;
}

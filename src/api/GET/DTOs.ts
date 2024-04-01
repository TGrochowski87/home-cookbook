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
  readonly amount: Amount;
}

export type Amount = ConcreteAmount | ImpreciseAmount;

export interface ConcreteAmount {
  readonly value: number;
  readonly unit: string;
}

export interface ImpreciseAmount {
  readonly value: string;
}

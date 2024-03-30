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
}

import { QuantifiableItemGetDto, Amount } from "api/common-DTOs";

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

export interface ShoppingListUpdateDto {
  readonly name: string;
  readonly autoDelete: boolean;
  readonly sublists: readonly ShoppingSublistUpdateDto[];
}

export interface ShoppingSublistUpdateDto {
  readonly id: number;
  readonly name: string;
  readonly count: number;
  readonly items: readonly ShoppingListItemUpdateDto[];
}

export interface ShoppingListItemUpdateDto {
  readonly id?: number;
  readonly name: string;
  readonly amount: Amount;
  readonly checked: boolean;
}

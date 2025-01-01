import { Amount } from "api/GET/DTOs";

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

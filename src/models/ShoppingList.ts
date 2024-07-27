import QuantifiableItemData from "models/QuantifiableItemData";

export interface ShoppingList {
  readonly id: number;
  readonly name: string;
  readonly creationDate: string;
  readonly updateDate: string;
  readonly sublists?: readonly ShoppingListSublist[];
}

export interface ShoppingListSublist {
  readonly id: number;
  readonly name: string;
  readonly recipeId?: number;
  readonly count: number;
  readonly items: readonly QuantifiableItemData[];
}

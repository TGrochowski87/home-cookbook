import QuantifiableItemData from "models/QuantifiableItemData";

export type ShoppingList = {
  readonly id: number;
  readonly name: string;
  readonly autoDelete: boolean;
  readonly creationDate: string;
  readonly updateDate: string;
  readonly sublists: readonly ShoppingListSublist[];
};

export interface ShoppingListSublist {
  readonly id: number;
  readonly name: string;
  readonly recipeId: number | null;
  readonly count: number;
  readonly items: readonly QuantifiableItemData[];
}

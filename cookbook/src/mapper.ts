import { ShoppingItemGetDto, ShoppingListGetDto, ShoppingListSublistGetDto } from "api/GET/DTOs";
import QuantifiableItemData from "models/QuantifiableItemData";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";

const toShoppingItem = (from: ShoppingItemGetDto): QuantifiableItemData => {
  return {
    ...from,
    key: from.id,
  };
};

const toShoppingListSublist = (from: ShoppingListSublistGetDto): ShoppingListSublist => {
  return {
    ...from,
    items: from.items.map(toShoppingItem),
  };
};

const toShoppingList = (from: ShoppingListGetDto): ShoppingList => {
  return {
    ...from,
    sublists: from.sublists?.map(toShoppingListSublist),
  };
};

const mapper = {
  map: {
    toShoppingList,
  },
};

export default mapper;

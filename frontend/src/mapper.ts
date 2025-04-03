import { QuantifiableItemGetDto } from "api/common-DTOs";
import { RecipeCreateDto } from "api/recipes/DTOs";
import {
  ShoppingListSublistGetDto,
  ShoppingListDetailsGetDto,
  ShoppingListUpdateDto,
  ShoppingSublistUpdateDto,
  ShoppingListItemUpdateDto,
} from "api/shopping-lists/DTOs";
import { RecipeData } from "components/recipe-creation-form/RecipeCreationForm";
import QuantifiableItemData from "models/QuantifiableItemData";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";

const toShoppingItem = (from: QuantifiableItemGetDto): QuantifiableItemData => {
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

const toShoppingList = (from: ShoppingListDetailsGetDto): ShoppingList => {
  return {
    ...from,
    sublists: from.sublists?.map(toShoppingListSublist),
  };
};

const toRecipeCreateDto = (from: RecipeData): RecipeCreateDto => {
  return {
    name: from.name,
    categoryId: from.categoryId!,
    image: from.image,
    tagIds: from.tags.filter(t => typeof t === "number") as number[],
    newTags: from.tags.filter(t => typeof t === "string").map(tagName => ({ name: tagName as string })),
    ingredients: from.ingredients,
    description: from.description,
  };
};

const toShoppingListUpdateDto = (from: ShoppingList): ShoppingListUpdateDto => {
  return {
    name: from.name,
    autoDelete: from.autoDelete,
    sublists: from.sublists.map(toShoppingSublistUpdateDto),
  };
};

const toShoppingSublistUpdateDto = (from: ShoppingListSublist): ShoppingSublistUpdateDto => {
  return {
    id: from.id,
    name: from.name,
    count: from.count,
    items: from.items.map(toShoppingListItemUpdateDto),
  };
};

const toShoppingListItemUpdateDto = (from: QuantifiableItemData): ShoppingListItemUpdateDto => {
  return {
    id: typeof from.key === "number" ? from.key : undefined,
    name: from.name,
    amount: from.amount,
    checked: from.checked,
  };
};

const mapper = {
  map: {
    toShoppingList,
    toRecipeCreateDto,
    toShoppingListUpdateDto,
  },
};

export default mapper;

import { BaseUrl } from "api/api";
import axios from "axios";
import dbData from "db/data";

export const deleteShoppingList = async (listId: number, resourceStateTimestamp: string): Promise<void> => {
  const list = dbData.shoppingLists.find(l => l.id === listId);
  if (list === undefined) {
    throw new Error("List not found");
  }

  dbData.shoppingLists = dbData.shoppingLists.filter(l => l.id !== listId);
  return Promise.resolve();
};

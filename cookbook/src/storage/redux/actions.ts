import { categoriesActions } from "./slices/categoriesSlice";
import { shoppingListsActions } from "./slices/shoppingListsSlice";
import { tagsActions } from "./slices/tagsSlice";

const storeActions = {
  shoppingLists: shoppingListsActions,
  categories: categoriesActions,
  tags: tagsActions,
};

export default storeActions;

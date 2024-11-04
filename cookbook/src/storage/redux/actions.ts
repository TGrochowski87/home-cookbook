import { categoriesActions } from "./slices/categoriesSlice";
import { recipesActions } from "./slices/recipesSlice";
import { shoppingListsActions } from "./slices/shoppingListsSlice";
import { tagsActions } from "./slices/tagsSlice";

const storeActions = {
  shoppingLists: shoppingListsActions,
  categories: categoriesActions,
  tags: tagsActions,
  recipes: recipesActions,
};

export default storeActions;

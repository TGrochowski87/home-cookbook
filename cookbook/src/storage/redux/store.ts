import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./slices/categoriesSlice";
import tagsSlice from "./slices/tagsSlice";
import shoppingListsSlice from "./slices/shoppingListsSlice";

const store = configureStore({
  reducer: {
    categories: categoriesSlice,
    tags: tagsSlice,
    shoppingLists: shoppingListsSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;

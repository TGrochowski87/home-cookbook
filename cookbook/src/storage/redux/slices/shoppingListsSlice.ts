// Probably cache a list of shopping lists and always get a specific one.
// Once some shopping list gets updated, override the data only for this one.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import { RootState } from "../store";

interface State {
  shoppingLists: ShoppingListGetDto[];
}

const initialState: State = {
  shoppingLists: [],
};

export const fetchShoppingLists = createAsyncThunk("shoppingLists/fetchShoppingLists", async (_args, { getState }) => {
  const currentState = getState() as RootState;
  if (currentState.shoppingLists.shoppingLists.length > 0) {
    return currentState.shoppingLists.shoppingLists;
  }

  const response = await api.get.getShoppingLists();
  return response;
});

export const shoppingListsSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    updateCachedShoppingList(state, action: PayloadAction<{ id: number; newData: ShoppingListGetDto }>) {
      const { id, newData } = action.payload;
      const index = state.shoppingLists.findIndex(list => list.id === id);
      if (index !== -1) {
        state.shoppingLists[index] = newData;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchShoppingLists.fulfilled, (state, action: PayloadAction<ShoppingListGetDto[]>) => {
      state.shoppingLists = action.payload;
    });
  },
});

export const { updateCachedShoppingList } = shoppingListsSlice.actions;

export default shoppingListsSlice.reducer;

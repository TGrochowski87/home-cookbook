import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShoppingListDetailsGetDto, ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import { RootState } from "../store";
import { DeepWriteable, WithOptional } from "utilities/types";

/**
 * We first get all shopping lists without sublists. They get filled lazily.
 */
interface State {
  shoppingLists: WithOptional<ShoppingListDetailsGetDto, "sublists">[];
}

const initialState: State = {
  shoppingLists: [],
};

/**
 * We get all shopping lists once. Expired ones get filtered out by API on GET call.
 * This should work fine as we update the storage on shopping list update/create.
 */
export const fetchShoppingLists = createAsyncThunk("shoppingLists/fetchShoppingLists", async (_args, { getState }) => {
  const currentState = getState() as RootState;
  if (currentState.shoppingLists.shoppingLists.length > 0) {
    return currentState.shoppingLists.shoppingLists;
  }

  const response = await api.get.getShoppingLists();
  return response;
});

/**
 * Fill shopping list's sublists.
 */
export const fetchShoppingListDetails = createAsyncThunk<
  ShoppingListDetailsGetDto,
  { id: number; forceUpdate?: boolean }
>("shoppingLists/fetchShoppingListDetails", async ({ id, forceUpdate = false }, { getState }) => {
  const currentState = getState() as RootState;
  const shoppingListInCache = currentState.shoppingLists.shoppingLists.find(sh => sh.id === id);
  if (shoppingListInCache === undefined) {
    throw Error("Shopping list was not found in storage.");
  }

  if (shoppingListInCache.sublists && forceUpdate === false) {
    return shoppingListInCache as ShoppingListDetailsGetDto;
  }

  const response = await api.get.getShoppingList(id);
  return response;
});

export const shoppingListsSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    /**
     * Update cached sublist after edit.
     */
    updateCachedShoppingList(state, action: PayloadAction<ShoppingListDetailsGetDto>) {
      const writablePayload = action.payload as DeepWriteable<ShoppingListDetailsGetDto>;
      state.shoppingLists = state.shoppingLists.map(sl => (sl.id === writablePayload.id ? writablePayload : sl));

      const index = state.shoppingLists.findIndex();
    },
    addShoppingList(state, action: PayloadAction<ShoppingListDetailsGetDto>) {
      const writablePayload = action.payload as DeepWriteable<ShoppingListDetailsGetDto>;
      state.shoppingLists.unshift(writablePayload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchShoppingLists.fulfilled, (state, action: PayloadAction<ShoppingListGetDto[]>) => {
        state.shoppingLists = action.payload;
      })
      .addCase(fetchShoppingListDetails.fulfilled, (state, action: PayloadAction<ShoppingListDetailsGetDto>) => {
        const writablePayload = action.payload as DeepWriteable<ShoppingListDetailsGetDto>;
        state.shoppingLists = state.shoppingLists.map(sl => (sl.id === writablePayload.id ? writablePayload : sl));
      });
  },
});

export const { updateCachedShoppingList, addShoppingList } = shoppingListsSlice.actions;

export default shoppingListsSlice.reducer;

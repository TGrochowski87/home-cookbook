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
const fetchShoppingLists = createAsyncThunk(
  "shoppingLists/fetchShoppingLists",
  async (_args, { getState, rejectWithValue }) => {
    const currentState = getState() as RootState;
    if (currentState.shoppingLists.shoppingLists.length > 0) {
      return currentState.shoppingLists.shoppingLists;
    }

    try {
      return await api.get.getShoppingLists();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * To be used for filling shopping list data. Does not perform any reordering.
 */
const fetchShoppingListDetails = createAsyncThunk(
  "shoppingLists/fetchShoppingListDetails",
  async (id: number, { getState, rejectWithValue }) => {
    const currentState = getState() as RootState;
    const shoppingListInCache = currentState.shoppingLists.shoppingLists.find(sh => sh.id === id);
    if (shoppingListInCache === undefined) {
      throw Error("Shopping list was not found in storage.");
    }
    if (shoppingListInCache.sublists) {
      return null;
    }

    try {
      return await api.get.getShoppingList(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const shoppingListsSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    /**
     * Update cached sublist after edit.
     */
    updateCachedShoppingList(state, action: PayloadAction<ShoppingListDetailsGetDto>) {
      const writablePayload = action.payload as DeepWriteable<ShoppingListDetailsGetDto>;
      const index = state.shoppingLists.findIndex(sl => sl.id === writablePayload.id);
      if (index === -1) {
        throw Error("Shopping list was not found in storage.");
      }

      // Insert to the front as we sort by update date.
      state.shoppingLists.splice(index, 1);
      state.shoppingLists.unshift(writablePayload);
    },
    addShoppingList(state, action: PayloadAction<ShoppingListDetailsGetDto>) {
      const writablePayload = action.payload as DeepWriteable<ShoppingListDetailsGetDto>;

      // Insert to the front as we sort by update date.
      state.shoppingLists.unshift(writablePayload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchShoppingLists.fulfilled, (state, action: PayloadAction<ShoppingListGetDto[]>) => {
        state.shoppingLists = action.payload;
      })
      .addCase(fetchShoppingListDetails.fulfilled, (state, action: PayloadAction<ShoppingListDetailsGetDto | null>) => {
        if (action.payload === null) {
          return;
        }

        const writablePayload = action.payload as DeepWriteable<ShoppingListDetailsGetDto>;
        state.shoppingLists = state.shoppingLists.map(sl => (sl.id === writablePayload.id ? writablePayload : sl));
      });
  },
});

export const shoppingListsActions = {
  ...shoppingListsSlice.actions,
  async: {
    fetchShoppingLists,
    fetchShoppingListDetails,
  },
};

export default shoppingListsSlice.reducer;

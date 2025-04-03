import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "api/api";
import { DeepWriteable } from "utilities/types";
import { RecipeDetailsGetDto } from "api/recipes/DTOs";

interface State {
  recipes: Record<number, RecipeDetailsGetDto>;
}

const initialState: State = {
  recipes: {},
};

const fetchRecipe = createAsyncThunk("recipes/fetchRecipe", async (id: number, { getState, rejectWithValue }) => {
  const currentState = getState() as RootState;
  if (currentState.recipes.recipes[id] !== undefined) {
    return null;
  }

  try {
    return await api.recipes.getRecipe(id);
  } catch (error) {
    // Without this, redux swallows the original error and returns barely any information.
    return rejectWithValue(error);
  }
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipeInCache(state, action: PayloadAction<RecipeDetailsGetDto>) {
      const writablePayload = action.payload as DeepWriteable<RecipeDetailsGetDto>;

      // Override or create new.
      state.recipes[action.payload.id] = writablePayload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRecipe.fulfilled, (state, action: PayloadAction<RecipeDetailsGetDto | null>) => {
      if (action.payload === null) {
        return;
      }

      const writablePayload = action.payload as DeepWriteable<RecipeDetailsGetDto>;
      state.recipes[writablePayload.id] = writablePayload;
    });
  },
});

export const recipesActions = {
  ...recipesSlice.actions,
  async: {
    fetchRecipe,
  },
};

export default recipesSlice.reducer;

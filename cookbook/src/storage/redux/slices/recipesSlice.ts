import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RecipeDetailsGetDto } from "api/GET/DTOs";
import { RootState } from "../store";
import api from "api/api";
import { DeepWriteable } from "utilities/types";

interface State {
  recipes: Record<number, RecipeDetailsGetDto>;
}

const initialState: State = {
  recipes: {},
};

const fetchRecipe = createAsyncThunk("recipes/fetchRecipe", async (id: number, { getState }) => {
  const currentState = getState() as RootState;
  if (currentState.recipes.recipes[id] !== undefined) {
    return null;
  }

  // TODO: Handle 404.
  const response = await api.get.getRecipe(id);
  return response;
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

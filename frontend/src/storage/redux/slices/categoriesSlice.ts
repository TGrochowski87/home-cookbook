import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "api/api";
import { RootState } from "../store";
import { CategoryGetDto } from "api/categories/DTOs";

interface State {
  categories: CategoryGetDto[];
}

const initialState: State = {
  categories: [],
};

const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_args, { getState, rejectWithValue }) => {
  const currentState = getState() as RootState;
  if (currentState.categories.categories.length > 0) {
    return currentState.categories.categories;
  }

  try {
    return await api.categories.getCategories();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryGetDto[]>) => {
      state.categories = action.payload;
    });
  },
});

export const categoriesActions = {
  ...categoriesSlice.actions,
  async: {
    fetchCategories,
  },
};

export default categoriesSlice.reducer;

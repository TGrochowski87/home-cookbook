import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryGetDto } from "api/GET/DTOs";
import api from "api/api";
import { RootState } from "../store";

interface State {
  categories: CategoryGetDto[];
}

const initialState: State = {
  categories: [],
};

const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_args, { getState }) => {
  const currentState = getState() as RootState;
  if (currentState.categories.categories.length > 0) {
    return currentState.categories.categories;
  }

  const response = await api.get.getCategories();
  return response;
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

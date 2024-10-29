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

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_args, { getState }) => {
  const currentState = getState() as RootState;
  if (currentState.categories.categories.length > 0) {
    return initialState.categories;
  }

  const response = await api.get.getCategories();
  return response;
});

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryGetDto[]>) => {
      state.categories = action.payload;
    });
  },
});

export default categoriesSlice.reducer;

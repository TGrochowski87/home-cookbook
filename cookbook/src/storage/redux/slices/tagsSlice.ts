import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TagGetDto } from "api/GET/DTOs";
import api from "api/api";
import { RootState } from "../store";

interface State {
  tags: TagGetDto[];
}

const initialState: State = {
  tags: [],
};

export const fetchTags = createAsyncThunk("tags/fetchTags", async (_args, { getState }) => {
  const currentState = getState() as RootState;
  if (currentState.tags.tags.length > 0) {
    return initialState.tags;
  }

  const response = await api.get.getTags();
  return response;
});

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTags.fulfilled, (state, action: PayloadAction<TagGetDto[]>) => {
      state.tags = action.payload;
    });
  },
});

export default tagsSlice.reducer;

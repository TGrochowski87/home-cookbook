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

const fetchTags = createAsyncThunk("tags/fetchTags", async (_args, { getState, rejectWithValue }) => {
  const currentState = getState() as RootState;
  if (currentState.tags.tags.length > 0) {
    return currentState.tags.tags;
  }

  try {
    return await api.get.getTags();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    invalidateTags: state => {
      state.tags = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTags.fulfilled, (state, action: PayloadAction<TagGetDto[]>) => {
      state.tags = action.payload;
    });
  },
});

export const tagsActions = {
  ...tagsSlice.actions,
  async: {
    fetchTags,
  },
};

export default tagsSlice.reducer;

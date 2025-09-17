import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FiltersState = {
  q: string;
  category: string | null;
  sort: string | null;
};

const initialState: FiltersState = {
  q: "",
  category: null,
  sort: null,
};

const slice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.q = action.payload;
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },
    setSort: (state, action: PayloadAction<string | null>) => {
      state.sort = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setQuery, setCategory, setSort, resetFilters } = slice.actions;
export default slice.reducer;

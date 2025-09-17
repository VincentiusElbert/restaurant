import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FiltersState = {
  search: string;
  category: string | null;
  sort: "price-asc" | "price-desc" | "name-asc" | "name-desc" | null;
};

const initialState: FiltersState = {
  search: "",
  category: null,
  sort: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<"price-asc" | "price-desc" | "name-asc" | "name-desc" | null>
    ) => {
      state.sort = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setSearch, setCategory, setSort, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

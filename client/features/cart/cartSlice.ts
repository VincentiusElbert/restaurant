import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";

export type CartState = { items: CartItem[] };

const initialState: CartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const found = state.items.find((i) => i.id === action.payload.id);
      if (found) found.qty += action.payload.qty;
      else state.items.push({ ...action.payload });
    },
    updateQty: (
      state,
      action: PayloadAction<{ id: CartItem["id"]; qty: number }>,
    ) => {
      const it = state.items.find((i) => i.id === action.payload.id);
      if (it) it.qty = Math.max(1, action.payload.qty);
    },
    removeFromCart: (state, action: PayloadAction<CartItem["id"]>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, updateQty, removeFromCart, clearCart, setCart } =
  slice.actions;
export default slice.reducer;

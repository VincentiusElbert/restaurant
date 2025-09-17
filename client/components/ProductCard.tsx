import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToCart,
  updateQty,
  removeFromCart,
} from "@/features/cart/cartSlice";
import { useCartMutations } from "@/services/queries/resto";

export default function ProductCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}) {
  const items = useAppSelector((s) => s.cart.items);
  const found = items.find((it) => it.id === item.id);
  const dispatch = useAppDispatch();
  const { add, update, remove } = useCartMutations();

  function handleAdd() {
    if (onAdd) return onAdd(item);
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        image: item.image,
        restaurantId: item.restaurantId,
      }),
    );
    if (localStorage.getItem("auth_token"))
      add.mutate({ menuId: item.id, quantity: 1 });
  }

  function setQty(next: number) {
    if (next <= 0) {
      dispatch(removeFromCart(item.id));
      if (localStorage.getItem("auth_token")) remove.mutate(item.id);
      return;
    }
    dispatch(updateQty({ id: item.id, qty: next }));
    if (localStorage.getItem("auth_token"))
      update.mutate({ id: item.id, quantity: next });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        className="h-36 w-full object-cover"
      />
      <div className="p-3 space-y-1">
        <div className="font-medium line-clamp-1">{item.name}</div>
        <div className="text-sm text-muted-foreground">
          {formatCurrency(item.price)}
        </div>
        {!found ? (
          <Button className="w-full mt-2" onClick={handleAdd}>
            Add
          </Button>
        ) : (
          <div className="mt-2 flex items-center justify-between border rounded-full px-2 h-10">
            <button
              className="h-8 w-8 flex items-center justify-center"
              aria-label="decrease"
              onClick={() => setQty(found.qty - 1)}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center font-semibold">
              {found.qty}
            </span>
            <button
              className="h-8 w-8 flex items-center justify-center"
              aria-label="increase"
              onClick={() => setQty(found.qty + 1)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

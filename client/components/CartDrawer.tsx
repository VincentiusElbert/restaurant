import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateQty, removeFromCart } from "@/features/cart/cartSlice";
import { formatCurrency } from "@/lib/format";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useCartMutations } from "@/services/queries/resto";

export default function CartDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const total = useMemo(
    () => items.reduce((a, b) => a + b.price * b.qty, 0),
    [items],
  );
  const [open, setOpen] = useState(false);
  const { update, remove } = useCartMutations();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3 overflow-auto h-[70vh] pr-2">
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Your cart is empty.
            </div>
          )}
          {items.map((it) => (
            <div
              key={it.id}
              className="flex gap-3 items-center border rounded-md p-2"
            >
              <img
                src={it.image || "/placeholder.svg"}
                alt={it.name}
                className="h-16 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{it.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(it.price)} × {it.qty}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const next = Math.max(1, it.qty - 1);
                      dispatch(updateQty({ id: it.id, qty: next }));
                      if (localStorage.getItem("auth_token"))
                        update.mutate({ id: it.id, quantity: next });
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-6 text-center">{it.qty}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const next = it.qty + 1;
                      dispatch(updateQty({ id: it.id, qty: next }));
                      if (localStorage.getItem("auth_token"))
                        update.mutate({ id: it.id, quantity: next });
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="ml-auto"
                    onClick={() => {
                      dispatch(removeFromCart(it.id));
                      if (localStorage.getItem("auth_token"))
                        remove.mutate(it.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex items-center justify-between">
          <div className="font-semibold">Total</div>
          <div className="font-bold">{formatCurrency(total)}</div>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            to="/checkout"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <Button className="w-full" disabled={items.length === 0}>
              Checkout
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

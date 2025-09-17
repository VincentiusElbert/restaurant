import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateQty, removeFromCart, clearCart } from "@/features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function CartDrawer({ onClose }: { onClose?: () => void }) {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Keranjang kosong.</p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex gap-3 items-center">
              <img src={it.imageUrl || "/placeholder.svg"} alt={it.name} className="size-14 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{it.name}</div>
                <div className="text-sm text-muted-foreground">Rp {it.price.toLocaleString("id-ID")}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => dispatch(updateQty({ id: it.id, qty: it.qty - 1 }))}>-</Button>
                <Input className="w-14 text-center" value={it.qty} onChange={(e)=>dispatch(updateQty({id:it.id, qty:Number(e.target.value)||1}))} />
                <Button size="icon" onClick={() => dispatch(updateQty({ id: it.id, qty: it.qty + 1 }))}>+</Button>
              </div>
              <Button variant="ghost" onClick={() => dispatch(removeFromCart(it.id))}>Hapus</Button>
            </div>
          ))
        )}
      </div>
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => dispatch(clearCart())}>
            Bersihkan
          </Button>
          <Button asChild className="flex-1" onClick={onClose} disabled={items.length===0}>
            <Link to="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearCart } from "@/features/cart/cartSlice";
import { formatCurrency } from "@/lib/format";
import dayjs from "dayjs";
import type { Order } from "@/types";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Button as UIButton } from "@/components/ui/button";
import { createOrder } from "@/services/api/orders";

export default function Checkout() {
  const items = useAppSelector((s) => s.cart.items);
  const total = items.reduce((a, b) => a + b.price * b.qty, 0);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  async function saveOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customerName = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const address = String(form.get("address") || "");

    const order: any = {
      id: crypto.randomUUID(),
      items,
      total,
      customerName,
      phone,
      address,
      createdAt: dayjs().toISOString(),
      status: "preparing",
    };

    try {
      const saved = await createOrder(order);
      dispatch(clearCart());
      nav(`/success?orderId=${encodeURIComponent(saved.id || order.id)}`);
    } catch (err) {
      console.error(err);
      // fallback local
      const prev = JSON.parse(localStorage.getItem("orders") || "[]");
      prev.unshift(order);
      localStorage.setItem("orders", JSON.stringify(prev));
      dispatch(clearCart());
      nav(`/success?orderId=${encodeURIComponent(order.id)}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenCart={() => {}} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-8">
          <form className="space-y-4" onSubmit={saveOrder}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required />
            </div>
            <Button type="submit" disabled={items.length === 0}>
              Place Order
            </Button>
          </form>
          <aside className="bg-white rounded-xl border p-4 h-fit">
            <div className="font-semibold mb-2">Order Summary</div>
            <ul className="space-y-2">
              {items.map((it) => (
                <li
                  key={String(it.id)}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span>{formatCurrency(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <div className="fixed bottom-5 right-5">
        <CartDrawer>
          <UIButton>Open Cart</UIButton>
        </CartDrawer>
      </div>
    </div>
  );
}

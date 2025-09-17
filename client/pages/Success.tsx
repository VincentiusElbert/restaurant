import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getOrder } from "@/services/api/orders";
import { formatCurrency } from "@/lib/format";

export default function Success() {
  const nav = useNavigate();
  const loc = useLocation();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const sp = new URLSearchParams(loc.search);
    const id = sp.get("orderId");
    async function load() {
      if (id) {
        try {
          const o = await getOrder(id);
          setOrder(o);
          return;
        } catch {}
      }
      const local = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrder(local[0] || null);
    }
    load();
  }, [loc.search]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar onOpenCart={() => {}} />
      <main className="flex-1">
        <div className="max-w-xl mx-auto px-4 py-16">
          <div className="text-center mb-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F462b12e4225140b88803a67447d747f3?format=webp&width=200"
              className="h-10 inline-block"
            />
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <span className="text-green-600 text-3xl">✓</span>
              </div>
              <div className="text-2xl font-extrabold">Payment Success</div>
              <div className="text-sm text-muted-foreground">
                Your payment has been successfully processed.
              </div>
            </div>
            <div className="my-4 border-t border-dashed" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-semibold">
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold">Bank Rakyat Indonesia</span>
              </div>
              <div className="flex justify-between">
                <span>Price ({order?.items?.length ?? 0} items)</span>
                <span className="font-semibold">
                  {formatCurrency(order?.total ?? 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold">{formatCurrency(10000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="font-semibold">{formatCurrency(1000)}</span>
              </div>
            </div>
            <div className="my-4 border-t border-dashed" />
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <span className="font-extrabold">
                {formatCurrency((order?.total ?? 0) + 11000)}
              </span>
            </div>
            <button
              onClick={() => nav("/orders")}
              className="mt-4 w-full rounded-full bg-red-600 text-white py-2 font-semibold"
            >
              See My Orders
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

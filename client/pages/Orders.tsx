import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";
import { listOrders, updateOrder } from "@/services/api/orders";
import { createReview } from "@/services/api/reviews";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("done");
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const data = await listOrders();
        setOrders(data);
      } catch {
        const local = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(local);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return orders
      .filter((o) => (status ? (o.status || "done") === status : true))
      .filter((o) =>
        term
          ? o.items?.some((it: any) =>
              String(it.name).toLowerCase().includes(term),
            )
          : true,
      );
  }, [orders, q, status]);

  async function submitReview() {
    if (!reviewOrder) return;
    await createReview({ orderId: reviewOrder.id, rating, comment });
    await updateOrder(reviewOrder.id, { status: "done" });
    setOrders((prev) =>
      prev.map((o) => (o.id === reviewOrder.id ? { ...o, status: "done" } : o)),
    );
    setReviewOrder(null);
    setRating(4);
    setComment("");
  }

  const statuses: { key: string; label: string }[] = [
    { key: "preparing", label: "Preparing" },
    { key: "on_the_way", label: "On the Way" },
    { key: "delivered", label: "Delivered" },
    { key: "done", label: "Done" },
    { key: "canceled", label: "Canceled" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenCart={() => {}} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="relative mb-4">
              <input
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full h-11 rounded-full border px-4"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <b className="mr-2">Status</b>
              {statuses.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatus(s.key)}
                  className={`rounded-full border px-4 h-10 ${status === s.key ? "bg-red-50 border-red-600 text-red-600" : ""}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-muted-foreground">No orders.</div>
          )}

          <div className="grid gap-4">
            {filtered.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>{dayjs(o.createdAt).format("DD MMM YYYY, HH:mm")}</div>
                  <div className="font-semibold">{formatCurrency(o.total)}</div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src="/placeholder.svg"
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-sm">Food Name</div>
                    <div className="font-semibold">
                      {o.items?.[0]?.qty ?? 0} ×{" "}
                      {formatCurrency(o.items?.[0]?.price ?? 0)}
                    </div>
                  </div>
                </div>
                <div className="border-t my-3" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-xl font-extrabold">
                      {formatCurrency(o.total)}
                    </div>
                  </div>
                  <Dialog
                    open={reviewOrder?.id === o.id}
                    onOpenChange={(open) => setReviewOrder(open ? o : null)}
                  >
                    <DialogTrigger asChild>
                      <Button className="rounded-full bg-red-600">
                        Give Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Give Review</DialogTitle>
                      </DialogHeader>
                      <div className="text-center font-semibold">
                        Give Rating
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setRating(n)}
                            aria-label={`rate ${n}`}
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill={n <= rating ? "#F59E0B" : "none"}
                              stroke="#F59E0B"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Please share your thoughts about our service!"
                        className="w-full h-40 border rounded-xl p-3"
                      />
                      <Button
                        onClick={submitReview}
                        className="w-full rounded-full bg-red-600"
                      >
                        Send
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

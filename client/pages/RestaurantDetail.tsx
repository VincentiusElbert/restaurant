import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRestaurantDetailQuery } from "@/services/queries/resto";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import ReviewModal from "@/components/ReviewModal";
import ProductCard from "@/components/ProductCard";
import { useAppSelector } from "@/store";
import { Star, Share2 } from "lucide-react";

export default function RestaurantDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useRestaurantDetailQuery(id);
  const [tab, setTab] = useState<"all" | "Food" | "Drink">("all");
  const [showReview, setShowReview] = useState(false);
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useMemo(
    () => items.reduce((a, b) => a + b.price * b.qty, 0),
    [items],
  );

  const menus = useMemo(() => {
    const list = (data?.menus ?? []) as any[];
    if (tab === "all") return list;
    return list.filter(
      (m) => (m.category || "").toLowerCase() === tab.toLowerCase(),
    );
  }, [data, tab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenCart={() => nav("/checkout")} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {isLoading && (
            <div className="space-y-4">
              <div className="h-72 bg-muted/30 rounded-2xl animate-pulse" />
              <div className="h-24 bg-muted/30 rounded-xl animate-pulse" />
            </div>
          )}

          {!!data && (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <img
                  src={
                    data.images?.[0] ||
                    data.menus?.[0]?.image ||
                    "/placeholder.svg"
                  }
                  alt={data.name}
                  className="rounded-2xl w-full h-[300px] md:h-[360px] object-cover md:col-span-2"
                />
                <div className="grid grid-rows-3 gap-4">
                  <img
                    src={
                      data.images?.[1] ||
                      data.menus?.[1]?.image ||
                      "/placeholder.svg"
                    }
                    alt="thumb1"
                    className="rounded-2xl w-full h-[110px] object-cover"
                  />
                  <img
                    src={
                      data.images?.[2] ||
                      data.menus?.[2]?.image ||
                      "/placeholder.svg"
                    }
                    alt="thumb2"
                    className="rounded-2xl w-full h-[110px] object-cover"
                  />
                  <img
                    src={
                      data.images?.[3] ||
                      data.menus?.[3]?.image ||
                      "/placeholder.svg"
                    }
                    alt="thumb3"
                    className="rounded-2xl w-full h-[110px] object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <img
                  src={data.logo || data.images?.[0] || "/placeholder.svg"}
                  className="h-20 w-20 rounded-full object-cover"
                  alt="logo"
                />
                <div className="flex-1">
                  <div className="text-2xl font-extrabold">{data.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {data.rating ?? "-"}
                    <span className="mx-1">•</span>
                    {data.city || "-"}
                  </div>
                </div>
                <Button variant="outline" className="rounded-full">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>

              <div className="border-t my-6" />

              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-extrabold mr-auto">Menu</div>
                <div
                  className={`px-4 h-10 rounded-full border ${tab === "all" ? "bg-red-50 text-red-600 border-red-600" : ""}`}
                >
                  <button className="h-10" onClick={() => setTab("all")}>
                    All Menu
                  </button>
                </div>
                <div
                  className={`px-4 h-10 rounded-full border ${tab === "Food" ? "bg-red-50 text-red-600 border-red-600" : ""}`}
                >
                  <button className="h-10" onClick={() => setTab("Food")}>
                    Food
                  </button>
                </div>
                <div
                  className={`px-4 h-10 rounded-full border ${tab === "Drink" ? "bg-red-50 text-red-600 border-red-600" : ""}`}
                >
                  <button className="h-10" onClick={() => setTab("Drink")}>
                    Drink
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {menus.map((m: any) => (
                  <ProductCard
                    key={String(m.id)}
                    item={{
                      id: m.id,
                      name: m.name,
                      price: m.price,
                      image: m.image,
                      category: m.category,
                      restaurantId: data.id,
                    }}
                  />
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline">Show More</Button>
              </div>

              <div className="border-t my-8" />

              <section className="space-y-3">
                {/* Give review modal trigger */}
                <div className="text-3xl font-extrabold">Review</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div className="font-bold">
                    {data.rating ?? "-"} ({" "}
                    {Array.isArray((data as any).reviews)
                      ? (data as any).reviews.length
                      : 0}{" "}
                    Ulasan )
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray((data as any).reviews)
                      ? (data as any).reviews.length
                      : 0}{" "}
                    reviews
                  </div>
                  <div>
                    <button
                      onClick={() => setShowReview(true)}
                      className="rounded-full bg-firebrick text-white px-4 py-2"
                    >
                      Give Review
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  {(((data as any).reviews || []) as any[]).map((rv, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white shadow-sm p-4 space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={rv.user?.avatar || "/placeholder.svg"}
                          className="h-12 w-12 rounded-full object-cover"
                          alt="avatar"
                        />
                        <div>
                          <div className="font-extrabold">
                            {rv.user?.name || "Anonymous"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(
                              rv.createdAt || Date.now(),
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.round(rv.rating || 0) }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-yellow-500 fill-yellow-500"
                            />
                          ),
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rv.comment || rv.review || ""}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Button variant="outline">Show More</Button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {showReview && (
        <ReviewModal
          restaurantId={data?.id}
          onClose={() => setShowReview(false)}
        />
      )}

      <Footer />

      <div className="sticky bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              {items.length} Items
            </div>
            <div className="font-extrabold">
              Rp{new Intl.NumberFormat("id-ID").format(Math.round(subtotal))}
            </div>
          </div>
          <Link to="/checkout">
            <Button className="rounded-full px-6">Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

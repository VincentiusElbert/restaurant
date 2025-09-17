import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRestaurantsQuery } from "@/services/queries/resto";
import RestaurantCard from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";

function hashToNumber(input: string | number) {
  const s = String(input);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pseudoDistance(id: string | number) {
  const n = hashToNumber(id);
  return Math.round(((n % 500) / 100 + 0.3) * 10) / 10; // 0.3 - 5.0 km
}

export default function CategoryPage() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [nearby, setNearby] = useState<boolean>(true);

  const { data = [], isLoading } = useRestaurantsQuery();

  const filtered = useMemo(() => {
    return (data || []).filter((r) => {
      const ratingOk = (r.rating ?? 0) >= ratingMin;
      const dist = pseudoDistance(r.id);
      const distanceOk = maxDistance == null ? true : dist <= maxDistance;
      const nearbyOk = nearby ? dist <= 3 : true;
      return ratingOk && distanceOk && nearbyOk;
    });
  }, [data, ratingMin, maxDistance, nearby]);

  const FilterControls = (
    <div className="space-y-6">
      <div>
        <div className="font-extrabold text-lg mb-2">Distance</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={nearby}
              onCheckedChange={(v) => setNearby(!!v)}
            />
            <span>Nearby</span>
          </label>
          <div className="text-sm text-muted-foreground">
            Max distance: {maxDistance ?? "Any"} km
          </div>
          <Slider
            value={[maxDistance ?? 5]}
            onValueChange={(v) => setMaxDistance(v?.[0] ?? null)}
            min={1}
            max={5}
            step={0.5}
          />
        </div>
      </div>
      <div>
        <div className="font-extrabold text-lg mb-2">Rating</div>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1, 0].map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={ratingMin === v}
                onChange={() => setRatingMin(v)}
              />
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500" /> {v}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenCart={() => {}} />

      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            All Restaurant
          </h1>
          <div className="md:hidden">
            <Sheet open={showMobileFilter} onOpenChange={setShowMobileFilter}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px]">
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{FilterControls}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
          <aside className="hidden md:block bg-white rounded-xl shadow-sm p-4 sticky top-24 h-max">
            {FilterControls}
          </aside>
          <section className="space-y-4">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-muted/30 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            )}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((r) => (
                  <div key={String(r.id)} className="relative">
                    <RestaurantCard
                      data={r}
                      onClick={() => {
                        window.location.href = `/resto/${r.id}`;
                      }}
                    />
                    <div className="absolute right-3 bottom-3 text-xs bg-black/60 text-white rounded-full px-2 py-0.5">
                      {pseudoDistance(r.id)} km
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

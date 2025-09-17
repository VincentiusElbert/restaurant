import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { MenuItem } from "@/types";

export type AggregatedMenusParams = {
  q?: string;
  category?: string;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc";
  page?: number;
  pageSize?: number;
};

async function fetchRestaurants(page = 1, limit = 12, q?: string) {
  const { data } = await api.get("/api/resto", { params: { page, limit, q } });
  return data?.data?.restaurants ?? [];
}

async function fetchMenusForRestaurant(id: number) {
  const { data } = await api.get(`/api/resto/${id}`);
  const menus: any[] = data?.data?.menus ?? [];
  const resto = data?.data?.restaurant ?? data?.data ?? {};
  return menus.map((m) => ({
    id: String(m.id),
    name: m.name,
    price: Number(m.price),
    imageUrl: m.imageUrl,
    category: m.category,
    restaurantId: Number(resto.id),
    restaurantName: String(resto.name ?? ""),
  })) as MenuItem[];
}

export function useAggregatedMenusQuery(params: AggregatedMenusParams = {}) {
  const { q, category, sort, page = 1, pageSize = 12 } = params;
  return useQuery({
    queryKey: ["menus-aggregated", params],
    queryFn: async (): Promise<{ items: MenuItem[]; hasMore: boolean }> => {
      const restaurants = await fetchRestaurants(page, pageSize, q);
      const ids: number[] = restaurants.map((r: any) => Number(r.id)).filter(Boolean);
      const results = await Promise.all(ids.map((id) => fetchMenusForRestaurant(id)));
      let items = results.flat();

      if (q) {
        const qLower = q.toLowerCase();
        items = items.filter((i) =>
          i.name.toLowerCase().includes(qLower) ||
          (i.restaurantName ?? "").toLowerCase().includes(qLower)
        );
      }
      if (category) {
        items = items.filter((i) => (i.category ?? "").toLowerCase() === category.toLowerCase());
      }
      if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
      if (sort === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "name-desc") items.sort((a, b) => b.name.localeCompare(a.name));

      return { items, hasMore: restaurants.length === pageSize };
    },
    staleTime: 30_000,
  });
}

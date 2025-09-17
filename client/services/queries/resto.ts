import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";
import type { Restaurant, MenuItem } from "@/types";

export function useRestaurantsQuery(params?: {
  q?: string;
  city?: string;
  sort?: string;
}) {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: async () => {
      const res = await axios.get("/resto", { params });
      const payload = res.data?.data?.restaurants ?? res.data?.data ?? res.data;
      const list: Restaurant[] = (Array.isArray(payload) ? payload : []).map(
        (r: any) => ({
          id: r.id,
          name: r.name,
          city: r.city ?? r.place ?? null,
          distance: null,
          rating: r.rating ?? r.star ?? r.averageRating ?? null,
          images: r.images ?? [],
          logo: r.logo ?? null,
          menuCount: r.menuCount,
          priceRange: r.priceRange ?? null,
        }),
      );
      return list;
    },
    staleTime: 60_000,
  });
}

export function useRestaurantDetailQuery(id?: string | number) {
  return useQuery({
    enabled: !!id,
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await axios.get(`/resto/${id}`);
      const d = res.data?.data ?? res.data;
      const normalizedMenus: MenuItem[] = (d?.menus ?? []).map((m: any) => ({
        id: m.id,
        name: m.foodName ?? m.name,
        price: m.price,
        image: m.image,
        category: m.type ?? m.category,
        restaurantId: d.id,
      }));
      const reviews = (d?.reviews ?? []).map((r: any) => ({
        id: r.id,
        rating: r.rating ?? r.star ?? null,
        comment: r.comment ?? r.review ?? "",
        createdAt: r.createdAt ?? r.date ?? new Date().toISOString(),
        user: r.user ?? r.author ?? null,
      }));
      return { ...d, menus: normalizedMenus, reviews } as any;
    },
    staleTime: 60_000,
  });
}

// Optional server cart syncing (requires auth token)
export function useCartMutations() {
  const qc = useQueryClient();
  const add = useMutation({
    mutationFn: async (payload: {
      menuId: number | string;
      quantity: number;
    }) => {
      const { data } = await axios.post("/cart", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const update = useMutation({
    mutationFn: async (payload: { id: number | string; quantity: number }) => {
      const { data } = await axios.put(`/cart/${payload.id}`, {
        quantity: payload.quantity,
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await axios.delete(`/cart/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
  return { add, update, remove };
}

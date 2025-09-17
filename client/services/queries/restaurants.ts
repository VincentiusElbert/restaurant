import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export type RestaurantsParams = {
  page?: number;
  limit?: number;
  q?: string;
};

export function useRestaurantsQuery(params: RestaurantsParams = {}) {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: async () => {
      const { data } = await api.get("/api/resto", { params });
      return data as {
        success: boolean;
        data: { restaurants: any[]; pagination: any };
      };
    },
    staleTime: 60_000,
  });
}

export function useRestaurantQuery(id?: number | string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/resto/${id}`);
      return data as any;
    },
    staleTime: 60_000,
  });
}

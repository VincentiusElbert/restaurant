import { localAxios } from "./axios";

export async function createReview(payload: {
  orderId: string;
  restaurantId?: string | number;
  rating: number;
  comment: string;
}) {
  const { data } = await localAxios.post("/dummy/reviews", payload);
  return data?.data ?? data;
}

export async function listReviews(orderId?: string) {
  const { data } = await localAxios.get("/dummy/reviews", {
    params: { orderId },
  });
  return data?.data ?? data;
}

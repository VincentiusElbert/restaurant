import { localAxios } from "./axios";

export type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "canceled";

export async function listOrders() {
  const { data } = await localAxios.get("/dummy/orders");
  return data?.data ?? [];
}

export async function getOrder(id: string) {
  const { data } = await localAxios.get(`/dummy/orders/${id}`);
  return data?.data ?? null;
}

export async function createOrder(payload: any) {
  const { data } = await localAxios.post("/dummy/orders", payload);
  return data?.data ?? data;
}

export async function updateOrder(
  id: string,
  payload: Partial<{ status: OrderStatus }>,
) {
  const { data } = await localAxios.put(`/dummy/orders/${id}`, payload);
  return data?.data ?? data;
}

export async function deleteOrder(id: string) {
  const { data } = await localAxios.delete(`/dummy/orders/${id}`);
  return data?.data ?? data;
}

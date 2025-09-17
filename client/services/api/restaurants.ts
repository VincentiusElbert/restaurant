import { localAxios } from "./axios";

export async function createRestaurant(payload: any) {
  const { data } = await localAxios.post(`/dummy/restaurants`, payload);
  return data;
}

export async function updateRestaurant(id: string | number, payload: any) {
  const { data } = await localAxios.put(`/dummy/restaurants/${id}`, payload);
  return data;
}

export async function deleteRestaurant(id: string | number) {
  const { data } = await localAxios.delete(`/dummy/restaurants/${id}`);
  return data;
}

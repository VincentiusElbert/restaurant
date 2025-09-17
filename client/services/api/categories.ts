import { localAxios } from "./axios";

export async function listCategories() {
  const { data } = await localAxios.get("/dummy/categories");
  return data?.data ?? data;
}

export async function createCategory(payload: any) {
  const { data } = await localAxios.post("/dummy/categories", payload);
  return data?.data ?? data;
}

export async function updateCategory(id: number | string, payload: any) {
  const { data } = await localAxios.put(`/dummy/categories/${id}`, payload);
  return data?.data ?? data;
}

export async function deleteCategory(id: number | string) {
  const { data } = await localAxios.delete(`/dummy/categories/${id}`);
  return data?.data ?? data;
}

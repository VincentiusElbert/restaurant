import Axios from "axios";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "https://berestaurantappformentee-production.up.railway.app/api";

export const axios = Axios.create({
  baseURL: API_BASE,
});

export const localAxios = Axios.create({ baseURL: "/api" });

function attachAuth(inst: any) {
  inst.interceptors.request.use((config: any) => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
}

attachAuth(axios);
attachAuth(localAxios);

export default axios;

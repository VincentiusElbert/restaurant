import axios from "./axios";

// Use direct auth endpoints relative to API base URL
export async function login(email: string, password: string) {
  const { data } = await axios.post(`/auth/login`, { email, password });
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await axios.post(`/auth/register`, {
    name,
    email,
    password,
  });
  return data;
}

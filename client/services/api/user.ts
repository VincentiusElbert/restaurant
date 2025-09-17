import axios from "./axios";

export type Profile = {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
};

export async function getProfile() {
  const { data } = await axios.get("/auth/profile");
  const d = (data?.data ?? data) as any;
  return (d.user ?? d) as Profile;
}

export async function updateProfile(payload: Partial<Profile>) {
  const { data } = await axios.put("/auth/profile", payload);
  const d = (data?.data ?? data) as any;
  return (d.user ?? d) as Profile;
}

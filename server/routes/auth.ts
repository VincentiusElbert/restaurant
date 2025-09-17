import type { RequestHandler } from "express";

const API = "https://berestaurantappformentee-production.up.railway.app";

function forwardAuth(path: string, method: string): RequestHandler {
  return async (req, res) => {
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      const auth = req.headers["authorization"];
      if (auth) headers["authorization"] = String(auth);
      const url = `${API}${path}`;
      const r = await fetch(url, {
        method,
        headers,
        body: method === "GET" ? undefined : JSON.stringify(req.body ?? {}),
      });
      const data = await r.json().catch(() => ({}));
      res.status(r.status).json(data);
    } catch (e) {
      res.status(500).json({ success: false, message: "Proxy error", error: String(e) });
    }
  };
}

export const login = forwardAuth("/api/auth/login", "POST");
export const registerUser = forwardAuth("/api/auth/register", "POST");
export const getProfile = forwardAuth("/api/auth/profile", "GET");
export const updateProfile = forwardAuth("/api/auth/profile", "PUT");

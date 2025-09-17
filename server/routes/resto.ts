import type { RequestHandler } from "express";

const API = "https://berestaurantappformentee-production.up.railway.app";

export const listResto: RequestHandler = async (req, res) => {
  try {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(req.query)) if (v != null) qs.append(k, String(v));
    const url = `${API}/api/resto${qs.toString() ? `?${qs.toString()}` : ""}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ success: false, message: "Proxy error", error: String(e) });
  }
};

export const getResto: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as { id: string };
    const url = `${API}/api/resto/${id}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ success: false, message: "Proxy error", error: String(e) });
  }
};

import { RequestHandler } from "express";
import axios from "axios";

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const target = process.env.VITE_API_BASE_URL || process.env.PROXY_TARGET;
    if (!target) {
      return res.status(500).json({ success: false, message: "Proxy target not configured" });
    }

    // build url by stripping prefix '/api/proxy'
    const path = req.originalUrl.replace(/^\/api\/proxy/, "");
    const url = `${target}${path}`;

    const headers = { ...req.headers } as any;
    // remove host header to avoid host mismatch
    delete headers.host;

    const axiosRes = await axios.request({
      method: req.method as any,
      url,
      data: req.body,
      params: req.query,
      headers,
      responseType: "stream",
      validateStatus: () => true,
    });

    res.status(axiosRes.status);
    // copy headers
    Object.entries(axiosRes.headers || {}).forEach(([k, v]) => {
      if (v) res.setHeader(k, String(v));
    });

    if (axiosRes.data && typeof axiosRes.data.pipe === "function") {
      axiosRes.data.pipe(res);
    } else {
      res.send(axiosRes.data);
    }
  } catch (err: any) {
    console.error("Proxy error:", err?.message ?? err);
    res.status(500).json({ success: false, message: "Proxy request failed" });
  }
};

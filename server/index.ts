import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { listResto, getResto } from "./routes/resto";
import { login, registerUser, getProfile, updateProfile } from "./routes/auth";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listRestaurants as listDummyRestaurants,
  createRestaurant as createDummyRestaurant,
  updateRestaurant as updateDummyRestaurant,
  deleteRestaurant as deleteDummyRestaurant,
  listOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  createReview,
  listReviews,
} from "./routes/dummy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health/demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // Proxy to external API (read-only examples)
  app.get("/api/resto", listResto);
  app.get("/api/resto/:id", getResto);

  // Auth proxy
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", registerUser);
  app.get("/api/auth/profile", getProfile);
  app.put("/api/auth/profile", updateProfile);

  // Dummy DB CRUD
  app.get("/api/dummy/categories", listCategories);
  app.post("/api/dummy/categories", createCategory);
  app.put("/api/dummy/categories/:id", updateCategory);
  app.delete("/api/dummy/categories/:id", deleteCategory);

  app.get("/api/dummy/restaurants", listDummyRestaurants);
  app.post("/api/dummy/restaurants", createDummyRestaurant);
  app.put("/api/dummy/restaurants/:id", updateDummyRestaurant);
  app.delete("/api/dummy/restaurants/:id", deleteDummyRestaurant);

  // Orders & Reviews
  app.get("/api/dummy/orders", listOrders);
  app.post("/api/dummy/orders", createOrder);
  app.get("/api/dummy/orders/:id", getOrder);
  app.put("/api/dummy/orders/:id", updateOrder);
  app.delete("/api/dummy/orders/:id", deleteOrder);

  app.get("/api/dummy/reviews", listReviews);
  app.post("/api/dummy/reviews", createReview);

  return app;
}

import type { RequestHandler } from "express";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(import.meta.dirname, "../data/dummy.json");

type Category = { id: number; name: string; slug: string };
interface Restaurant {
  id: number;
  name: string;
  city?: string | null;
  rating?: number | null;
  images?: string[];
  categories?: number[]; // category ids
}

type OrderItem = {
  id: string | number;
  name: string;
  qty: number;
  price: number;
};
interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phone: string;
  address: string;
  createdAt: string;
  status: "preparing" | "on_the_way" | "delivered" | "done" | "canceled";
}

interface Review {
  id: string;
  orderId: string;
  restaurantId?: number | string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initial: {
      categories: Category[];
      restaurants: Restaurant[];
      orders: Order[];
      reviews: Review[];
    } = {
      categories: [
        { id: 1, name: "Nearby", slug: "nearby" },
        { id: 2, name: "Discount", slug: "discount" },
        { id: 3, name: "Best Seller", slug: "best-seller" },
        { id: 4, name: "Delivery", slug: "delivery" },
        { id: 5, name: "Lunch", slug: "lunch" },
      ],
      restaurants: [
        {
          id: 1,
          name: "Burger King",
          city: "Jakarta Selatan",
          rating: 4.9,
          images: [
            "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop",
          ],
          categories: [1, 3],
        },
      ],
      orders: [],
      reviews: [],
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as {
    categories: Category[];
    restaurants: Restaurant[];
    orders: Order[];
    reviews: Review[];
  };
}

async function writeDb(data: {
  categories: Category[];
  restaurants: Restaurant[];
  orders: Order[];
  reviews: Review[];
}) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const listCategories: RequestHandler = async (_req, res) => {
  const db = await readDb();
  res.json({ success: true, data: db.categories });
};

export const createCategory: RequestHandler = async (req, res) => {
  const db = await readDb();
  const { name, slug } = req.body || {};
  const id = (db.categories.at(-1)?.id || 0) + 1;
  const cat: Category = {
    id,
    name,
    slug: slug || String(name).toLowerCase().replace(/\s+/g, "-"),
  };
  db.categories.push(cat);
  await writeDb(db);
  res.status(201).json({ success: true, data: cat });
};

export const updateCategory: RequestHandler = async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1)
    return res.status(404).json({ success: false, message: "Not found" });
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.categories[idx] });
};

export const deleteCategory: RequestHandler = async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  db.categories = db.categories.filter((c) => c.id !== id);
  await writeDb(db);
  res.json({ success: true });
};

export const listRestaurants: RequestHandler = async (_req, res) => {
  const db = await readDb();
  res.json({ success: true, data: db.restaurants });
};

export const createRestaurant: RequestHandler = async (req, res) => {
  const db = await readDb();
  const id = (db.restaurants.at(-1)?.id || 0) + 1;
  const r: Restaurant = { id, ...req.body };
  db.restaurants.push(r);
  await writeDb(db);
  res.status(201).json({ success: true, data: r });
};

export const updateRestaurant: RequestHandler = async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  const idx = db.restaurants.findIndex((r) => r.id === id);
  if (idx === -1)
    return res.status(404).json({ success: false, message: "Not found" });
  db.restaurants[idx] = { ...db.restaurants[idx], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.restaurants[idx] });
};

export const deleteRestaurant: RequestHandler = async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  db.restaurants = db.restaurants.filter((r) => r.id !== id);
  await writeDb(db);
  res.json({ success: true });
};

// Orders CRUD
export const listOrders: RequestHandler = async (_req, res) => {
  const db = await readDb();
  res.json({
    success: true,
    data: db.orders.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
  });
};

export const createOrder: RequestHandler = async (req, res) => {
  const db = await readDb();
  const id = req.body?.id || crypto.randomUUID();
  const order: Order = {
    id,
    items: req.body?.items || [],
    total: Number(req.body?.total || 0),
    customerName: String(req.body?.customerName || ""),
    phone: String(req.body?.phone || ""),
    address: String(req.body?.address || ""),
    createdAt: req.body?.createdAt || new Date().toISOString(),
    status: (req.body?.status as Order["status"]) || "preparing",
  };
  db.orders.unshift(order);
  await writeDb(db);
  res.status(201).json({ success: true, data: order });
};

export const getOrder: RequestHandler = async (req, res) => {
  const db = await readDb();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order)
    return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: order });
};

export const updateOrder: RequestHandler = async (req, res) => {
  const db = await readDb();
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ success: false, message: "Not found" });
  db.orders[idx] = { ...db.orders[idx], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.orders[idx] });
};

export const deleteOrder: RequestHandler = async (req, res) => {
  const db = await readDb();
  db.orders = db.orders.filter((o) => o.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true });
};

// Reviews
export const createReview: RequestHandler = async (req, res) => {
  const db = await readDb();
  const review: Review = {
    id: crypto.randomUUID(),
    orderId: String(req.body?.orderId),
    restaurantId: req.body?.restaurantId ?? null,
    rating: Number(req.body?.rating || 0),
    comment: String(req.body?.comment || ""),
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(review);
  // mark order as done if provided
  const idx = db.orders.findIndex((o) => o.id === review.orderId);
  if (idx >= 0) db.orders[idx].status = "done";
  await writeDb(db);
  res.status(201).json({ success: true, data: review });
};

export const listReviews: RequestHandler = async (req, res) => {
  const db = await readDb();
  const { orderId } = req.query as { orderId?: string };
  const list = orderId
    ? db.reviews.filter((r) => r.orderId === orderId)
    : db.reviews;
  res.json({ success: true, data: list });
};

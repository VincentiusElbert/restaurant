export type Category = {
  id: string | number;
  name: string;
};

export type MenuItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  rating?: number | null;
  category?: string;
  restaurantId?: string | number;
};

export type Restaurant = {
  id: string | number;
  name: string;
  city?: string | null;
  distance?: number | null;
  rating?: number | null;
  images?: string[];
  logo?: string | null;
  menuCount?: number;
  priceRange?: { min: number; max: number } | null;
};

export type CartItem = {
  id: string | number; // menu id
  name: string;
  price: number;
  qty: number;
  image?: string;
  restaurantId?: string | number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  phone: string;
  address: string;
  createdAt: string; // ISO string
};

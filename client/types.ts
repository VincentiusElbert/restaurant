export type Category = {
  id: string;
  name: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
  restaurantId?: number;
  restaurantName?: string;
};

export type CartItem = {
  id: string; // menu id
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  phone: string;
  address: string;
  createdAt: string;
};

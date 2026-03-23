export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  unit: string;
  image: string;
  images: string[];
  description: string;
  isTrending: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
  unit: string;
};

export type CartResponse = {
  sessionId: string;
  items: CartItem[];
  total: number;
};

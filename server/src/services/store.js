import { nanoid } from "nanoid";
import { getDbMode } from "../config/db.js";
import { categorySeed, orderSeed, productSeed, userSeed } from "../data/seedData.js";
import { Cart } from "../models/Cart.js";
import { Category } from "../models/Category.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const memory = {
  categories: structuredClone(categorySeed),
  products: structuredClone(productSeed),
  users: structuredClone(userSeed),
  orders: structuredClone(orderSeed),
  carts: {},
  otpStore: new Map(),
  sessions: new Map(),
};

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function mapDoc(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : doc;
  return { ...plain, id: String(plain._id || plain.id) };
}

export async function bootstrapData() {
  if (getDbMode() !== "mongo") return;

  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(categorySeed.map(({ id, ...item }) => item));
  }
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(productSeed.map(({ id, ...item }) => item));
  }
  if ((await User.countDocuments()) === 0) {
    await User.insertMany(userSeed.map(({ id, ...item }) => item));
  }
  if ((await Order.countDocuments()) === 0) {
    await Order.insertMany(orderSeed.map(({ id, createdAt, ...item }) => item));
  }
}

export async function listCategories() {
  if (getDbMode() === "mongo") {
    return (await Category.find().sort({ name: 1 })).map(mapDoc);
  }
  return [...memory.categories];
}

export async function createCategory(payload) {
  const next = { ...payload, slug: slugify(payload.name) };
  if (getDbMode() === "mongo") {
    return mapDoc(await Category.create(next));
  }
  const category = { id: nanoid(), ...next };
  memory.categories.push(category);
  return category;
}

export async function updateCategory(id, payload) {
  if (getDbMode() === "mongo") {
    return mapDoc(
      await Category.findByIdAndUpdate(id, { ...payload, slug: slugify(payload.name) }, { new: true })
    );
  }
  const category = memory.categories.find((item) => item.id === id);
  if (!category) return null;
  Object.assign(category, payload, { slug: slugify(payload.name || category.name) });
  return category;
}

export async function deleteCategory(id) {
  if (getDbMode() === "mongo") {
    await Category.findByIdAndDelete(id);
    return true;
  }
  memory.categories = memory.categories.filter((item) => item.id !== id);
  return true;
}

export async function listProducts(filters = {}) {
  const category = filters.category?.toLowerCase();
  const search = filters.search?.toLowerCase();
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

  const applyFilters = (items) =>
    items.filter((item) => {
      const categoryMatch = !category || item.category.toLowerCase() === category;
      const searchMatch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);
      const priceMatch = !maxPrice || item.price <= maxPrice;
      return categoryMatch && searchMatch && priceMatch;
    });

  if (getDbMode() === "mongo") {
    const docs = (await Product.find()).map(mapDoc);
    return applyFilters(docs);
  }
  return applyFilters(memory.products);
}

export async function getProductById(idOrSlug) {
  if (getDbMode() === "mongo") {
    const doc =
      (await Product.findById(idOrSlug).catch(() => null)) ||
      (await Product.findOne({ slug: idOrSlug }));
    return mapDoc(doc);
  }
  return memory.products.find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
}

export async function createProduct(payload) {
  const next = {
    ...payload,
    slug: slugify(payload.title),
    discount:
      payload.discount ?? Math.max(0, Math.round(((payload.mrp - payload.price) / payload.mrp) * 100)),
  };
  if (getDbMode() === "mongo") {
    return mapDoc(await Product.create(next));
  }
  const product = { id: nanoid(), ...next };
  memory.products.unshift(product);
  return product;
}

export async function updateProduct(id, payload) {
  const next = {
    ...payload,
    slug: slugify(payload.title),
    discount:
      payload.discount ?? Math.max(0, Math.round(((payload.mrp - payload.price) / payload.mrp) * 100)),
  };
  if (getDbMode() === "mongo") {
    return mapDoc(await Product.findByIdAndUpdate(id, next, { new: true }));
  }
  const product = memory.products.find((item) => item.id === id);
  if (!product) return null;
  Object.assign(product, next);
  return product;
}

export async function deleteProduct(id) {
  if (getDbMode() === "mongo") {
    await Product.findByIdAndDelete(id);
    return true;
  }
  memory.products = memory.products.filter((item) => item.id !== id);
  return true;
}

export async function listUsers() {
  if (getDbMode() === "mongo") {
    return (await User.find().sort({ createdAt: -1 })).map(mapDoc);
  }
  return [...memory.users];
}

export async function getOrCreateUser(phone, name = "Quick User") {
  if (getDbMode() === "mongo") {
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name, role: "customer" });
    }
    return mapDoc(user);
  }
  let user = memory.users.find((item) => item.phone === phone);
  if (!user) {
    user = { id: nanoid(), phone, name, role: "customer", status: "active" };
    memory.users.push(user);
  }
  return user;
}

function sumCart(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export async function getCart(sessionId) {
  if (getDbMode() === "mongo") {
    const cart = await Cart.findOne({ sessionId });
    const items = cart?.items || [];
    return { sessionId, items, total: sumCart(items) };
  }
  const items = memory.carts[sessionId] || [];
  return { sessionId, items, total: sumCart(items) };
}

export async function addCartItem(sessionId, productId, quantity) {
  const product = await getProductById(productId);
  if (!product) return null;
  const nextQty = Math.max(1, Number(quantity || 1));

  if (getDbMode() === "mongo") {
    const cart = (await Cart.findOne({ sessionId })) || (await Cart.create({ sessionId, items: [] }));
    const existing = cart.items.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += nextQty;
    } else {
      cart.items.push({
        productId: product.id,
        quantity: nextQty,
        price: product.price,
        title: product.title,
        image: product.image,
        unit: product.unit,
      });
    }
    await cart.save();
    return getCart(sessionId);
  }

  const items = memory.carts[sessionId] || [];
  const existing = items.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += nextQty;
  } else {
    items.push({
      productId: product.id,
      quantity: nextQty,
      price: product.price,
      title: product.title,
      image: product.image,
      unit: product.unit,
    });
  }
  memory.carts[sessionId] = items;
  return getCart(sessionId);
}

export async function updateCartItem(sessionId, productId, quantity) {
  if (getDbMode() === "mongo") {
    const cart = await Cart.findOne({ sessionId });
    if (!cart) return getCart(sessionId);
    cart.items = cart.items
      .map((item) => {
        if (item.productId !== productId) return item;
        return { ...item.toObject(), quantity: Math.max(0, Number(quantity)) };
      })
      .filter((item) => item.quantity > 0);
    await cart.save();
    return getCart(sessionId);
  }
  const items = memory.carts[sessionId] || [];
  memory.carts[sessionId] = items
    .map((item) => (item.productId === productId ? { ...item, quantity: Math.max(0, Number(quantity)) } : item))
    .filter((item) => item.quantity > 0);
  return getCart(sessionId);
}

export async function removeCartItem(sessionId, productId) {
  return updateCartItem(sessionId, productId, 0);
}

export async function listOrders() {
  if (getDbMode() === "mongo") {
    return (await Order.find().sort({ createdAt: -1 })).map(mapDoc);
  }
  return [...memory.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createOrder(payload) {
  const orderPayload = {
    ...payload,
    status: "Pending",
  };
  if (getDbMode() === "mongo") {
    const order = await Order.create(orderPayload);
    if (payload.sessionId) {
      await Cart.findOneAndUpdate({ sessionId: payload.sessionId }, { items: [] });
    }
    return mapDoc(order);
  }
  const order = { id: nanoid(), createdAt: new Date().toISOString(), ...orderPayload };
  memory.orders.unshift(order);
  if (payload.sessionId) {
    memory.carts[payload.sessionId] = [];
  }
  return order;
}

export async function updateOrderStatus(id, status) {
  if (getDbMode() === "mongo") {
    return mapDoc(await Order.findByIdAndUpdate(id, { status }, { new: true }));
  }
  const order = memory.orders.find((item) => item.id === id);
  if (!order) return null;
  order.status = status;
  return order;
}

export function saveOtp(phone) {
  const otp = "1234";
  memory.otpStore.set(phone, otp);
  return otp;
}

export function verifyOtp(phone, otp) {
  return memory.otpStore.get(phone) === otp;
}

export function createSession(payload) {
  const token = nanoid();
  memory.sessions.set(token, payload);
  return token;
}

export function getSession(token) {
  return memory.sessions.get(token);
}

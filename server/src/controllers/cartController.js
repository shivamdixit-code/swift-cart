import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/store.js";

export async function fetchCart(req, res) {
  res.json(await getCart(req.params.sessionId));
}

export async function addItem(req, res) {
  const cart = await addCartItem(req.params.sessionId, req.body.productId, req.body.quantity);
  if (!cart) return res.status(404).json({ message: "Product not found" });
  res.json(cart);
}

export async function patchItem(req, res) {
  res.json(await updateCartItem(req.params.sessionId, req.params.productId, req.body.quantity));
}

export async function deleteItem(req, res) {
  res.json(await removeCartItem(req.params.sessionId, req.params.productId));
}

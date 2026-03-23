import { createOrder, listOrders, updateOrderStatus } from "../services/store.js";

export async function getOrders(req, res) {
  res.json(await listOrders());
}

export async function postOrder(req, res) {
  res.status(201).json(await createOrder(req.body));
}

export async function patchOrderStatus(req, res) {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

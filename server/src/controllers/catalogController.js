import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getProductById,
  listCategories,
  listProducts,
  updateCategory,
  updateProduct,
} from "../services/store.js";

export async function getCategories(req, res) {
  res.json(await listCategories());
}

export async function postCategory(req, res) {
  res.status(201).json(await createCategory(req.body));
}

export async function putCategory(req, res) {
  const category = await updateCategory(req.params.id, req.body);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
}

export async function removeCategory(req, res) {
  await deleteCategory(req.params.id);
  res.status(204).end();
}

export async function getProducts(req, res) {
  res.json(await listProducts(req.query));
}

export async function getProduct(req, res) {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function postProduct(req, res) {
  res.status(201).json(await createProduct(req.body));
}

export async function putProduct(req, res) {
  const product = await updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

export async function removeProduct(req, res) {
  await deleteProduct(req.params.id);
  res.status(204).end();
}

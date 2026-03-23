import { listUsers } from "../services/store.js";

export async function getUsers(req, res) {
  res.json(await listUsers());
}

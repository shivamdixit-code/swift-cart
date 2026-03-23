import { getSession } from "../services/store.js";

export function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const session = token ? getSession(token) : null;
  if (!session || session.role !== "admin") {
    return res.status(401).json({ message: "Admin authorization required" });
  }
  return next();
}

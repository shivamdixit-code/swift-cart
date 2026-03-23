import path from "node:path";

export function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${path.basename(req.file.path)}`;
  return res.status(201).json({ imageUrl });
}

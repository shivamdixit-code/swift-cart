import { env } from "../config/env.js";
import { createSession, getOrCreateUser, getSession, saveOtp, verifyOtp } from "../services/store.js";

export async function requestOtp(req, res) {
  const { phone } = req.body;
  const otp = saveOtp(phone);
  res.json({ success: true, message: "OTP sent", otp });
}

export async function verifyOtpController(req, res) {
  const { phone, otp, name } = req.body;
  if (!verifyOtp(phone, otp)) {
    return res.status(400).json({ message: "Invalid OTP. Use 1234 in demo mode." });
  }
  const user = await getOrCreateUser(phone, name || "SwiftCart User");
  const token = createSession({ userId: user.id, role: user.role });
  return res.json({ token, user });
}

export async function adminLogin(req, res) {
  const { email, password } = req.body;
  if (email !== env.adminEmail || password !== env.adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  const token = createSession({ role: "admin", email });
  return res.json({ token, admin: { email } });
}

export function me(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const session = token ? getSession(token) : null;
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json(session);
}

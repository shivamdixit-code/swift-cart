import axios from "axios";

const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/admin";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("swiftcart-admin-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function getAdminBasePath() {
  return ADMIN_BASE_PATH;
}

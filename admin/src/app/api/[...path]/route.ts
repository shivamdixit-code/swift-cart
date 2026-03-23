import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "https://swift-cart-admin-omega.vercel.app/admin/login";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = path.join("/");
  const search = request.nextUrl.search || "";
  const url = `${BACKEND_URL}/${targetPath}${search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
    redirect: "follow",
  });

  const nextHeaders = new Headers(response.headers);
  nextHeaders.delete("content-encoding");
  nextHeaders.delete("content-length");

  return new NextResponse(response.body, {
    status: response.status,
    headers: nextHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

// proxy.js

import { NextResponse } from "next/server";

import { verifyJWT } from "./lib/auth";
import {
  X_HEADER_USER_EMAIL,
  X_HEADER_USER_ID,
  X_HEADER_USER_NAME,
} from "./lib/constant";

const allowedOrigins = [
  "http://localhost:5173",
  "https://front-end-ten-inky.vercel.app",
];

const protectedPaths = ["/api/item", "/api/user"];

function getCorsHeaders(origin) {
  const isAllowed = allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function proxy(request) {
  const origin = request.headers.get("origin");
  const cors = getCorsHeaders(origin);
  const { pathname } = request.nextUrl;

  // Handle preflight for every /api route
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: cors });
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const user = verifyJWT(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized Request" },
        { status: 401, headers: cors },
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(X_HEADER_USER_ID, user.id);
    requestHeaders.set(X_HEADER_USER_EMAIL, user.email);
    requestHeaders.set(X_HEADER_USER_NAME, user.username);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    Object.entries(cors).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }

  const response = NextResponse.next();
  Object.entries(cors).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
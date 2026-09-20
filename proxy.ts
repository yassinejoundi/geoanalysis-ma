import { NextResponse } from "next/server";
import { contentSecurityPolicy } from "./lib/server/content-security-policy";

export function proxy() {
  const policy = contentSecurityPolicy(process.env.NODE_ENV === "development");
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

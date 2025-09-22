// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

// ➡️ When processing requests, strip locale first then check path
function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/");
  const possibleLocale = segments[1];
  if (routing.locales.includes(possibleLocale)) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}

const protectedPaths = ["/profile"];
// Define which paths are public (like sign-in page)
const isProtectedRoute = createRouteMatcher(protectedPaths);

export function isProtectedPath(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cleanPath = stripLocaleFromPath(pathname);

  return protectedPaths.some((path) => cleanPath.startsWith(path));
}

const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: "as-needed",
});

// Integrate middleware logic
export default clerkMiddleware(async (auth, req: NextRequest) => {
  console.log(req.nextUrl.pathname);

  // Check if it's an API route
  if (req.nextUrl.pathname.startsWith("/api/")) {
    // For API routes, only do authentication, no internationalization
    if (req.nextUrl.pathname.startsWith("/api/user/")) {
      await auth.protect(); // Protect user-related API routes
    }
    return; // For API routes, no internationalization processing
  }

  // For other page routes
  if (isProtectedPath(req)) {
    await auth.protect();
  }

  // Perform internationalization path processing
  return intlMiddleware(req);
});

// Configure matcher to match all page requests at once
export const config = {
  matcher: [
    // Match all page requests (except static files)
    "/((?!_next|_vercel|.*\\..*).*)",
    "/api/user/shared-images",
    "/preview",
  ],
};

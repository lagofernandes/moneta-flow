import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js configuration.
 * This file must NOT import any Node.js-only modules (pg, drizzle, etc.)
 * so it can safely be used by the Next.js Middleware (Edge Runtime).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],  // Providers are added in the full auth.ts (Node.js runtime)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Public routes that don't require authentication
      const publicRoutes = ["/login", "/api/auth", "/register", "/api/register"];
      const isPublicRoute = publicRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isPublicRoute) {
        // Redirect authenticated users away from login
        if (isLoggedIn && nextUrl.pathname === "/login") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Require authentication for all other routes
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;

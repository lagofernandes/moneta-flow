import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Middleware uses the Edge-safe auth config (no Node.js dependencies).
 * The full auth.ts with DrizzleAdapter is only used in API routes (Node.js runtime).
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

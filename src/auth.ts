import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    currency?: string;
    timezone?: string;
  }
  interface Session {
    user: {
      id: string;
      currency: string;
      timezone: string;
    } & DefaultSession["user"];
  }
}
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authConfig } from "@/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * Simple password hash using SHA-256.
 * For production, replace with bcrypt or argon2.
 */
async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex === hash;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (user.length === 0) return null;

        const foundUser = user[0];
        if (!foundUser.passwordHash) return null;

        const isValid = await verifyPassword(password, foundUser.passwordHash);
        if (!isValid) return null;

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          image: foundUser.image,
          currency: foundUser.currency,
          timezone: foundUser.timezone,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.currency = user.currency;
        token.timezone = user.timezone;
      }
      
      // Allow client-side session updates
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.currency) token.currency = session.currency;
        if (session.timezone) token.timezone = session.timezone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.currency = (token.currency as string) || "BRL";
        session.user.timezone = (token.timezone as string) || "America/Sao_Paulo";
      }
      return session;
    },
  },
});

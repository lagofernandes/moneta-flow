## 1. Database & Packages Setup

- [x] 1.1 Install dependencies: `next-auth@beta` and `@auth/drizzle-adapter`
- [x] 1.2 Update `src/db/schema.ts` to include standard Auth.js tables (users, accounts, sessions, verificationTokens)
- [x] 1.3 Generate and push Drizzle migrations to update the PostgreSQL database

## 2. Auth.js Configuration

- [x] 2.1 Create `src/auth.ts` and configure NextAuth with DrizzleAdapter and Credentials Provider
- [x] 2.2 Create the Next.js API Route handler at `src/app/api/auth/[...nextauth]/route.ts`

## 3. Route Protection (Middleware)

- [x] 3.1 Create `src/middleware.ts` to intercept requests to `/dashboard` and redirect unauthenticated users to `/login`

## 4. UI Implementation

- [x] 4.1 Create `src/components/auth/login-form.tsx` (Client Component) with Zod validation, error handling, and `signIn` action
- [x] 4.2 Create `src/app/(auth)/login/page.tsx` featuring a modern, responsive layout using Tailwind CSS and Framer Motion
- [x] 4.3 Implement a logout button/action using the `signOut` method from Auth.js to allow users to invalidate their session

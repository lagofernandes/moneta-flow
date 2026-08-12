## 1. Project & Environment Scaffolding

- [x] 1.1 Initialize Next.js 14/15 App Router project structure with TypeScript, ESLint, and Tailwind CSS
- [x] 1.2 Configure `.env.example` and `tsconfig.json` path aliases (`@/*`)
- [x] 1.3 Install core dependencies (`drizzle-orm`, `pg`, `zod`, `lucide-react`, `recharts`, `clsx`, `tailwind-merge`, `class-variance-authority`)
- [x] 1.4 Install dev dependencies (`drizzle-kit`, `dotenv`, `@types/node`, `@types/react`, `@types/pg`)

## 2. Database Schema & Migration Setup

- [x] 2.1 Create Drizzle database configuration in `drizzle.config.ts`
- [x] 2.2 Define Drizzle ORM schemas and relations for `users`, `categories`, and `transactions` in `src/db/schema.ts`
- [x] 2.3 Create database client connection manager in `src/db/index.ts`
- [x] 2.4 Create database seed script in `src/db/seed.ts` for default financial categories (Salary, Investment, Food, Housing, Transport, Utilities, Health, Entertainment)
- [x] 2.5 Generate initial SQL migration files via Drizzle Kit

## 3. UI System & Layout Scaffolding

- [x] 3.1 Configure Tailwind CSS custom tokens (color palette, financial contrast variables for light/dark modes)
- [x] 3.2 Scaffold Shadcn UI component primitives (`Button`, `Card`, `Dialog`, `Input`, `Select`, `Table`, `Badge`, `Tabs`)
- [x] 3.3 Create root layout shell with responsive header, sidebar navigation, and balance indicator summary cards
- [x] 3.4 Create main financial dashboard page boilerplate in `src/app/page.tsx`

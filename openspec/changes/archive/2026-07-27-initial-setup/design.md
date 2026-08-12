## Context

Moneta Flow requires a robust, scalable, type-safe fullstack foundation for personal financial control. The architecture must support fast transaction entry, real-time balance calculations, expense breakdown by category, and responsive interactive visualizations.

## Goals / Non-Goals

**Goals:**
- Define a modern, production-ready Fullstack TypeScript architecture.
- Justify tech stack selections for framework, database/ORM, and UI component libraries.
- Define normalized database schemas for Users, Categories, and Transactions using Drizzle ORM.
- Provide initial environment configurations (`.env.example`, `drizzle.config.ts`, `tsconfig.json`, `package.json`).
- Structure the application layout and design system for dark/light themes and modern financial dashboards.

**Non-Goals:**
- Implementing multi-tenant enterprise accounting or multi-currency live conversions in the initial boilerplate phase.
- Setting up production CI/CD pipelines (deferred to deployment phase).

## Tech Stack Recommendation & Justification

### 1. Framework: Next.js (App Router, Server Actions, RSC)
- **Why**: React 19/Next.js App Router provides unified fullstack TypeScript development. Server Components reduce client-side JavaScript bundles, while Server Actions eliminate API routing boilerplate for form submissions and database mutations.
- **Alternatives Considered**:
  - *Vite + Express/Fastify*: Requires maintaining separate repos or backend API schemas with duplicate DTOs.
  - *Remix*: Good option, but Next.js has broader ecosystem adoption for UI components (Shadcn UI).

### 2. Database & ORM: PostgreSQL + Drizzle ORM
- **Why**:
  - **PostgreSQL**: Strong ACID compliance, exact decimal numeric support for currency (`numeric(12, 2)`), and robust relational integrity.
  - **Drizzle ORM**: Lightweight, TypeScript-first SQL query builder with zero runtime overhead, auto-generated type-safe migrations (`drizzle-kit`), serverless edge compatibility (Neon, Supabase, Vercel Postgres).
- **Alternatives Considered**:
  - *Prisma*: Heavier runtime binary engine, higher latency in serverless environments, and less direct SQL control compared to Drizzle.
  - *MongoDB*: Document stores lack strict relational constraints essential for financial integrity across user accounts, transactions, and categories.

### 3. UI Libraries & Design System: Tailwind CSS + Shadcn UI + Lucide React + Recharts
- **Why**:
  - **Tailwind CSS**: Utility-first CSS allowing rapid customization of design tokens (colors, glassmorphism, gradients).
  - **Shadcn UI (Radix Primitives)**: Accessible, unstyled, headless UI components copied directly into the project codebase for 100% style and logic ownership.
  - **Lucide React**: Clean vector icon library for category icons and navigation.
  - **Recharts**: High-performance React charting library for income vs. expense visual breakdowns, area charts for balance history, and pie/donut charts for category allocation.
  - **Framer Motion**: Micro-animations for feedback on transaction additions, modal transitions, and dashboard card counters.

---

## Database Schemas (Drizzle ORM Definition)

```typescript
// src/db/schema.ts
import { pgTable, uuid, text, timestamp, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const transactionTypeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PAID', 'PENDING']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable for global defaults
  name: text('name').notNull(),
  type: transactionTypeEnum('type').notNull(),
  color: text('color').default('#64748b').notNull(),
  icon: text('icon').default('tag').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  status: transactionStatusEnum('status').default('PAID').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
```

---

## Decisions

- **Decision 1**: Use Drizzle ORM instead of Prisma for faster cold starts, pure TypeScript schema definitions, and direct control over migrations.
- **Decision 2**: Store transaction amounts as `numeric(12, 2)` to eliminate floating-point rounding errors in currency calculations.
- **Decision 3**: Use Server Actions with Zod validation for safe end-to-end data processing without API route overhead.
- **Decision 4**: Implement custom theme token extensions in Tailwind (`--background`, `--foreground`, `--primary`, `--income`, `--expense`) for dark/light contrast optimized for financial data display.

## Risks / Trade-offs

- [Risk] Server Actions security validation → Mitigation: Enforce Zod schema validation on every action and verify authenticated user session context before performing queries/mutations.
- [Risk] Category deletion breaking past transactions → Mitigation: Set `onDelete: 'set null'` on transaction category relations to preserve historical transaction records even if a category is deleted.

## Environment Configurations

### `.env.example`
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration (PostgreSQL / Neon / Supabase)
DATABASE_URL=postgresql://postgres:password@localhost:5432/moneta_flow

# Auth Secret
NEXTAUTH_SECRET=your_super_secret_jwt_key_here
NEXTAUTH_URL=http://localhost:3000
```

### `drizzle.config.ts`
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Why

Moneta Flow is a modern personal financial management application designed to allow users to record income and expenses, organize transactions into custom categories, and visualize real-time account balances and charts. Setting up a robust, scalable, and type-safe initial boilerplate establishes a strong architectural foundation, ensuring developer productivity, code consistency, and seamless end-to-end type safety from the database to the user interface.

## What Changes

- **Tech Stack Setup**: Initialize a modern Fullstack TypeScript application using Next.js 14+ (App Router), Tailwind CSS, Shadcn UI, and Drizzle ORM with PostgreSQL.
- **Database Schema & Migrations**: Define initial Drizzle schemas for `users`, `categories`, and `transactions` with relational integrity, enums, and timestamps.
- **Environment & DX Setup**: Configure TypeScript (`tsconfig.json`), ESLint, Prettier, `.env.example`, Drizzle Kit configuration (`drizzle.config.ts`), and seed script scaffolding.
- **UI & Layout Scaffold**: Establish global styling tokens, dark/light theme support, root layout with responsive navigation, and component library configuration.

## Capabilities

### New Capabilities
- `environment-setup`: Development environment configuration, scripts, TypeScript, ESLint, and environment variables.
- `database-schema`: Core data models (Users, Categories, Transactions) managed with Drizzle ORM and PostgreSQL.
- `ui-foundation`: Design system foundation, Tailwind CSS config, Shadcn UI setup, and base layout shell for Moneta Flow.

### Modified Capabilities
*(None - initial setup)*

## Impact

- **Dependencies**: Next.js, React, TypeScript, Drizzle ORM, `drizzle-kit`, `@neondatabase/serverless` (or `pg`), Tailwind CSS, Lucide React, Zod.
- **Project Structure**: Establishes standard App Router structure (`/src/app`, `/src/db`, `/src/components`, `/src/lib`, `/src/types`).
- **Database**: Initial database tables for Users, Categories, and Transactions.

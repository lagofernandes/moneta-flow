import { pgTable, uuid, text, timestamp, numeric, pgEnum, AnyPgColumn } from 'drizzle-orm/pg-core';
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
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable for global/system defaults
  parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, { onDelete: 'cascade' }),
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
  bank: text('bank'),
  date: timestamp('date').notNull(),
  status: transactionStatusEnum('status').default('PAID').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Merchant Rules Table (Continuous Learning for Invoice Categorization)
export const merchantRules = pgTable('merchant_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  pattern: text('pattern').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Global Merchant Cache Table (Level 1.5)
export const globalMerchantCache = pgTable('global_merchant_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  pattern: text('pattern').notNull().unique(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  transactions: many(transactions),
  merchantRules: many(merchantRules),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'parentChild',
  }),
  children: many(categories, {
    relationName: 'parentChild',
  }),
  transactions: many(transactions),
  merchantRules: many(merchantRules),
  globalMerchantCache: many(globalMerchantCache),
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

export const merchantRulesRelations = relations(merchantRules, ({ one }) => ({
  user: one(users, {
    fields: [merchantRules.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [merchantRules.categoryId],
    references: [categories.id],
  }),
}));

export const globalMerchantCacheRelations = relations(globalMerchantCache, ({ one }) => ({
  category: one(categories, {
    fields: [globalMerchantCache.categoryId],
    references: [categories.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type MerchantRule = typeof merchantRules.$inferSelect;
export type NewMerchantRule = typeof merchantRules.$inferInsert;

export type GlobalMerchantCache = typeof globalMerchantCache.$inferSelect;
export type NewGlobalMerchantCache = typeof globalMerchantCache.$inferInsert;

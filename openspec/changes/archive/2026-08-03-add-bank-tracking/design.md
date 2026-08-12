# Technical Design: Bank Tracking & Filtering

## Architecture Overview

```
PDF / OFX / CSV Invoice
    ↓
┌─────────────────────────────────┐
│ pdf-parser / ofx-csv-parser     │ → Detects Bank (Itaú, Mercado Pago, Nubank, etc.)
└───────────┬─────────────────────┘
            ↓ ParsedInvoiceItem { bank: "Itaú" }
┌─────────────────────────────────┐
│ InvoiceStagingTable             │ → User reviews & can edit Bank
└───────────┬─────────────────────┘
            ↓ Confirm Import
┌─────────────────────────────────┐
│ PostgreSQL (transactions.bank)  │ → Stores bank name
└───────────┬─────────────────────┘
            ↓ GET /api/transactions
┌─────────────────────────────────┐
│ Dashboard & Filters (page.tsx)  │ → Filter by Bank + Display Bank Badges
└─────────────────────────────────┘
```

## Data Schema Changes

### `transactions` table (PostgreSQL / Drizzle)
```typescript
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description').notNull(),
  bank: text('bank'), // e.g. "Itaú", "Mercado Pago", "Nubank", "Bradesco", "C6 Bank", "Inter", "Outros"
  date: timestamp('date').notNull(),
  status: transactionStatusEnum('status').default('PAID').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Bank Detection Heuristics
- **PDF Headers**: Match keywords in header text ("Mercado Pago", "Itaú", "Nubank", "Bradesco", "Banco Inter", "C6 Bank").
- **Gemini Flash Prompt**: Instruct Gemini Flash to output `bankName` in response JSON schema.
- **OFX Tags**: Read `<BANKID>` or `<ORG>` tags.
- **CSV Headers**: Auto-detect `banco` or `bank` column.

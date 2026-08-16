import { db } from "@/db";
import { users, categories, transactions, merchantRules } from "@/db/schema";
import { eq, or, isNull } from "drizzle-orm";
import { parsePdfInvoice, ParsedInvoiceItem } from "@/lib/invoices/pdf-parser";
import { parseOfxInvoice, parseCsvInvoice } from "@/lib/invoices/ofx-csv-parser";
import { categorizeInvoiceItems, CategorizedInvoiceItem } from "@/lib/invoices/categorizer";

export async function getOrCreateUserId(): Promise<string> {
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    return existingUsers[0].id;
  }
  const [newUser] = await db
    .insert(users)
    .values({ name: "Vinicius", email: "vinicius@monetaflow.com", passwordHash: "demo" })
    .returning();
  return newUser.id;
}

export interface ProcessInvoiceResult {
  items: CategorizedInvoiceItem[];
  warnings: string[];
}

export async function processInvoiceFileService(buffer: Buffer, fileName: string): Promise<ProcessInvoiceResult> {
  const userId = await getOrCreateUserId();
  const userCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(or(eq(categories.userId, userId), isNull(categories.userId)));

  let parsedItems: ParsedInvoiceItem[] = [];

  if (fileName.endsWith(".pdf")) {
    parsedItems = await parsePdfInvoice(buffer, userCategories);
  } else if (fileName.endsWith(".ofx")) {
    const ofxText = buffer.toString("utf-8");
    parsedItems = parseOfxInvoice(ofxText);
  } else if (fileName.endsWith(".csv") || fileName.endsWith(".txt")) {
    const csvText = buffer.toString("utf-8");
    parsedItems = parseCsvInvoice(csvText);
  } else {
    throw new Error("Formato de arquivo não suportado.");
  }

  if (!parsedItems || parsedItems.length === 0) {
    throw new Error("Não foi possível extrair lançamentos desta fatura.");
  }

  const categorizedItems = await categorizeInvoiceItems(userId, parsedItems);

  // Build warnings for the user
  const warnings: string[] = [];
  const uncategorizedCount = categorizedItems.filter(i => !i.categoryId).length;
  const totalCount = categorizedItems.length;

  if (uncategorizedCount === totalCount) {
    warnings.push("A categorização automática por IA não está disponível no momento. Todos os itens precisam de revisão manual das categorias.");
  } else if (uncategorizedCount > 0) {
    warnings.push(`${uncategorizedCount} de ${totalCount} lançamentos não puderam ser categorizados pela IA e estão marcados como "Pendente". Revise as categorias antes de importar.`);
  }

  return { items: categorizedItems, warnings };
}

export async function confirmInvoiceImportService(items: CategorizedInvoiceItem[], saveRules = true) {
  const userId = await getOrCreateUserId();
  const userCategories = await db.select().from(categories).where(eq(categories.userId, userId));
  const defaultCategory = userCategories.find((c) => c.name === "Outros") || userCategories[0];

  const newTransactionsToInsert = [];
  const rulesToInsert = [];

  for (const item of items) {
    let finalCategoryId = item.categoryId || (defaultCategory ? defaultCategory.id : null);

    newTransactionsToInsert.push({
      userId,
      categoryId: finalCategoryId,
      type: "EXPENSE" as const,
      amount: String(item.amount),
      description: item.installment ? `${item.description} (${item.installment})` : item.description,
      bank: item.bank || null,
      date: new Date(item.date),
      status: "PAID" as const,
    });

    if (saveRules && finalCategoryId) {
      rulesToInsert.push({ userId, pattern: item.description.toUpperCase().trim(), categoryId: finalCategoryId });
    }
  }

  if (newTransactionsToInsert.length > 0) {
    await db.insert(transactions).values(newTransactionsToInsert);
  }

  if (rulesToInsert.length > 0) {
    for (const rule of rulesToInsert) {
      const existing = await db.select().from(merchantRules).where(eq(merchantRules.userId, userId));
      const hasRule = existing.some((r) => r.pattern.toUpperCase().trim() === rule.pattern);
      if (!hasRule) {
        await db.insert(merchantRules).values(rule);
      }
    }
  }

  return newTransactionsToInsert.length;
}

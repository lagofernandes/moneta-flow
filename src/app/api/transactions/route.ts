import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';

const CATEGORY_COLORS: Record<string, string> = {
  "Salário": "#10b981",
  "Alimentação": "#f59e0b",
  "Moradia": "#ef4444",
  "Freelance": "#8b5cf6",
  "Utilidades": "#6366f1",
  "Transporte": "#3b82f6",
  "Saúde": "#ec4899",
  "Lazer": "#14b8a6",
  "Lazer & Entretenimento": "#a855f7",
  "Investimentos": "#3b82f6",
  "Outros": "#64748b",
};

// GET /api/transactions
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, session.user.id),
      orderBy: [desc(transactions.date)],
      with: {
        category: {
          with: {
            parent: true
          }
        },
      },
    });

    const formatted = userTransactions.map((tx) => {
      const categoryName = tx.category?.name || 'Outros';
      const parentCategoryName = (tx.category as any)?.parent?.name || undefined;
      const color = tx.category?.color || CATEGORY_COLORS[categoryName] || '#64748b';
      const dateStr = tx.date ? new Date(tx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      return {
        id: tx.id,
        description: tx.description,
        amount: Number(tx.amount),
        type: tx.type,
        status: tx.status,
        category: categoryName,
        parentCategory: parentCategoryName,
        bank: tx.bank || undefined,
        color,
        date: dateStr,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST /api/transactions
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { description, amount, type, status, category, bank, date } = body;

    // Find or create category
    let categoryRecord = null;
    if (category) {
      categoryRecord = await db.query.categories.findFirst({
        where: eq(categories.name, category),
      });

      if (!categoryRecord) {
        const color = CATEGORY_COLORS[category] || '#64748b';
        const [newCat] = await db.insert(categories).values({
          name: category,
          type: type === 'INCOME' ? 'INCOME' : 'EXPENSE',
          color,
        }).returning();
        categoryRecord = newCat;
      }
    }

    const txDate = date ? new Date(date) : new Date();

    const [insertedTx] = await db.insert(transactions).values({
      userId: session.user.id,
      categoryId: categoryRecord ? categoryRecord.id : null,
      description,
      amount: String(amount),
      type: type || 'EXPENSE',
      status: status || 'PAID',
      bank: bank || null,
      date: txDate,
    }).returning();

    const color = categoryRecord?.color || CATEGORY_COLORS[category] || '#64748b';

    return NextResponse.json({
      id: insertedTx.id,
      description: insertedTx.description,
      amount: Number(insertedTx.amount),
      type: insertedTx.type,
      status: insertedTx.status,
      category: categoryRecord ? categoryRecord.name : (category || 'Outros'),
      bank: insertedTx.bank || undefined,
      color,
      date: insertedTx.date ? new Date(insertedTx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

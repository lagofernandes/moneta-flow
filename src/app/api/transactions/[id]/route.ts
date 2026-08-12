import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

// PUT /api/transactions/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { description, amount, type, status, category, date } = body;

    let categoryId: string | null = null;
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
      categoryId = categoryRecord.id;
    }

    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (description !== undefined) updateValues.description = description;
    if (amount !== undefined) updateValues.amount = String(amount);
    if (type !== undefined) updateValues.type = type;
    if (status !== undefined) updateValues.status = status;
    if (categoryId !== null) updateValues.categoryId = categoryId;
    if (date !== undefined) updateValues.date = new Date(date);

    const [updatedTx] = await db
      .update(transactions)
      .set(updateValues)
      .where(eq(transactions.id, id))
      .returning();

    if (!updatedTx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const color = categoryRecord?.color || (category ? CATEGORY_COLORS[category] : '#64748b');

    return NextResponse.json({
      id: updatedTx.id,
      description: updatedTx.description,
      amount: Number(updatedTx.amount),
      type: updatedTx.type,
      status: updatedTx.status,
      category: categoryRecord ? categoryRecord.name : (category || 'Outros'),
      color,
      date: updatedTx.date ? new Date(updatedTx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [deletedTx] = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();

    if (!deletedTx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

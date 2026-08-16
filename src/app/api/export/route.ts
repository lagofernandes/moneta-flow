import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão não autenticada. Faça login novamente." }, { status: 401 });
    }

    const userTransactions = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        description: transactions.description,
        amount: transactions.amount,
        type: transactions.type,
        status: transactions.status,
        bank: transactions.bank,
        category: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, session.user.id))
      .orderBy(desc(transactions.date));

    if (!userTransactions || userTransactions.length === 0) {
      return NextResponse.json({ error: "Nenhuma transação encontrada para exportação" }, { status: 404 });
    }

    // Generate CSV with UTF-8 BOM for Excel compatibility
    const headers = ["Data", "Descrição", "Valor", "Tipo", "Status", "Banco", "Categoria"];
    
    const rows = userTransactions.map((t) => {
      const dateStr = t.date ? new Date(t.date).toISOString().split('T')[0] : "";
      const descStr = (t.description || "").replace(/"/g, '""');
      const bankStr = (t.bank || "").replace(/"/g, '""');
      const catStr = (t.category || "").replace(/"/g, '""');
      return [
        dateStr,
        `"${descStr}"`,
        t.amount ?? 0,
        t.type ?? "",
        t.status ?? "",
        `"${bankStr}"`,
        `"${catStr}"`,
      ].join(";"); // Using semicolon for standard PT-BR Excel CSV compatibility
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="moneta_flow_export.csv"',
      },
    });
  } catch (error) {
    console.error("Error generating export:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar o arquivo de exportação" },
      { status: 500 }
    );
  }
}

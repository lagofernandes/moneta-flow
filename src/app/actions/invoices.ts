"use server";

import { CategorizedInvoiceItem } from "@/lib/invoices/categorizer";
import { processInvoiceFileService, confirmInvoiceImportService } from "@/services/invoiceService";

export async function processInvoiceFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false, error: "Nenhum arquivo enviado." };

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processInvoiceFileService(buffer, fileName);

    return {
      success: true,
      items: result.items,
      fileName: file.name,
      totalCount: result.items.length,
      warnings: result.warnings,
    };
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || "Erro interno ao processar a fatura.";
    console.error("[Invoice Server Action] Error processing file:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function confirmInvoiceImportAction(items: CategorizedInvoiceItem[], saveRules = true) {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "Nenhuma transação selecionada para importar." };
    }
    const count = await confirmInvoiceImportService(items, saveRules);
    return { success: true, count };
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || "Erro ao salvar transações no banco de dados.";
    console.error("[Invoice Server Action] Error confirming import:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

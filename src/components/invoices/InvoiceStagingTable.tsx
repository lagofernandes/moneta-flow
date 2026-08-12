"use client";

import React, { useState } from "react";
import { CategorizedInvoiceItem, CategoryProvenance } from "@/lib/invoices/categorizer";
import {
  Sparkles,
  History,
  Globe,
  CheckCircle2,
  AlertCircle,
  Tag,
  Calendar,
  Check,
  X,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/context/TransactionContext";

interface InvoiceStagingTableProps {
  items: CategorizedInvoiceItem[];
  fileName: string;
  onConfirmSuccess: (count: number) => void;
  onCancel: () => void;
}



const BANKS_LIST = [
  "Itaú",
  "Mercado Pago",
  "Nubank",
  "Bradesco",
  "C6 Bank",
  "Inter",
  "Santander",
  "Banco do Brasil",
  "Caixa",
  "BTG Pactual",
  "XP Investimentos",
  "Banco Pan",
  "Neon",
  "Sicoob",
  "Sicredi",
  "Outros",
];

export function InvoiceStagingTable({
  items: initialItems,
  fileName,
  onConfirmSuccess,
  onCancel,
}: InvoiceStagingTableProps) {
  const [items, setItems] = useState<
    Array<CategorizedInvoiceItem & { selected: boolean }>
  >(() =>
    initialItems.map((item) => ({
      ...item,
      categoryName: item.categoryName || "Outros",
      bank: item.bank || "Outros",
      selected: true,
    }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveRules, setSaveRules] = useState(true);

  const { categories } = useTransactions();
  const motherCategories = categories.filter(c => c.parentId === null);

  const toggleSelectAll = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const toggleItemSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateItemCategory = (id: string, newCategoryName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, categoryName: newCategoryName } : item
      )
    );
  };

  const updateItemBank = (id: string, newBank: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bank: newBank } : item))
    );
  };

  const updateItemDescription = (id: string, newDesc: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description: newDesc } : item))
    );
  };

  const selectedCount = items.filter((i) => i.selected).length;
  const totalAmountSelected = items
    .filter((i) => i.selected)
    .reduce((sum, item) => sum + item.amount, 0);

  const handleConfirm = async () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const { confirmInvoiceImportAction } = await import("@/app/actions/invoices");
      const res = await confirmInvoiceImportAction(selectedItems, saveRules);

      if (res.success) {
        onConfirmSuccess(res.count ?? 0);
      } else {
        alert(res.error || "Erro ao salvar transações.");
      }
    } catch (err: any) {
      alert("Erro ao confirmar importação: " + (err?.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProvenanceBadge = (provenance?: CategoryProvenance) => {
    switch (provenance) {
      case "HISTORIC":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <History className="w-3 h-3" /> Histórico
          </span>
        );
      case "AI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3 h-3" /> IA
          </span>
        );
      case "WEB_SEARCH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Globe className="w-3 h-3" /> Busca Web
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {fileName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} lançamentos extraídos da fatura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400 block">Total Selecionado:</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              R$ {totalAmountSelected.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-h-[380px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={items.every((i) => i.selected)}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="p-3">Data</th>
              <th className="p-3">Descrição / Estabelecimento</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Banco</th>
              <th className="p-3">Subcategoria</th>
              <th className="p-3 text-center">Origem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {items.map((item) => (
              <tr
                key={item.id}
                className={`transition-colors ${
                  item.selected
                    ? "bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/60 dark:hover:bg-slate-900/50"
                    : "opacity-40 bg-slate-100/20 dark:bg-slate-950"
                }`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItemSelect(item.id!)}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </td>
                <td className="p-3 whitespace-nowrap text-slate-700 dark:text-slate-300 font-mono">
                  {item.date}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItemDescription(item.id!, e.target.value)}
                      className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 rounded px-1.5 py-0.5 w-full text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
                    />
                    {item.installment && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                        {item.installment}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100 font-mono">
                  R$ {item.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3">
                  <select
                    value={item.bank || "Outros"}
                    onChange={(e) => updateItemBank(item.id!, e.target.value)}
                    className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    {Array.from(
                      new Set([
                        ...BANKS_LIST,
                        ...(item.bank && item.bank !== "Outros" ? [item.bank] : []),
                      ])
                    ).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={item.categoryName || "Outros"}
                    onChange={(e) => updateItemCategory(item.id!, e.target.value)}
                    className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {motherCategories.map((mother) => {
                      const children = categories.filter(c => c.parentId === mother.id);
                      if (children.length > 0) {
                        return (
                          <optgroup key={mother.id} label={`${mother.icon} ${mother.name}`}>
                            {children.map(child => (
                              <option key={child.id} value={child.name}>
                                {child.icon} {child.name}
                              </option>
                            ))}
                          </optgroup>
                        );
                      }
                      return (
                        <option key={mother.id} value={mother.name} className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {mother.icon} {mother.name}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  {renderProvenanceBadge(item.provenance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={saveRules}
            onChange={(e) => setSaveRules(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Salvar escolhas para aprender nas próximas faturas</span>
        </label>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={selectedCount === 0 || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-2 shadow-lg shadow-emerald-600/20"
          >
            {isSubmitting ? (
              <span>Importando...</span>
            ) : (
              <>
                <Check className="w-4 h-4" /> Importar {selectedCount} lançamentos
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

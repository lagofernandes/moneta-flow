"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions, Transaction } from "@/context/TransactionContext";
import { TransactionDetailModal } from "@/components/modals/TransactionDetailModal";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { InvoiceUploadModal } from "@/components/invoices/InvoiceUploadModal";
import { UploadCloud } from "lucide-react";

import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const {
    transactions,
    filteredTransactions,
    totalIncome,
    totalExpense,
    totalBalance,
    savingsRate,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    monthFilter,
    setMonthFilter,
    availableMonths,
    bankFilter,
    setBankFilter,
    availableBanks,
    setIsNewModalOpen,
    categoryBreakdown,
    subCategoryBreakdown,
    subCategoryFilter,
    setSubCategoryFilter,
    getCategoryIcon,
  } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [breakdownView, setBreakdownView] = useState<"mother" | "sub">("mother");

  const liveSelectedTransaction = transactions.find((t) => t.id === selectedTransaction?.id) || selectedTransaction;

  const handleRowClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Painel Financeiro
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Acompanhe o fluxo de caixa, saldo disponível e movimentações em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            <UploadCloud className="h-4 w-4 text-emerald-500" />
            Importar Fatura
          </Button>

          <Button
            variant="income"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => setIsNewModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Nova Transação
          </Button>

          <InvoiceUploadModal
            open={isInvoiceModalOpen}
            onOpenChange={setIsInvoiceModalOpen}
          />
        </div>
      </div>

      <SummaryCards 
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        savingsRate={savingsRate}
      />

      <DashboardFilters
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
        availableMonths={availableMonths}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        subCategoryFilter={subCategoryFilter}
        setSubCategoryFilter={setSubCategoryFilter}
        bankFilter={bankFilter}
        setBankFilter={setBankFilter}
        availableBanks={availableBanks}
      />

      <FinancialChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        <RecentTransactionsTable 
          transactions={filteredTransactions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRowClick={handleRowClick}
        />

        <div className="flex flex-col gap-6 w-full lg:col-span-1">
          <Card className="glass-card border-slate-200 dark:border-slate-800 h-fit self-start w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Análise de Gastos
              </CardTitle>
              <CardDescription className="text-xs">
                Distribuição de despesas
              </CardDescription>
              
              <div className="flex p-1 mt-4 bg-slate-100 dark:bg-slate-900/60 rounded-lg">
                <button
                  onClick={() => setBreakdownView("mother")}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${breakdownView === "mother" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Categorias
                </button>
                <button
                  onClick={() => setBreakdownView("sub")}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${breakdownView === "sub" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Subcategorias
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {(breakdownView === "mother" ? categoryBreakdown : subCategoryBreakdown).length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Nenhuma despesa registrada ainda.
                </div>
              ) : (
                (breakdownView === "mother" ? categoryBreakdown : subCategoryBreakdown).map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {getCategoryIcon(cat.name)} {cat.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatCurrency(cat.amount)} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900/60 p-3 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Total de saídas registradas</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(totalExpense)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TransactionDetailModal
        transaction={liveSelectedTransaction}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}

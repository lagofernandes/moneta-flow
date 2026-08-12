import React from "react";
import { Search, ArrowUpRight, ArrowDownLeft, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction, useTransactions } from "@/context/TransactionContext";
import { motion, AnimatePresence } from "framer-motion";

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onRowClick: (tx: Transaction) => void;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function RecentTransactionsTable({
  transactions,
  searchTerm,
  setSearchTerm,
  onRowClick
}: RecentTransactionsTableProps) {
  const { getCategoryIcon } = useTransactions();
  return (
    <Card className="lg:col-span-2 w-full glass-card border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
            Transações Recentes
          </CardTitle>
          <CardDescription className="text-xs">
            {transactions.length} movimentação(ões) encontrada(s)
          </CardDescription>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Nenhuma transação encontrada para os filtros selecionados.
          </div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onRowClick(tx)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900/80 transition-all cursor-pointer group shadow-sm dark:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                        tx.type === "INCOME"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {tx.type === "INCOME" ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: tx.color }}
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {getCategoryIcon(tx.category)} {tx.category}
                        </span>
                        {tx.bank && (
                          <>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">•</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              🏦 {tx.bank}
                            </span>
                          </>
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p
                        className={`text-sm font-semibold tracking-tight ${
                          tx.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(tx.amount)}
                      </p>
                      <div className="mt-1 flex justify-end">
                        <Badge variant={tx.status === "PAID" ? "secondary" : "outline"}>
                          {tx.status === "PAID" ? "Pago" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-opacity p-1">
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

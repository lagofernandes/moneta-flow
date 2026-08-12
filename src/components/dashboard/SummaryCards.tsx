import React from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export function SummaryCards({ totalBalance, totalIncome, totalExpense, savingsRate }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Saldo Total
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${totalBalance >= 0 ? "text-slate-900 dark:text-white" : "text-rose-500 dark:text-rose-400"}`}>
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Balanço consolidado ativo
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, delay: 0.1 }}>
        <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Receitas do Mês
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Entradas registradas
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, delay: 0.2 }}>
        <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Despesas do Mês
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Saídas registradas
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, delay: 0.3 }}>
        <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Economia Planejada
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <PiggyBank className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 tracking-tight">
              {savingsRate}% da renda
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">
              Calculado com base nas entradas
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

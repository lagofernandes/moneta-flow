"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExportCard } from "@/components/reports/ExportCard";
import { motion, type Variants } from "framer-motion";
import { BarChart3, PieChart, Trophy, Lock } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Relatórios
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Exporte seus dados e visualize análises detalhadas das suas finanças.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <ExportCard />
        </motion.div>

        {/* Placeholder: Fluxo de Caixa */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="h-full"
        >
          <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fluxo de Caixa
                </CardTitle>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Acompanhe a evolução de receitas vs despesas ao longo dos meses.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="h-24 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 relative group overflow-hidden">
                <Lock className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-full">
                  Em Breve (V2)
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Placeholder: Gastos por Categoria */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="h-full"
        >
          <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-purple-500/30">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Por Categoria
                </CardTitle>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <PieChart className="h-4 w-4" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Análise profunda e interativa de onde seu dinheiro está indo.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="h-24 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 relative group overflow-hidden">
                <Lock className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-full">
                  Em Breve (V2)
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Placeholder: Ranking de Estabelecimentos */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="h-full"
        >
          <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-rose-500/30">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Top Estabelecimentos
                </CardTitle>
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Descubra em quais locais você tem o maior volume de gastos.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="h-24 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 relative group overflow-hidden">
                <Lock className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-full">
                  Em Breve (V2)
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionContext";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, TrendingDown, Filter } from "lucide-react";

export function FinancialChart() {
  const { filteredTransactions } = useTransactions();
  const [chartType, setChartType] = useState<"timeline" | "category">("timeline");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timeline data grouped by date
  const timelineData = useMemo(() => {
    const map: Record<string, { date: string; fullDate: string; Receitas: number; Despesas: number }> = {};

    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((tx) => {
      const rawDate = tx.date;
      if (!map[rawDate]) {
        const parts = rawDate.split("-");
        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : rawDate;
        map[rawDate] = {
          date: formattedDate,
          fullDate: rawDate,
          Receitas: 0,
          Despesas: 0,
        };
      }

      const amt = Number(tx.amount);
      if (tx.type === "INCOME") {
        map[rawDate].Receitas += amt;
      } else {
        map[rawDate].Despesas += amt;
      }
    });

    return Object.values(map).map(item => ({
      ...item,
      Receitas: Math.max(0, item.Receitas),
      Despesas: Math.max(0, item.Despesas)
    }));
  }, [filteredTransactions]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const catMap: Record<string, { name: string; amount: number; color: string }> = {};

    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount);
      if (!catMap[tx.category]) {
        catMap[tx.category] = {
          name: tx.category,
          amount: 0,
          color: tx.color || "#64748b",
        };
      }
      catMap[tx.category].amount += amt;
    });

    return Object.values(catMap)
      .map(item => ({ ...item, amount: Math.max(0, item.amount) }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Total summary for filtered dataset
  const filteredSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === "INCOME") income += amt;
      else expense += amt;
    });
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  if (!mounted) {
    return (
      <Card className="glass-card border-slate-200 dark:border-slate-800 p-6 min-h-[360px] flex items-center justify-center">
        <div className="text-slate-400 text-xs animate-pulse">Carregando gráfico...</div>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-300">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              Análise Gráfica Dinâmica
            </CardTitle>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Filter className="h-3 w-3" /> {filteredTransactions.length} item(s)
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualização dos dados atualizada dinamicamente com base nos filtros ativos.
          </CardDescription>
        </div>

        {/* Mode Toggle Buttons & Summary */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setChartType("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === "timeline"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Linha do Tempo
            </button>
            <button
              onClick={() => setChartType("category")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === "category"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <PieChartIcon className="h-3.5 w-3.5" />
              Distribuição
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Quick Filtered Totals Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Entradas no Filtro</span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(filteredSummary.income)}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Saídas no Filtro</span>
            <p className="font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(filteredSummary.expense)}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Balanço Filtrado</span>
            <p className={`font-semibold ${filteredSummary.balance >= 0 ? "text-slate-800 dark:text-slate-200" : "text-rose-500"}`}>
              {formatCurrency(filteredSummary.balance)}
            </p>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs space-y-2">
            <Filter className="h-8 w-8 text-slate-500 opacity-50" />
            <p>Nenhuma movimentação corresponde aos filtros selecionados.</p>
            <p className="text-[11px] text-slate-500">Tente ajustar a busca por texto, categoria ou tipo.</p>
          </div>
        ) : chartType === "timeline" ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
                            Data: {label}
                          </p>
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}:
                              </span>
                              <span className="font-semibold">{formatCurrency(entry.value as number)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Bar dataKey="Receitas" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Despesas" fill="url(#expenseGradient)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{data.name}</p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(data.amount)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

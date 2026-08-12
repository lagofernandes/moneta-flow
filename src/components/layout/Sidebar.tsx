"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  FolderTree,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/context/TransactionContext";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Receitas", href: "/receitas", icon: ArrowUpRight },
  { label: "Despesas", href: "/despesas", icon: ArrowDownLeft },
  { label: "Categorias", href: "/categorias", icon: FolderTree },
  { label: "Relatórios", href: "/relatorios", icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { savingsRate } = useTransactions();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-white/40 dark:bg-slate-950/40 p-4 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-500 dark:text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/5 p-4 text-xs text-slate-700 dark:text-slate-300">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Resumo da Conta</span>
        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
          Você já economizou {savingsRate}% da sua renda planejada este mês!
        </p>
      </div>
    </aside>
  );
}

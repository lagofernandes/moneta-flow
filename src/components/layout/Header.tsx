"use client";

import React from "react";
import { Wallet, Bell, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTransactions } from "@/context/TransactionContext";
import { useTheme } from "@/context/ThemeContext";

function getInitials(name?: string | null) {
  if (!name) return "US";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export function Header() {
  const { setIsSettingsOpen } = useTransactions();
  const { theme } = useTheme();
  const { data: session } = useSession();

  const user = session?.user;
  const firstName = user?.name ? user.name.split(" ")[0] : "Usuário";
  const initials = getInitials(user?.name);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Moneta Flow
            </span>
            <span className="hidden sm:inline-block ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
          </button>

          <div
            className="flex items-center gap-2 pl-2 border-l border-border/50 cursor-pointer"
            onClick={() => setIsSettingsOpen(true)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold border border-slate-300 dark:border-slate-700 text-xs hover:border-emerald-500 transition-colors">
              {initials}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{firstName}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Premium</span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sair"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

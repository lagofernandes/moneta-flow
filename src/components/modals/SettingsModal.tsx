"use client";

import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTransactions } from "@/context/TransactionContext";
import { useTheme } from "@/context/ThemeContext";
import { Settings, Moon, Sun, Shield, Bell, User, Monitor } from "lucide-react";

export function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen } = useTransactions();
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogHeader>
        <div className="flex items-center gap-2.5 text-primary">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Settings className="h-5 w-5" />
          </div>
          <DialogTitle>Configurações do Sistema</DialogTitle>
        </div>
        <DialogDescription>
          Personalize as preferências visuais, tema e dados da sua conta no Moneta Flow.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-2">
        {/* Theme Settings Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Aparência & Tema
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-slate-800 dark:text-amber-400">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Modo Escuro (Dark Mode)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Alternar a paleta de cores para descanso visual
                </p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </div>

        {/* Account Info Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Perfil do Usuário
          </h3>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-700 text-sm">
              VF
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Vinicius Fernandes</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">vinicius@monetaflow.com • Conta Pro</p>
            </div>
          </div>
        </div>

        {/* Currency & Notifications Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Preferências Gerais
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500">Moeda Padrão</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Real Brasileiro (BRL R$)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500">Fuso Horário</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">America/Sao_Paulo</p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
          Concluído
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

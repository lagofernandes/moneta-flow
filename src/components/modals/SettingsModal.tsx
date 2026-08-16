"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionContext";
import { useTheme } from "@/context/ThemeContext";
import { Settings, Moon, Sun, Download, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

function getInitials(name?: string | null) {
  if (!name) return "US";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen } = useTransactions();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { data: session, update } = useSession();

  const user = session?.user;

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user && isSettingsOpen) {
      setName(user.name || "");
      setCurrency(user.currency || "BRL");
      setTimezone(user.timezone || "America/Sao_Paulo");
      
      // Reset password fields and messages
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage({ text: "", type: "" });
    }
  }, [user, isSettingsOpen]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currency, timezone }),
      });
      if (!res.ok) throw new Error("Erro ao salvar perfil");
      
      await update({ name, currency, timezone });
      setMessage({ text: "Perfil atualizado com sucesso!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage({ text: "Preencha todas as senhas", type: "error" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage({ text: "A nova senha e a confirmação não coincidem", type: "error" });
      return;
    }
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/users/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao alterar senha");
      
      setMessage({ text: "Senha alterada com sucesso!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "system">("profile");

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-primary">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Configurações da Conta</DialogTitle>
              <DialogDescription className="mt-1">
                Gerencie seus dados e preferências do Moneta Flow.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Custom Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg mt-4 mb-2 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
              activeTab === "profile" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
              activeTab === "preferences" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Preferências
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
              activeTab === "system" 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Sistema
          </button>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
            {message.text}
          </div>
        )}

        <div className="py-2 min-h-[320px]">
          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Dados Pessoais
                </h3>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 text-lg">
                    {getInitials(user?.name)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 ml-1">Nome de Exibição</label>
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="h-9" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 ml-1">E-mail Cadastrado</label>
                      <Input 
                        value={user?.email || ""} 
                        readOnly
                        disabled
                        className="h-9 bg-slate-100 dark:bg-slate-900 text-slate-500" 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-b border-border/50 pb-6">
                  <Button size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Atualizar Perfil
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Segurança
                </h3>
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 space-y-3">
                  <Input 
                    type="password" 
                    placeholder="Senha atual" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    placeholder="Nova senha (min. 6 caracteres)" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    placeholder="Confirme a nova senha" 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  />
                  <div className="flex justify-end pt-2">
                    <Button size="sm" variant="secondary" onClick={handleChangePassword} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Regionalização
                </h3>
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Moeda Padrão</label>
                    <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="BRL">Real Brasileiro (BRL R$)</option>
                      <option value="USD">Dólar Americano (USD $)</option>
                      <option value="EUR">Euro (EUR €)</option>
                    </Select>
                    <p className="text-xs text-slate-500">A moeda será usada para exibir todos os seus saldos.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fuso Horário</label>
                    <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                      <option value="America/New_York">Nova York (EST)</option>
                      <option value="Europe/London">Londres (GMT)</option>
                    </Select>
                    <p className="text-xs text-slate-500">O fuso define como as datas das transações são exibidas.</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Preferências
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM */}
          {activeTab === "system" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Aparência
                </h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-slate-800 dark:text-amber-400">
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Modo Escuro (Dark Mode)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Alternar a paleta de cores
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
    </Dialog>
  );
}

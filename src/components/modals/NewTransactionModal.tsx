"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionContext";
import { Plus, DollarSign, Calendar as CalendarIcon, Tag } from "lucide-react";

export function NewTransactionModal() {
  const { isNewModalOpen, setIsNewModalOpen, addTransaction } = useTransactions();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("Alimentação");
  const [status, setStatus] = useState<"PAID" | "PENDING">("PAID");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("A descrição é obrigatória.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }

    addTransaction({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      status,
      date,
    });

    // Reset and close
    setDescription("");
    setAmount("");
    setError("");
    setIsNewModalOpen(false);
  };

  return (
    <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
      <DialogHeader>
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Plus className="h-5 w-5" />
          </div>
          <DialogTitle>Nova Transação</DialogTitle>
        </div>
        <DialogDescription>
          Preencha os detalhes abaixo para registrar uma nova entrada ou saída no seu fluxo de caixa.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              type === "EXPENSE"
                ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Despesa (Saída)
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              type === "INCOME"
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Receita (Entrada)
          </button>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Descrição</label>
          <Input
            placeholder="Ex: Supermercado, Salário, Internet"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500 text-sm">R$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Data</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Categoria</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Alimentação">Alimentação</option>
              <option value="Salário">Salário</option>
              <option value="Moradia">Moradia</option>
              <option value="Freelance">Freelance</option>
              <option value="Utilidades">Utilidades</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Lazer">Lazer</option>
              <option value="Outros">Outros</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as "PAID" | "PENDING")}>
              <option value="PAID">Pago / Concluído</option>
              <option value="PENDING">Pendente</option>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="income">
            Salvar Transação
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

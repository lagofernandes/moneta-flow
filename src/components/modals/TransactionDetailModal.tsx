"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Transaction, useTransactions } from "@/context/TransactionContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar, Tag, CheckCircle2, Clock, Pencil, Save } from "lucide-react";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailModalProps) {
  const { deleteTransaction, updateTransaction, getCategoryIcon } = useTransactions();

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("Alimentação");
  const [bank, setBank] = useState("");
  const [status, setStatus] = useState<"PAID" | "PENDING">("PAID");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setBank(transaction.bank || "");
      setStatus(transaction.status);
      setDate(transaction.date);
    }
    setIsEditing(false);
    setError("");
  }, [transaction, open]);

  if (!transaction) return null;

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onOpenChange(false);
  };

  const handleStartEdit = () => {
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setBank(transaction.bank || "");
    setStatus(transaction.status);
    setDate(transaction.date);
    setError("");
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
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

    updateTransaction(transaction.id, {
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      bank: bank.trim() || undefined,
      status,
      date,
    });

    setIsEditing(false);
    setError("");
  };

  const isIncome = isEditing ? type === "INCOME" : transaction.type === "INCOME";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isIncome
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            }`}
          >
            {isIncome ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
          </div>
          <div>
            <DialogTitle>
              {isEditing ? "Editar Transação" : transaction.description}
            </DialogTitle>
            <DialogDescription className="mt-0.5">
              {isEditing
                ? "Modifique os campos abaixo e clique em salvar."
                : isIncome
                ? "Movimentação de Entrada (Receita)"
                : "Movimentação de Saída (Despesa)"}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400">
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

          {/* Category & Bank */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Categoria</label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Alimentação">🍔 Alimentação</option>
                <option value="Salário">💼 Salário</option>
                <option value="Moradia">🏠 Moradia</option>
                <option value="Freelance">💻 Freelance</option>
                <option value="Utilidades">⚡ Utilidades</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Saúde">💊 Saúde</option>
                <option value="Lazer">🎬 Lazer</option>
                <option value="Outros">🏷️ Outros</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Banco / Cartão</label>
              <Select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="">Nenhum / Desconhecido</option>
                <option value="Itaú">Itaú</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Nubank">Nubank</option>
                <option value="Bradesco">Bradesco</option>
                <option value="C6 Bank">C6 Bank</option>
                <option value="Inter">Inter</option>
                <option value="Santander">Santander</option>
                <option value="Banco do Brasil">Banco do Brasil</option>
                <option value="Caixa">Caixa</option>
                <option value="Outros">Outros</option>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as "PAID" | "PENDING")}>
              <option value="PAID">Pago / Concluído</option>
              <option value="PENDING">Pendente</option>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="income" className="gap-1.5">
              <Save className="h-4 w-4" /> Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      ) : (
        <>
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Valor da Transação</span>
              <span className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
                  transaction.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}>
                <div className={`p-2 rounded-lg text-lg flex items-center justify-center shrink-0 ${
                  transaction.type === "INCOME" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                }`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                {transaction.type === "INCOME" ? "+" : "-"} {formatCurrency(transaction.amount)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Categoria
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {getCategoryIcon(transaction.category)} {transaction.category}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  🏦 Banco
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{transaction.bank || "Outros"}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Data
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(transaction.date)}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                {transaction.status === "PAID" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                )}
                Status da Operação
              </span>
              <Badge variant={transaction.status === "PAID" ? "secondary" : "outline"}>
                {transaction.status === "PAID" ? "Pago" : "Pendente"}
              </Badge>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 gap-2 w-full sm:w-auto"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" /> Excluir Transação
            </Button>
            <Button
              type="button"
              variant="income"
              className="gap-1.5 w-full sm:w-auto"
              onClick={handleStartEdit}
            >
              <Pencil className="h-3.5 w-3.5" /> Editar Transação
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
}

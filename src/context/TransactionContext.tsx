"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string;
  icon: string;
  parentId: string | null;
  children?: Category[];
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  status: "PAID" | "PENDING";
  category: string;
  parentCategory?: string;
  bank?: string;
  color: string;
  date: string;
}



const initialTransactions: Transaction[] = [
  // Maio 2026
  {
    id: "1",
    description: "Salário Mensal - Tech Corp",
    amount: 8500.0,
    type: "INCOME",
    status: "PAID",
    category: "Salário",
    color: "#10b981",
    date: "2026-05-05",
  },
  {
    id: "2",
    description: "Supermercado Pão de Açúcar",
    amount: 720.4,
    type: "EXPENSE",
    status: "PAID",
    category: "Alimentação",
    color: "#f59e0b",
    date: "2026-05-08",
  },
  {
    id: "3",
    description: "Aluguel & Condomínio",
    amount: 2800.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Moradia",
    color: "#ef4444",
    date: "2026-05-10",
  },
  {
    id: "4",
    description: "Consultoria UI/UX Design",
    amount: 2100.0,
    type: "INCOME",
    status: "PAID",
    category: "Freelance",
    color: "#8b5cf6",
    date: "2026-05-14",
  },
  {
    id: "5",
    description: "Abastecimento Posto Shell",
    amount: 240.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Transporte",
    color: "#3b82f6",
    date: "2026-05-18",
  },
  {
    id: "6",
    description: "Farmácia Drogasil",
    amount: 135.9,
    type: "EXPENSE",
    status: "PAID",
    category: "Saúde",
    color: "#ec4899",
    date: "2026-05-22",
  },
  {
    id: "7",
    description: "Cinema & Jantar em Família",
    amount: 190.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Lazer",
    color: "#14b8a6",
    date: "2026-05-28",
  },

  // Junho 2026
  {
    id: "8",
    description: "Salário Mensal - Tech Corp",
    amount: 8500.0,
    type: "INCOME",
    status: "PAID",
    category: "Salário",
    color: "#10b981",
    date: "2026-06-05",
  },
  {
    id: "9",
    description: "Feira Orgânica da Semana",
    amount: 310.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Alimentação",
    color: "#f59e0b",
    date: "2026-06-07",
  },
  {
    id: "10",
    description: "Aluguel & Condomínio",
    amount: 2800.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Moradia",
    color: "#ef4444",
    date: "2026-06-10",
  },
  {
    id: "11",
    description: "Manutenção & Revisão Veículo",
    amount: 550.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Transporte",
    color: "#3b82f6",
    date: "2026-06-15",
  },
  {
    id: "12",
    description: "Projeto E-commerce Shopify",
    amount: 4500.0,
    type: "INCOME",
    status: "PAID",
    category: "Freelance",
    color: "#8b5cf6",
    date: "2026-06-20",
  },
  {
    id: "13",
    description: "Internet Fibra Óptica",
    amount: 159.9,
    type: "EXPENSE",
    status: "PAID",
    category: "Utilidades",
    color: "#6366f1",
    date: "2026-06-23",
  },
  {
    id: "14",
    description: "Mensalidade Academia",
    amount: 120.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Saúde",
    color: "#ec4899",
    date: "2026-06-27",
  },

  // Julho 2026
  {
    id: "15",
    description: "Salário Mensal - Tech Corp",
    amount: 8500.0,
    type: "INCOME",
    status: "PAID",
    category: "Salário",
    color: "#10b981",
    date: "2026-07-05",
  },
  {
    id: "16",
    description: "Almoço de Negócios",
    amount: 285.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Lazer",
    color: "#14b8a6",
    date: "2026-07-08",
  },
  {
    id: "17",
    description: "Aluguel & Condomínio",
    amount: 2800.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Moradia",
    color: "#ef4444",
    date: "2026-07-10",
  },
  {
    id: "18",
    description: "Supermercado Carrefour",
    amount: 642.5,
    type: "EXPENSE",
    status: "PAID",
    category: "Alimentação",
    color: "#f59e0b",
    date: "2026-07-12",
  },
  {
    id: "19",
    description: "Projeto Freelance Web App",
    amount: 3200.0,
    type: "INCOME",
    status: "PAID",
    category: "Freelance",
    color: "#8b5cf6",
    date: "2026-07-18",
  },
  {
    id: "20",
    description: "Plano de Saúde Familiar",
    amount: 680.0,
    type: "EXPENSE",
    status: "PAID",
    category: "Saúde",
    color: "#ec4899",
    date: "2026-07-22",
  },
  {
    id: "21",
    description: "Conta de Energia Coelba",
    amount: 215.3,
    type: "EXPENSE",
    status: "PENDING",
    category: "Utilidades",
    color: "#6366f1",
    date: "2026-07-25",
  },
  {
    id: "22",
    description: "Assinatura de Ferramentas Cloud",
    amount: 99.0,
    type: "EXPENSE",
    status: "PENDING",
    category: "Outros",
    color: "#64748b",
    date: "2026-07-27",
  },
];

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  filteredTransactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "color"> & { color?: string }) => void;
  updateTransaction: (id: string, updatedTx: Partial<Omit<Transaction, "id">>) => void;
  deleteTransaction: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  subCategoryFilter: string;
  setSubCategoryFilter: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  monthFilter: string;
  setMonthFilter: (month: string) => void;
  bankFilter: string;
  setBankFilter: (bank: string) => void;
  availableMonths: { value: string; label: string }[];
  availableBanks: string[];
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  savingsRate: number;
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  categoryBreakdown: { name: string; amount: number; percentage: number; color: string }[];
  subCategoryBreakdown: { name: string; amount: number; percentage: number; color: string }[];
  getCategoryIcon: (name: string) => string;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [subCategoryFilter, setSubCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [bankFilter, setBankFilter] = useState("ALL");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch transactions from PostgreSQL API on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        const [txRes, catRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/categories")
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData);
        } else {
          setTransactions(initialTransactions);
        }
      } catch (error) {
        console.error("Error loading data from API:", error);
        setTransactions(initialTransactions);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const availableMonths = useMemo(() => {
    const monthMap = new Map<string, string>();
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    transactions.forEach((tx) => {
      if (tx.date && tx.date.length >= 7) {
        const yearMonth = tx.date.substring(0, 7);
        if (!monthMap.has(yearMonth)) {
          const [year, month] = yearMonth.split("-");
          const monthIndex = parseInt(month, 10) - 1;
          const label = `${monthNames[monthIndex] || month} ${year}`;
          monthMap.set(yearMonth, label);
        }
      }
    });

    return Array.from(monthMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([value, label]) => ({ value, label }));
  }, [transactions]);

  const availableBanks = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => {
      if (tx.bank && tx.bank.trim().length > 0) {
        set.add(tx.bank.trim());
      }
    });
    return Array.from(set).sort();
  }, [transactions]);
  const getCategoryDetails = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    const parentCat = cat?.parentId ? categories.find((c) => c.id === cat.parentId) : cat;
    return {
      color: cat?.color || parentCat?.color || "#64748b",
      parentCategory: parentCat?.name || categoryName,
    };
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    return cat?.icon || "🏷️";
  };

  const addTransaction = async (newTx: Omit<Transaction, "id" | "color"> & { color?: string }) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTx),
      });

      if (res.ok) {
        const created: Transaction = await res.json();
        setTransactions((prev) => [created, ...prev]);
      } else {
        const details = getCategoryDetails(newTx.category);
        const fallback: Transaction = {
          ...newTx,
          id: Date.now().toString(),
          color: newTx.color || details.color,
          parentCategory: newTx.parentCategory || details.parentCategory,
        };
        setTransactions((prev) => [fallback, ...prev]);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      const details = getCategoryDetails(newTx.category);
      const fallback: Transaction = {
        ...newTx,
        id: Date.now().toString(),
        color: newTx.color || details.color,
        parentCategory: newTx.parentCategory || details.parentCategory,
      };
      setTransactions((prev) => [fallback, ...prev]);
    }
  };

  const updateTransaction = async (id: string, updatedTx: Partial<Omit<Transaction, "id">>) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTx),
      });

      if (res.ok) {
        const updatedItem: Transaction = await res.json();
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === id ? updatedItem : tx))
        );
      } else {
        setTransactions((prev) =>
          prev.map((tx) => {
            if (tx.id !== id) return tx;
            const category = updatedTx.category || tx.category;
            const details = getCategoryDetails(category);
            const parentCategory = updatedTx.parentCategory || details.parentCategory;
            const color = updatedTx.color || details.color || tx.color;
            return { ...tx, ...updatedTx, parentCategory, color };
          })
        );
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      setTransactions((prev) =>
        prev.map((tx) => {
          if (tx.id !== id) return tx;
          const category = updatedTx.category || tx.category;
          const details = getCategoryDetails(category);
          const parentCategory = updatedTx.parentCategory || details.parentCategory;
          const color = updatedTx.color || details.color || tx.color;
          return { ...tx, ...updatedTx, parentCategory, color };
        })
      );
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    }
  };


  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.parentCategory && tx.parentCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.bank && tx.bank.toLowerCase().includes(searchTerm.toLowerCase()));
      const motherCategory = tx.parentCategory || tx.category;
      const matchesCategory = categoryFilter === "ALL" || motherCategory === categoryFilter;
      const matchesSubCategory = subCategoryFilter === "ALL" || tx.category === subCategoryFilter;
      const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
      const matchesMonth = monthFilter === "ALL" || tx.date.startsWith(monthFilter);
      const matchesBank = bankFilter === "ALL" || tx.bank === bankFilter;
      return matchesSearch && matchesCategory && matchesSubCategory && matchesType && matchesMonth && matchesBank;
    });
  }, [transactions, searchTerm, categoryFilter, subCategoryFilter, typeFilter, monthFilter, bankFilter]);

  const { totalIncome, totalExpense, totalBalance, savingsRate, categoryBreakdown, subCategoryBreakdown } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const motherCatMap: Record<string, { amount: number; color: string }> = {};
    const subCatMap: Record<string, { amount: number; color: string }> = {};

    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === "INCOME") {
        income += amt;
      } else {
        expense += amt;
        // Mother category grouping
        const cat = categories.find((c) => c.name === tx.category);
        const parentCat = cat?.parentId ? categories.find((c) => c.id === cat.parentId) : cat;
        const motherCat = tx.parentCategory || parentCat?.name || tx.category;
        
        if (!motherCatMap[motherCat]) {
          motherCatMap[motherCat] = { amount: 0, color: parentCat?.color || cat?.color || tx.color };
        }
        motherCatMap[motherCat].amount += amt;

        // Subcategory grouping
        if (!subCatMap[tx.category]) {
          subCatMap[tx.category] = { amount: 0, color: tx.color };
        }
        subCatMap[tx.category].amount += amt;
      }
    });

    const balance = income - expense;
    const savings = income > 0 ? Math.max(0, Math.round((balance / income) * 100)) : 0;

    const breakdown = Object.entries(motherCatMap).map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage: expense > 0 ? Math.round((data.amount / expense) * 100) : 0,
      color: data.color,
    })).sort((a, b) => b.amount - a.amount);

    const subBreakdown = Object.entries(subCatMap).map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage: expense > 0 ? Math.round((data.amount / expense) * 100) : 0,
      color: data.color,
    })).sort((a, b) => b.amount - a.amount);

    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: balance,
      savingsRate: savings,
      categoryBreakdown: breakdown,
      subCategoryBreakdown: subBreakdown,
    };
  }, [filteredTransactions, categories]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        filteredTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        subCategoryFilter,
        setSubCategoryFilter,
        typeFilter,
        setTypeFilter,
        monthFilter,
        setMonthFilter,
        bankFilter,
        setBankFilter,
        availableMonths,
        availableBanks,
        totalIncome,
        totalExpense,
        totalBalance,
        savingsRate,
        isNewModalOpen,
        setIsNewModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        categoryBreakdown,
        subCategoryBreakdown,
        getCategoryIcon,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}

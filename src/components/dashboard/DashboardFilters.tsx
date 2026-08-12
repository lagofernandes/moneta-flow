import React, { useMemo } from "react";
import { Filter, FilterX } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionContext";

interface DashboardFiltersProps {
  monthFilter: string;
  setMonthFilter: (val: string) => void;
  availableMonths: { label: string; value: string }[];
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  subCategoryFilter: string;
  setSubCategoryFilter: (val: string) => void;
  bankFilter: string;
  setBankFilter: (val: string) => void;
  availableBanks: string[];
}

export function DashboardFilters({
  monthFilter, setMonthFilter, availableMonths,
  typeFilter, setTypeFilter,
  categoryFilter, setCategoryFilter,
  subCategoryFilter, setSubCategoryFilter,
  bankFilter, setBankFilter, availableBanks
}: DashboardFiltersProps) {
  const { categories } = useTransactions();
  
  const motherCategories = useMemo(() => categories.filter(c => c.parentId === null), [categories]);
  
  const currentSubCategories = useMemo(() => {
    const parent = motherCategories.find(c => c.name === categoryFilter);
    if (!parent) return [];
    return categories.filter(c => c.parentId === parent.id);
  }, [categories, categoryFilter, motherCategories]);

  const hasActiveFilters = monthFilter !== "ALL" || typeFilter !== "ALL" || categoryFilter !== "ALL" || subCategoryFilter !== "ALL" || bankFilter !== "ALL";

  return (
    <div className="relative z-50 flex flex-col sm:flex-row sm:items-center justify-start gap-4 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
      <div 
        onClick={() => {
          setMonthFilter("ALL");
          setTypeFilter("ALL");
          setCategoryFilter("ALL");
          setSubCategoryFilter("ALL");
          setBankFilter("ALL");
        }}
        title="Limpar todos os filtros"
        className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
      >
        {hasActiveFilters ? (
          <FilterX className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
        ) : (
          <Filter className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
        )}
        <span className="border-b border-transparent hover:border-emerald-500 border-dashed pb-0.5">
          {hasActiveFilters ? "Limpar filtros" : "Filtrar por:"}
        </span>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
        <Select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="w-full sm:w-44 h-9 text-xs"
        >
          <option value="ALL">Todos os Meses</option>
          {availableMonths.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </Select>

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-40 h-9 text-xs"
        >
          <option value="ALL">Todos os Tipos</option>
          <option value="INCOME">Receitas (Entradas)</option>
          <option value="EXPENSE">Despesas (Saídas)</option>
        </Select>

        <Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSubCategoryFilter("ALL");
          }}
          className="w-full sm:w-40 h-9 text-xs"
        >
          <option value="ALL">Todas Categorias</option>
          {motherCategories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
          ))}
        </Select>

        {categoryFilter !== "ALL" && currentSubCategories.length > 0 && (
          <Select
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
            className="w-full sm:w-40 h-9 text-xs"
          >
            <option value="ALL">Todas Subcategorias</option>
            {currentSubCategories.map((sub) => (
              <option key={sub.id} value={sub.name}>{sub.icon} {sub.name}</option>
            ))}
          </Select>
        )}

        <Select
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
          className="w-full sm:w-44 h-9 text-xs"
        >
          <option value="ALL">Todos os Bancos</option>
          {availableBanks.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}

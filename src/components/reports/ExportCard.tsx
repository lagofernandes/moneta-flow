"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export function ExportCard() {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" }>({ text: "", type: "success" });

  const handleExportCSV = async () => {
    setIsExporting(true);
    setMessage({ text: "", type: "success" });
    try {
      const res = await fetch("/api/export");
      
      if (!res.ok) {
        let serverError = "Erro ao exportar dados";
        try {
          const json = await res.json();
          if (json?.error) {
            serverError = json.error;
          }
        } catch {
          // ignore
        }

        if (res.status === 404) {
          setMessage({ text: serverError || "Nenhuma transação encontrada para exportação.", type: "warning" });
          return;
        }

        throw new Error(serverError);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "moneta_flow_export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setMessage({ text: "Exportação concluída com sucesso!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Erro ao gerar arquivo CSV", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="glass-card border-slate-200 dark:border-slate-800 relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-blue-500/30">
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Extrato Completo
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Download className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          Baixe todas as suas transações e dados financeiros em um arquivo estruturado pronto para Excel.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <div className="min-h-24 flex flex-col justify-center gap-2">
          <Button 
            variant="outline" 
            className="w-full h-11 justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 font-medium transition-all duration-200" 
            onClick={handleExportCSV} 
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Gerar Arquivo (.csv)
          </Button>
          {message.text && (
            <div className={`p-2.5 text-center rounded-lg text-xs font-medium animate-in fade-in slide-in-from-bottom-1 ${
              message.type === "success" 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                : message.type === "warning"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

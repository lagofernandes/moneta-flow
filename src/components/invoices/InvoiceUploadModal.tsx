"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, FileSpreadsheet, Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { processInvoiceFileAction } from "@/app/actions/invoices";
import { CategorizedInvoiceItem } from "@/lib/invoices/categorizer";
import { InvoiceStagingTable } from "./InvoiceStagingTable";
import { useTransactions } from "@/context/TransactionContext";

interface InvoiceUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceUploadModal({ open, onOpenChange }: InvoiceUploadModalProps) {
  const { availableMonths } = useTransactions();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<CategorizedInvoiceItem[] | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState("");
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive loading messages when processing takes long
  useEffect(() => {
    if (isProcessing) {
      setProcessingStatus("Analisando fatura...");

      const timers = [
        setTimeout(() => setProcessingStatus("Ainda analisando... A IA está demorando um pouco mais que o normal."), 8000),
        setTimeout(() => setProcessingStatus("Tentando novamente a análise com IA... Aguarde mais um momento."), 20000),
        setTimeout(() => setProcessingStatus("Utilizando extração local como alternativa. Quase lá..."), 40000),
      ];

      return () => {
        timers.forEach(clearTimeout);
        setProcessingStatus("");
      };
    }
  }, [isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleProcessFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await processInvoiceFileAction(formData);

      if (result.success && result.items) {
        setExtractedItems(result.items);
        setWarnings(result.warnings || []);
      } else {
        setError(result.error || "Erro ao processar arquivo da fatura.");
      }
    } catch (err: any) {
      setError(err?.message || "Erro inesperado durante a leitura do arquivo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSuccess = (count: number) => {
    setImportedCount(count);
    // Reload page or trigger transaction context refresh
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const resetModal = () => {
    setFile(null);
    setIsProcessing(false);
    setError(null);
    setExtractedItems(null);
    setImportedCount(null);
    setWarnings([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetModal();
        onOpenChange(val);
      }}
      className={extractedItems && importedCount === null ? "max-w-7xl" : "max-w-lg"}
    >
      <div className="p-1 max-w-full w-full">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-500">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle>Importar Fatura do Cartão</DialogTitle>
          </div>
          <DialogDescription>
            Envie sua fatura em PDF, OFX ou CSV. A IA irá extrair cada lançamento e classificar a categoria automaticamente.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload Dropzone or Loading Skeleton */}
        {!extractedItems && importedCount === null && (
          <div className="mt-4 flex flex-col gap-4">
            {isProcessing ? (
              <div className="border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-300">
                      {processingStatus || "Analisando fatura..."}
                    </span>
                  </div>
                </div>
                {/* Skeletons */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-2 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all ${file
                  ? "border-emerald-500/60 bg-emerald-500/5"
                  : "border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
                  }`}
              >
                <input
                  type="file"
                  id="invoice-file-input"
                  accept=".pdf,.ofx,.csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="p-4 rounded-full bg-slate-200/60 dark:bg-slate-800/80 mb-3 text-slate-600 dark:text-slate-300">
                  <UploadCloud className="w-8 h-8 text-emerald-500" />
                </div>

                {file ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>{file.name}</span>
                    <span className="text-xs text-slate-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Arraste sua fatura aqui ou{" "}
                      <label
                        htmlFor="invoice-file-input"
                        className="text-emerald-500 hover:underline cursor-pointer font-semibold"
                      >
                        clique para selecionar
                      </label>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Suporta arquivos PDF (Nubank, Itaú, Bradesco, C6, Inter), OFX e CSV.
                    </p>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isProcessing && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> PDF
                  </span>
                  <span className="flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> OFX / CSV
                  </span>
                </div>

                <Button
                  onClick={handleProcessFile}
                  disabled={!file}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Sparkles className="w-4 h-4" /> Processar Fatura
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Staging Area */}
        {extractedItems && importedCount === null && (
          <div className="mt-4">
            <InvoiceStagingTable
              items={extractedItems}
              fileName={file?.name || "Fatura"}
              onConfirmSuccess={handleConfirmSuccess}
              onCancel={resetModal}
              warnings={warnings}
            />
          </div>
        )}

        {/* Step 3: Success Screen */}
        {importedCount !== null && (
          <div className="mt-6 py-8 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              Importação Concluída!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {importedCount} lançamentos foram adicionados com sucesso ao seu fluxo de caixa. O sistema aprendeu suas escolhas de categorias para faturas futuras.
            </p>
            <p className="text-xs text-slate-400 animate-pulse">
              Atualizando seu extrato...
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}

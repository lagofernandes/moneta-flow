import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { TransactionProvider } from "@/context/TransactionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NewTransactionModal } from "@/components/modals/NewTransactionModal";
import { SettingsModal } from "@/components/modals/SettingsModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moneta Flow | Gestão Financeira Pessoal",
  description: "Controle financeiro pessoal inteligente para lançamento de receitas e despesas, categorização e saldos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200`}>
        <ThemeProvider>
          <TransactionProvider>
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
            <NewTransactionModal />
            <SettingsModal />
          </TransactionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

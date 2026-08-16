import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { TransactionProvider } from "@/context/TransactionContext";
import { NewTransactionModal } from "@/components/modals/NewTransactionModal";
import { SettingsModal } from "@/components/modals/SettingsModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}

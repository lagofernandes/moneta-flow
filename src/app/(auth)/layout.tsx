import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Moneta Flow",
  description: "Faça login na sua conta Moneta Flow para acessar o dashboard financeiro.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased">
      {children}
    </div>
  );
}

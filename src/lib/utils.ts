import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export const SUBCATEGORIES_MAP: Record<string, string[]> = {
  "Transporte": ["Combustível", "Aplicativos", "Pedágio & Estacionamento", "Manutenção & Peças", "Documentação & Seguro"],
  "Moradia": ["Aluguel / Financiamento", "Condomínio", "Contas Básicas", "Internet & Conectividade", "Limpeza & Organização", "Reparos & Manutenção", "Casa & Utensílios"],
  "Alimentação": ["Supermercado", "Restaurantes & Bares", "Delivery & Lanches"],
  "Pessoal & Saúde": ["Saúde & Cuidados", "Exercícios & Esportes", "Autocuidado & Estética", "Vestuário"],
  "Lazer & Estilo de Vida": ["Eventos & Shows", "Viagens & Férias", "Assinaturas & Streaming", "Hobbies", "Presentes & Doações"],
  "Educação & Desenvolvimento": ["Cursos & Treinamentos", "Livros & Materiais"],
  "Serviços Financeiros & Investimentos": ["Tarifas & Anuidade", "Investimentos"]
};

export function getMotherCategory(categoryName: string): string {
  if (!categoryName) return "Outros";
  const name = categoryName.trim();
  
  if (Object.keys(SUBCATEGORIES_MAP).includes(name)) return name;
  if (["Salário", "Freelance", "Outros"].includes(name)) return name;

  for (const [mother, children] of Object.entries(SUBCATEGORIES_MAP)) {
    if (children.includes(name)) {
      return mother;
    }
  }
  
  return name;
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  // Mothers
  "Transporte": "🚗",
  "Moradia": "🏠",
  "Alimentação": "🍔",
  "Pessoal & Saúde": "💊",
  "Lazer & Estilo de Vida": "🎉",
  "Educação & Desenvolvimento": "📚",
  "Serviços Financeiros & Investimentos": "🏦",
  "Salário": "💵",
  "Freelance": "💻",
  "Outros": "🏷️",
  // Children
  "Combustível": "⛽",
  "Aplicativos": "🚗",
  "Pedágio & Estacionamento": "🅿️",
  "Manutenção & Peças": "🛠️",
  "Documentação & Seguro": "📄",
  "Aluguel / Financiamento": "🗝️",
  "Condomínio": "🏢",
  "Contas Básicas": "💡",
  "Internet & Conectividade": "🌐",
  "Limpeza & Organização": "🧹",
  "Reparos & Manutenção": "🛠️",
  "Casa & Utensílios": "🛋️",
  "Supermercado": "🛒",
  "Restaurantes & Bares": "🍽️",
  "Delivery & Lanches": "🛵",
  "Saúde & Cuidados": "🩺",
  "Exercícios & Esportes": "⚽",
  "Autocuidado & Estética": "💈",
  "Vestuário": "👕",
  "Eventos & Shows": "🎟️",
  "Viagens & Férias": "✈️",
  "Assinaturas & Streaming": "📺",
  "Hobbies": "🎨",
  "Presentes & Doações": "🎁",
  "Cursos & Treinamentos": "🎓",
  "Livros & Materiais": "📖",
  "Tarifas & Anuidade": "💳",
  "Investimentos": "📈"
};

export function getCategoryEmoji(categoryName: string): string {
  if (!categoryName) return "🏷️";
  const clean = categoryName.trim();
  if (CATEGORY_EMOJIS[clean]) return CATEGORY_EMOJIS[clean];

  // Match the child name if passed as "Mãe > Filha"
  if (clean.includes(">")) {
    const childName = clean.split(">").pop()?.trim();
    if (childName && CATEGORY_EMOJIS[childName]) return CATEGORY_EMOJIS[childName];
  }

  const lower = clean.toLowerCase();
  if (lower.includes("aliment") || lower.includes("mercado") || lower.includes("restaurante") || lower.includes("comida")) return "🍔";
  if (lower.includes("transp") || lower.includes("uber") || lower.includes("posto") || lower.includes("combust")) return "🚗";
  if (lower.includes("morad") || lower.includes("aluguel") || lower.includes("casa")) return "🏠";
  if (lower.includes("saud") || lower.includes("farmac") || lower.includes("medic") || lower.includes("hosp")) return "💊";
  if (lower.includes("lazer") || lower.includes("cinem") || lower.includes("viagem") || lower.includes("shows")) return "🎉";
  if (lower.includes("utilidad") || lower.includes("luz") || lower.includes("agua") || lower.includes("internet")) return "💡";
  if (lower.includes("salar") || lower.includes("remuner")) return "💵";
  if (lower.includes("free") || lower.includes("projet")) return "💻";
  if (lower.includes("invest") || lower.includes("renda")) return "📈";

  return "🏷️";
}

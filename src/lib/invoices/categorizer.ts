import { db } from '@/db';
import { merchantRules, globalMerchantCache, categories, Category } from '@/db/schema';
import { eq, or, isNull } from 'drizzle-orm';
import { GoogleGenAI, Type } from '@google/genai';
import { ParsedInvoiceItem } from './pdf-parser';

export type CategoryProvenance = 'HISTORIC' | 'AI' | 'WEB_SEARCH';

export interface CategorizedInvoiceItem extends ParsedInvoiceItem {
  categoryId?: string | null;
  categoryName?: string | null;
  provenance?: CategoryProvenance;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Build a lookup map of category names/paths to Category objects.
 * This replaces the old resolveCategory function which had a dangerous
 * partial-match fallback that caused wrong classifications (e.g. "auto" → "Autocuidado").
 */
function buildCategoryLookup(categoriesList: Category[]): Map<string, Category> {
  const lookup = new Map<string, Category>();

  for (const cat of categoriesList) {
    // Index by exact lowercase name
    lookup.set(cat.name.toLowerCase().trim(), cat);

    // Index by hierarchical path "Parent > Child"
    if (cat.parentId) {
      const parent = categoriesList.find(p => p.id === cat.parentId);
      if (parent) {
        lookup.set(`${parent.name.toLowerCase().trim()} > ${cat.name.toLowerCase().trim()}`, cat);
      }
    }

    // Index by ID
    lookup.set(cat.id, cat);
  }

  return lookup;
}

/**
 * Resolve a category name returned by the AI to an actual Category object.
 * Uses exact match only — no partial matching to avoid false positives.
 */
function resolveCategory(
  itemCatValue: string | null | undefined,
  categoryLookup: Map<string, Category>
): Category | null {
  if (!itemCatValue) return null;

  const cleanVal = String(itemCatValue).trim().toLowerCase();

  // 1. Try exact match (handles IDs, exact names, and "Parent > Child" paths)
  const exact = categoryLookup.get(cleanVal);
  if (exact) return exact;

  // 2. If the AI returned "Parent > Child", try just the child part
  if (cleanVal.includes('>')) {
    const childVal = cleanVal.split('>').pop()!.trim();
    const byChild = categoryLookup.get(childVal);
    if (byChild) return byChild;
  }

  // 3. No match found — return null instead of guessing
  return null;
}

/**
 * Main Hybrid Categorization Engine:
 * Level 1: Match with local user rules (merchant_rules)
 * Level 1.5: Match with global cache rules (global_merchant_cache)
 * Level 2: Batch LLM classification via Gemini Flash
 * Level 3: Web search grounding for obscure merchant names / CNPJs
 */
export async function categorizeInvoiceItems(
  userId: string,
  items: ParsedInvoiceItem[]
): Promise<CategorizedInvoiceItem[]> {
  if (!items || items.length === 0) return [];

  // Fetch user + system default categories
  const userCategories = await db
    .select()
    .from(categories)
    .where(or(eq(categories.userId, userId), isNull(categories.userId)));

  if (!userCategories || userCategories.length === 0) {
    return items.map((item) => ({ ...item, provenance: undefined }));
  }

  const result: CategorizedInvoiceItem[] = items.map((item) => ({ ...item }));
  const categoryLookup = buildCategoryLookup(userCategories);
  const categoryMap = new Map<string, Category>();
  userCategories.forEach((c) => categoryMap.set(c.id, c));

  // ==========================================
  // LEVEL 1 & 1.5: Local Rules & Global Cache
  // ==========================================
  const rules = await db
    .select()
    .from(merchantRules)
    .where(eq(merchantRules.userId, userId));

  const globalRules = await db.select().from(globalMerchantCache);

  const uncategorizedIndexes: number[] = [];

  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const normalizedDesc = item.description.toUpperCase().trim();

    // Level 1: User-specific merchant rules
    const matchedRule = rules.find((rule) =>
      normalizedDesc.includes(rule.pattern.toUpperCase().trim())
    );

    if (matchedRule && categoryMap.has(matchedRule.categoryId)) {
      const cat = categoryMap.get(matchedRule.categoryId)!;
      result[i].categoryId = cat.id;
      result[i].categoryName = cat.name;
      result[i].provenance = 'HISTORIC';
      result[i].confidence = 'HIGH';
      continue;
    }

    // Level 1.5: Global merchant cache
    const matchedGlobal = globalRules.find((rule) =>
      normalizedDesc.includes(rule.pattern.toUpperCase().trim())
    );

    if (matchedGlobal && categoryMap.has(matchedGlobal.categoryId)) {
      const cat = categoryMap.get(matchedGlobal.categoryId)!;
      result[i].categoryId = cat.id;
      result[i].categoryName = cat.name;
      result[i].provenance = 'AI';
      result[i].confidence = 'HIGH';
      continue;
    }

    if (!item.categoryId) {
      uncategorizedIndexes.push(i);
    }
  }

  console.log(`[Categorizer] Level 1/1.5: ${result.length - uncategorizedIndexes.length} itens resolvidos por regras locais/globais. ${uncategorizedIndexes.length} pendentes para Level 2.`);

  if (uncategorizedIndexes.length === 0) {
    return result;
  }

  // ==========================================
  // LEVEL 2: Batch LLM Classification
  // ==========================================
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    console.warn('[Categorizer] API Key não encontrada. Pulando Level 2 e 3.');
    return result;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  // Build the category list as "Parent > Child" for the LLM prompt
  const categoryNames = userCategories.map((c) => {
    if (c.parentId) {
      const parent = userCategories.find(p => p.id === c.parentId);
      if (parent) return `${parent.name} > ${c.name}`;
    }
    return c.name;
  });

  const uniqueUncategorizedMerchants = Array.from(
    new Set(uncategorizedIndexes.map((idx) => result[idx].description))
  );

  const level2PendingMerchants: string[] = [];
  const classificationMap = new Map<string, { categoryName: string; confidence: 'HIGH' | 'MEDIUM' | 'LOW' }>();

  try {
    const level2Prompt = `Você é um assistente de inteligência financeira brasileiro.
Classifique os estabelecimentos de fatura de cartão de crédito abaixo em uma das categorias fornecidas.

Regras:
- Retorne confidence "HIGH" somente para nomes amplamente conhecidos (UBER, IFOOD, NETFLIX, SPOTIFY, etc).
- Tente ao máximo deduzir a categoria pelo contexto e retorne "MEDIUM". Nomes de empresas, siglas, razões sociais DEVEM ser classificados com "MEDIUM" na categoria mais lógica.
- Se não for possível deduzir a categoria com o contexto do nome, retorne confidence "LOW".
- DICA: Estabelecimentos com "MP*", "PAG*", "MERCADOPAGO" ou "MERCADO LIVRE*" são processadores de pagamento. Concentre-se no nome que vem DEPOIS do asterisco para tentar deduzir a categoria. Se o nome seguinte for uma pessoa física ou algo que você não conhece, retorne "LOW" para que o nosso sistema possa pesquisar na web depois.

IMPORTANTE: Você DEVE retornar o nome EXATO de uma das subcategorias listadas abaixo. NÃO retorne o nome de uma categoria pai sem a subcategoria. Por exemplo, retorne "Transporte Coletivo" e não "Transporte". Se a subcategoria exata não existir, retorne a subcategoria mais próxima.

Categorias Disponíveis (retorne o NOME EXATO de uma destas):
${JSON.stringify(categoryNames, null, 2)}

Estabelecimentos para Classificar:
${JSON.stringify(uniqueUncategorizedMerchants, null, 2)}

Retorne um JSON de array de objetos com: merchant, categoryName, confidence ("HIGH", "MEDIUM" ou "LOW").`;

    const level2Response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ text: level2Prompt }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              merchant: { type: Type.STRING },
              categoryName: { type: Type.STRING },
              confidence: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
            },
            required: ['merchant', 'categoryName', 'confidence'],
          },
        },
      },
    });

    if (level2Response.text) {
      const classifications: Array<{ merchant: string; categoryName: string; confidence: 'HIGH' | 'MEDIUM' | 'LOW' }> =
        JSON.parse(level2Response.text);
      classifications.forEach((c) => classificationMap.set(c.merchant.toUpperCase().trim(), c));
    }
  } catch (err: any) {
    console.warn('[Categorizer] Level 2 error:', err?.message || err);
  }

  // Apply Level 2 results
  for (const idx of uncategorizedIndexes) {
    const item = result[idx];
    const match = classificationMap.get(item.description.toUpperCase().trim());
    const cat = match ? resolveCategory(match.categoryName, categoryLookup) : null;

    if (cat && match && (match.confidence === 'HIGH' || match.confidence === 'MEDIUM')) {
      result[idx].categoryId = cat.id;
      result[idx].categoryName = cat.name;
      result[idx].provenance = 'AI';
      result[idx].confidence = match.confidence;
    } else {
      if (match && !cat) {
        console.warn(`[Categorizer] ⚠️ IA retornou categoria "${match.categoryName}" que não existe no sistema. Item: "${item.description}"`);
      }
      level2PendingMerchants.push(item.description);
    }
  }

  console.log(`[Categorizer] Level 2: ${uncategorizedIndexes.length - level2PendingMerchants.length} itens classificados pela IA. ${level2PendingMerchants.length} pendentes para Level 3.`);

  // ==========================================
  // LEVEL 3: Google Search Grounding
  // ==========================================
  const obscureMerchants = Array.from(new Set(level2PendingMerchants)).slice(0, 20);

  if (obscureMerchants.length > 0) {
    const groundingPrompt = `Pesquise no Google (ferramenta de busca web) os seguintes estabelecimentos ou razões sociais brasileiras para descobrir seus ramos de atuação:
${JSON.stringify(obscureMerchants, null, 2)}

Com base nas suas pesquisas, classifique cada um deles usando a melhor categoria desta lista:
${JSON.stringify(categoryNames, null, 2)}

Você DEVE retornar SOMENTE um array JSON (sem formatação markdown) onde cada objeto tem:
- "merchant" (o nome exato que eu forneci)
- "categoryName" (o nome da subcategoria correspondente)

Exemplo de formato esperado: [{"merchant":"CLICKBUS","categoryName":"Transporte Coletivo"}]`;

    try {
      const groundingResponse = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: [{ text: groundingPrompt }],
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      if (groundingResponse.text) {
        const jsonMatch = groundingResponse.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed: Array<{ merchant: string; categoryName: string }> = JSON.parse(jsonMatch[0]);
          const parsedMap = new Map<string, string>();
          parsed.forEach((p) => parsedMap.set(p.merchant.toUpperCase().trim(), p.categoryName));

          let level3Count = 0;
          for (const [idx, item] of result.entries()) {
            if (!item.categoryId) {
              const matchedCategoryName = parsedMap.get(item.description.toUpperCase().trim());
              if (matchedCategoryName) {
                const cat = resolveCategory(matchedCategoryName, categoryLookup);
                if (cat) {
                  result[idx].categoryId = cat.id;
                  result[idx].categoryName = cat.name;
                  result[idx].provenance = 'WEB_SEARCH';
                  result[idx].confidence = 'HIGH';
                  level3Count++;

                  // Auto-populate global cache for future use
                  const pattern = item.description.toUpperCase().trim();
                  const existingGlobal = globalRules.find(r => r.pattern === pattern);
                  if (!existingGlobal) {
                    try {
                      await db.insert(globalMerchantCache).values({
                        pattern,
                        categoryId: cat.id
                      }).onConflictDoNothing();
                    } catch (e) {
                      // Silently ignore cache insert failures
                    }
                  }
                }
              }
            }
          }
          console.log(`[Categorizer] Level 3: ${level3Count} itens classificados via busca web.`);
        }
      }
    } catch (gErr: any) {
      const isQuotaError = String(gErr?.message).includes('quota') || String(gErr).includes('RESOURCE_EXHAUSTED');

      if (isQuotaError) {
        console.warn(`[Categorizer] ℹ️ Cota do Google Search Grounding esgotada. Pulando Level 3.`);
      } else {
        console.warn(`[Categorizer] Level 3 falhou:`, gErr?.message || gErr);
      }
    }
  }

  // Final summary
  const finalPending = result.filter(r => !r.categoryId).length;
  console.log(`[Categorizer] ✅ Finalizado: ${result.length - finalPending}/${result.length} itens categorizados. ${finalPending} pendentes para revisão manual.`);

  return result;
}

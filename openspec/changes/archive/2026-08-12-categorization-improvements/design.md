## Context

The current `categorizer.ts` relies on user-specific `merchant_rules` (Level 1), Gemini Flash for LLM categorization (Level 2), and Google Search for obscure items (Level 3). While effective, it performs redundant searches for common merchants and sends large batches to Gemini, leading to potential truncation or hallucination. We want to implement a crowdsourced cache (Level 1.5) and LLM chunking to improve this.

## Goals / Non-Goals

**Goals:**
- Reduce Gemini API and Google Search tool usage.
- Instantly categorize globally known merchants.
- Prevent context limit issues on large invoices by processing items in chunks.

**Non-Goals:**
- Full Semantic Search implementation in Phase 1 (we will prepare the cache structure, but embeddings via `pgvector` might be deferred if it introduces too much complexity).

## Decisions

- **Global Merchant Cache Table**: Create a `global_merchant_cache` table mapping `pattern` to `categoryId` (using system default categories where `userId` is null). This serves as Level 1.5.
- **LLM Chunking**: We will slice the `uncategorizedIndexes` array into batches of 30. We will use `Promise.all` with a controlled concurrency limit or simply sequential await to avoid rate limits while ensuring smaller LLM contexts.
- **Auto-Caching Level 3**: Upon a successful, high-confidence categorization via Google Search (Level 3), we will automatically insert the result into `global_merchant_cache` so that subsequent occurrences across the platform resolve instantly at Level 1.5.

## Risks / Trade-offs

- **[Risk]** Bad LLM classifications polluting the global cache.
  **Mitigation** → Only insert into the global cache if the LLM confidence is strictly 'HIGH' and derived from Web Search (Level 3).
- **[Risk]** Rate limiting from Gemini during chunked Promise.all requests.
  **Mitigation** → Implement a basic delay between chunk processing or process chunks sequentially.

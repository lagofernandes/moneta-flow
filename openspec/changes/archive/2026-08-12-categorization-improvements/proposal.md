## Why

The current AI categorization engine works well but can be optimized for cost, speed, and accuracy. Sending all unknown items directly to Gemini (Level 2) or Google Search (Level 3) can be expensive and slow. By introducing a global crowdsourced cache and improving prompt batching, we can significantly improve performance and resilience.

## What Changes

- Add a Global Cache (Level 1.5) to instantly resolve merchants already identified across the system.
- Save Google Search (Level 3) results into the Global Cache to prevent redundant web searches.
- Implement Semantic Search (Vector Embeddings) in Level 1 to match similar merchant names instead of relying on exact string matches.
- Implement Chunking (fragmentation) in Level 2 LLM processing to avoid context window truncation and hallucination on large invoices.

## Capabilities

### New Capabilities
- `global-merchant-cache`: Introduce a global cache layer and semantic search for merchant rules.

### Modified Capabilities
- `auto-categorization`: Update the 3-tier categorization engine to include chunking and the new global cache layer.

## Impact

- **Database**: Add `global_merchant_cache` table. Potentially add `pgvector` extension and embedding columns.
- **Categorization Engine (`categorizer.ts`)**: Rewrite batch processing logic to use chunking, insert cache checks before LLM calls, and write to cache after successful Level 3 searches.

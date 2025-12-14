---
title: Knowledge Decay Strategy
tags: [#kg/how/decay, #kg/challenges]
source: [[repos/KnowledgeGraphSystem/docs/knowledge-decay-strategy.md|Original]]
---

# Knowledge Decay {#decay}

> [!critical] Critical Gap  
> **30% docs drift in 6mo**. Implement TTL + auto-review.

## Taxonomy {#taxonomy-decay}
| Category | Cycle | Examples |
|----------|--------|----------|
| Fast | 30d | API, pricing, deps |
| Medium | 180d | Frameworks, benchmarks |
| Slow | 730d | Arch patterns |
| None | ∞ | Math proofs |

## Data Model Add {#model}
```ts
decayCategory?: 'FAST'|'MEDIUM'|'SLOW'|'NONE'
ttl?: number  // days
lastVerified?: Date
```

## Implementation {#impl-decay}
1. Infer on ingest (patterns/API mentions)
2. Stale query: `daysSinceUpdate > ttl * 0.5`
3. Queue reviews, AI verify (MCP query source)

> [!phase] Roadmap  
> Phase 2.5: Categorize  
> Phase 4: Agents verify

**Metrics**: Health dashboard %stale by category.


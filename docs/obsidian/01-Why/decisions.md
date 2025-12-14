---
title: Key Decisions
tags: [#kg/why/decision]
---

# Key Decisions {#decisions}

> [!abstract] Summary
> Compiled from ROADMAP.md comments & docs. Preserves rationale for future LLM agents/dev.

## 1. Dual Relationship Model {#dual-rel}
**Choice**: Structural (PARENT_OF, CONTAINS_ORDERED) + Semantic (IMPLEMENTS, DEPENDS_ON)

**Why**: 
- Structural: Document assembly traversal
- Semantic: Knowledge discovery, algos (centrality, paths)
- Perf: Render structural by default, semantic on-demand

> [!why]- Dual Model  
> Enables both hierarchical docs & arbitrary knowledge links. Single rel type insufficient.

## 2. Tree-sitter Integration {#tree-sitter}
**Choice**: Parse code blocks to AST subnodes for graph algos.

**Why**: MVP code parsing eases centrality/pathfinding on calls. Idempotent MERGE to Neo4j.

> [!impl] Phase 2.4  
> `npm i tree-sitter tree-sitter-javascript` → CST → Cypher batch upsert.

## 3. Ontology Management {#ontology}
**Choice**: LLM-infer dynamic schema from schema.org + ZO_WAY docs.

**Why**: Domain-specific (DevBlock: IMPLEMENTS→Impl→Test). Auto-evolve via agents.

## 4. GraphRAG {#graphrag}
**Choice**: Hypergraph/tree retrieval over traditional chunking.

**Why**: Multi-hop Cypher queries > vector search for code/relations.

## 5. Agent Council {#agents}
**Choice**: Integrate agent-council for auto-tag/rel-inf.

**Why**: Round-robin Gemini/Jules/Qwen/Goose. Persistent JSON state.

## 6. Knowledge Decay {#decay}
**Choice**: TTL + category-based review cycles.

**Why**: 30% docs drift in 6mo without validation. Critical for liability.

> [!critical] Missing Impl  
> Add to Block: `decayCategory`, `ttl`, `lastVerifiedAt`. See [[06-Challenges/knowledge-decay]]

## 7. Persistence: localStorage → Neo4j {#persistence}
**Why**: MVP speed, scale to enterprise.

## 8. LLM: Gemini MVP {#llm}
**Why**: Fast chunking/inference. Multi-model Phase 4.

**Secrets**: `bws secret get GEMINI_API_KEY` per user rules.

> [!todo] Critique: Add workflow diagrams, TS embeds.


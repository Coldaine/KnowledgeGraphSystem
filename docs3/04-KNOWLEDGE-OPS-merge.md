# Merge Recommendation: Knowledge Ops Documents

## Sources
- **Upstream**: `docs/knowledge-decay-strategy.md`, `docs/verification-agents-plan.md`, `docs/tree-sitter-integration.md`
- **Ours**: `docs2/VISION.md` Section II.A (briefly mentioned), `docs2/types-additions.ts` (ConflictType.stale)

---

## Knowledge Decay Strategy

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Decay taxonomy | FAST/MEDIUM/SLOW/NONE with day values | Not addressed | **Upstream** |
| TTL model | `ttl`, `decayCategory`, `lastVerifiedAt` | Not addressed | **Upstream** |
| Review cycles | 2-4 weeks / 3-6 months / 1-2 years / 5+ years | Not addressed | **Upstream** |
| Staleness | Detailed formula and thresholds | `ConflictType: 'stale'` only | **Upstream** - far more complete |
| Block extensions | `ttl`, `decayCategory`, `lastVerifiedAt`, `verificationSource` | None | **Upstream** |

**Recommendation**: ADOPT upstream entirely

This is a critical gap we missed. Their document is comprehensive:
- Evidence-based (30% drift in 6 months from ZO_WAY research)
- Concrete categories with specific review cycles
- Implementation code examples
- Dashboard integration

**Integration points**:
- Add `DecayCategory` enum to types/index.ts
- Add decay fields to Block interface
- Reference from E005 epic

---

## Verification Agents

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Agent architecture | LangGraph + Qwen 1.5B | Not addressed | **Upstream** |
| API integrations | PyPI, GitHub, HuggingFace | Not addressed | **Upstream** |
| Confidence scoring | `0.99^weeks_since_verify` decay formula | Not addressed | **Upstream** |
| MCP integration | `/api/verify/{blockId}` endpoint | Not addressed | **Upstream** |
| Phased rollout | 3 phases: MVP → Medium → Full | Not addressed | **Upstream** |

**Recommendation**: ADOPT upstream entirely

We completely missed this. Their plan includes:
- Concrete implementation with LangGraph
- External API verification (real-world truth checking)
- Cost estimates ($0.05/week for 500 blocks)
- Success metrics

**Integration points**:
- Add `isAutoVerifiable` to Block interface
- Add `confidenceScore` with decay formula
- Reference from E004 (agents) and E005 (ops) epics

---

## Tree-sitter Integration

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Code parsing | Tree-sitter → AST → FunctionBlock | Not addressed | **Upstream** |
| Relationship extraction | CALLS edges from AST | Not addressed | **Upstream** |
| Graph algorithms | Centrality on call graphs | Not addressed | **Upstream** |

**Recommendation**: ADOPT upstream entirely

We didn't address code-as-knowledge at all. This is important for:
- Code documentation staying in sync with code
- Call graph visualization
- Dependency analysis

**Integration points**:
- Add FunctionBlock, ClassBlock to BlockType enum (or as templates)
- Add CALLS to SemanticRelation enum
- Reference from Phase 2.4 in ROADMAP

---

## ZO_WAY Templates

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Distilled ontology | LocalIngestion, AgentOrchestrator templates | Not addressed | **Upstream** |
| PDF references | Feasibility, Frameworks, Coding, DocAware | Not addressed | **Upstream** |

**Recommendation**: ADOPT upstream

These provide seed data and ontology patterns from research.

---

## Summary: Knowledge Ops

| Document | Action | Our Contribution |
|----------|--------|------------------|
| knowledge-decay-strategy.md | ADOPT | Add to types (DecayCategory enum) |
| verification-agents-plan.md | ADOPT | Add to types (isAutoVerifiable, confidenceScore) |
| tree-sitter-integration.md | ADOPT | Add to types (FunctionBlock, CALLS) |
| zo_way_templates.md | ADOPT | None |

**Key insight**: These documents represent functionality we completely missed in our vision. They are complementary to our governance focus. Together:

```
OUR FOCUS                    UPSTREAM FOCUS
───────────                  ──────────────
Authority (who can change)   Decay (when to re-verify)
Escalation (blocked ops)     Verification (truth checking)
Conflict (contradictions)    Code parsing (AST analysis)
Audit (history)              Confidence (trust scoring)
```

The complete system needs BOTH.

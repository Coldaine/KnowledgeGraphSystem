# Merge Recommendation: EPICS

## Sources
- **Upstream**: `docs/epics/E001-E005.md` (5 epics with stories)
- **Ours**: `docs2/VISION.md` Sections II-III, `docs2/UI_PHILOSOPHY.md`, `docs2/ROADMAP-ours.md`

---

## E001: Core Foundation (COMPLETE)

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Scope | Block, Edge, Tag, Compositor | Same | **Same** - already implemented |
| Status | DELIVERED | N/A | **Upstream** - acknowledges completion |

**Recommendation**: ADOPT upstream. This is complete. No changes needed.

---

## E002: Governance System (IN PROGRESS)

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Authority enforcement | Stories for clearance, blocking | Full TypeScript types | **MERGE** |
| Visual indicators | "UI shows authority indicators" | Detailed UI_PHILOSOPHY.md | **Ours** - more specific |
| Audit logging | Stories reference C005 | AuditEntry, AuditActionType | **MERGE** |

**Recommendation**: ADOPT upstream stories + ADD our implementation details

Add to E002 stories:
- E002-S0X: "Implement AuthorityLevel enum per docs2/types-additions.ts"
- E002-S0X: "Block back-face shows authority info per docs2/UI_PHILOSOPHY.md"

---

## E003: Tethered Canvas UI

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Core metaphor | Semantic magnetism, tethers | Not addressed | **Upstream** |
| Progressive disclosure | 3 layers (Narrative/Logic/Gardener) | Not addressed | **Upstream** |
| Visual chunk boundaries | Not detailed | Detailed recommendations | **Ours** |
| Escalation hotspots | Not addressed | Graph highlighting | **Ours** |
| Authority stratification view | Not addressed | Y-axis by authority | **Ours** |

**Recommendation**: ADOPT upstream + ADD our UI philosophy

Add to E003:
- E003-S0X: "Chunk boundaries visible in document view" (UI_PHILOSOPHY.md #2)
- E003-S0X: "Escalation hotspot highlighting in graph" (UI_PHILOSOPHY.md #4)
- E003-S0X: "Authority stratification layout option" (UI_PHILOSOPHY.md #3)
- E003-S0X: "Block back-face shows escalation history" (UI_PHILOSOPHY.md #1)

**Key insight**: Upstream has the "WHY" (Tethered Canvas metaphor), we have the "HOW" (specific UI recommendations). Perfect complement.

---

## E004: Agent Orchestration

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Agent tiers | Drone/Architect/Judge | Flat AGENT level | **Upstream** |
| Agentic Chat | Prosecutor/Defense/Judge | Advocate/Critic/Neutral | **Upstream naming** |
| EscalationEvent | Not typed | Full interface | **Ours** |
| AgenticReview | Not typed | Full interface | **Ours** |

**Recommendation**: ADOPT upstream + ADD our types

Add to E004 stories:
- E004-S0X: "Implement EscalationEvent interface per docs2/types-additions.ts"
- E004-S0X: "Implement AgenticReview interface (rename to MotionToChange)"

**Naming alignment**:
```
Ours → Upstream
advocateArguments → prosecutorArguments
criticArguments → defenseArguments
neutralAssessment → judgeVerdict
```

---

## E005: KnowledgeOps Pipeline

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Core concept | "Nightly build for knowledge" | "Cadenced reviews" | **Same concept** |
| Conflict detection | Contradiction focus | contradiction/redundancy/orphan/stale | **Ours** - richer |
| Decay model | Not addressed | Referenced but not detailed | **Neither** - see docs/knowledge-decay-strategy.md |
| Verification agents | Not detailed | Referenced but not detailed | **Neither** - see docs/verification-agents-plan.md |
| Dashboard | Criticality dashboard stories | Criticality dashboard widgets | **Same concept** |

**Recommendation**: ADOPT upstream + ADD conflict taxonomy + REFERENCE decay docs

Add to E005:
- E005-S0X: "ConflictType includes redundancy, orphan, stale (not just contradiction)"
- E005-S0X: "Implement ConflictRecord interface per docs2/types-additions.ts"
- E005-S0X: Reference `docs/knowledge-decay-strategy.md` for decay implementation
- E005-S0X: Reference `docs/verification-agents-plan.md` for verification agents

---

## Summary: Epics

| Epic | Action | Key Additions from Ours |
|------|--------|------------------------|
| E001 | ADOPT | None (complete) |
| E002 | ADOPT + ADD | AuthorityLevel types, UI authority indicators |
| E003 | ADOPT + ADD | 4 specific UI stories from UI_PHILOSOPHY.md |
| E004 | ADOPT + ADD | EscalationEvent, AgenticReview types |
| E005 | ADOPT + ADD | ConflictType taxonomy, ConflictRecord type |

---

## Cross-Reference: Our Roadmap → Epics

| Our Roadmap Section | Maps To Epic |
|---------------------|--------------|
| Phase 2.1 Authority Chain | E002 |
| Phase 2.3 Visual Chunk Boundaries | E003 |
| Phase 4.1 Agent Escalation | E004 |
| Phase 4.3 Conflict Detection | E005 |
| Phase 4.4 Criticality Dashboard | E005 |
| Phase 5.1 Audit System | E002, E005 |

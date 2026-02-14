# Merge Recommendation: CONTRACTS

## Sources
- **Upstream**: `docs/contracts/C001-C005.md` (5 contracts with invariants)
- **Ours**: `docs2/VISION.md` Sections I-II, `docs2/types-additions.ts`

---

## C001: Semantic Chunk Architecture

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Core concept | Chunk = atomic unit | Block = atomic unit | **Same** - terminology differs |
| Invariants | INV-C001-01 through 05 (formal) | Implicit in Principle 1 | **Upstream** - formal invariants are testable |
| Block types | References types/index.ts | 10 BlockType enum values | **MERGE** - upstream structure + our types |

**Recommendation**: ADOPT upstream, no changes needed. Our Block types already exist in codebase.

---

## C002: Authority Chain & Escalation

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Authority model | 3-tier: Mutable/Locked/Immutable | 6-level: SYSTEM→VIEWER + 3-tier | **MERGE** |
| Escalation rubric | 5 steps: execution→requirement | Same 5 steps | **Same** |
| Agent clearance | Tier 1/2/3 → clearance 0/1/3 | AuthorityLevel.AGENT (flat) | **Upstream** - more nuanced |
| TypeScript types | Pseudocode only | Full interfaces | **Ours** |

**Recommendation**: MERGE
- Keep upstream's 3-tier immutability model for CONTENT protection
- ADD our `AuthorityLevel` enum for PRINCIPAL (who) classification
- ADD our `EscalationEvent` interface to their pseudocode

**Merged model**:
```
Content Protection (ImmutabilityLevel): Mutable < Locked < Immutable
Principal Authority (AuthorityLevel): VIEWER < AGENT < CONTRIBUTOR < SENIOR < PRINCIPAL < SYSTEM
Agent Tiers: Drone(0) < Architect(1) < Judge(3)
```

---

## C003: Dynamic Assembly

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Core concept | Assembly = view, not copy | Dual-state operation | **Same concept** |
| Traversal profiles | Mentioned | Full TraversalProfile interface | **Ours** - already implemented |
| Visual chunk boundaries | Not addressed | UI_PHILOSOPHY.md section | **Ours** - add to contract |

**Recommendation**: ADOPT upstream + ADD
- Keep upstream's invariants (INV-C003-*)
- ADD invariant: "Assembled view MUST show chunk boundaries" (from our UI philosophy)

---

## C004: Agent Hierarchy

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Agent tiers | 3-tier: Drone/Architect/Judge | Flat AuthorityLevel.AGENT | **Upstream** |
| "Motion to Change" | Prosecutor/Defense/Judge | Advocate/Critic/Neutral | **Upstream** - naming is more evocative |
| AgenticReview type | Prose description | Full TypeScript interface | **Ours** - add to contract |

**Recommendation**: ADOPT upstream + ADD
- Adopt their 3-tier Agent Senate model
- Rename our AgenticReview fields: advocate→prosecutor, critic→defense, neutral→judge
- Add our TypeScript interface to their implementation guidance

---

## C005: Audit Trail & Consistency

| Aspect | Upstream | Ours | Take From |
|--------|----------|------|-----------|
| Log schema | SQL + pseudocode | AuditEntry TypeScript | **MERGE** - their SQL + our TS |
| Consistency checks | Hourly/Nightly/Weekly schedule | "Cadenced reviews" | **Same concept** |
| Conflict types | Contradiction only | contradiction/redundancy/orphan/stale | **Ours** - richer taxonomy |
| ConflictRecord | Not defined | Full interface | **Ours** |

**Recommendation**: MERGE
- Keep upstream's invariants and SQL schema
- ADD our `ConflictType` enum (they only have contradiction)
- ADD our `ConflictRecord` interface
- ADD our `AuditActionType` comprehensive enum

---

## Summary: Contracts

| Contract | Action | Key Additions from Ours |
|----------|--------|------------------------|
| C001 | ADOPT | None needed |
| C002 | MERGE | `AuthorityLevel` enum, `EscalationEvent` interface |
| C003 | ADOPT + ADD | Visual chunk boundaries invariant |
| C004 | ADOPT + ADD | `AgenticReview` interface (renamed fields) |
| C005 | MERGE | `ConflictType`, `ConflictRecord`, `AuditActionType` |

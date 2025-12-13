# Contract C001: Semantic Chunk Architecture

> **Document Classification:** IMMUTABLE CONTRACT
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Constitutional Basis:** [Principle 1 — The Semantic Chunk is the Atom](../CONSTITUTION.md#principle-1-the-semantic-chunk-is-the-atom)
> **Modification Protocol:** Requires Contract Amendment Proposal + Architect Review
> **Related Contracts:** [C002](./C002-authority-chain.md), [C003](./C003-dynamic-assembly.md)

---

## 1. Purpose

### 1.1 Why This Contract Exists

Traditional knowledge systems store **documents** — containers that mix metadata, presentation, and content. This creates three structural problems:

1. **Duplication Hell** — The same fact appears in multiple documents, inevitably drifting
2. **Granularity Mismatch** — You can only protect entire documents, not individual facts
3. **Relationship Blindness** — Connections exist inside human heads, not the system

This contract establishes that **the semantic chunk is the atomic unit** of the Knowledge Graph System, and all storage, retrieval, and manipulation operations must respect this atomicity.

### 1.2 What This Contract Prevents

- Storing monolithic documents without decomposition
- Duplicating information instead of referencing
- Applying permissions at document-level only
- Losing relationship context during edits

---

## 2. Definitions

| Term | Definition |
|------|------------|
| **Semantic Chunk** | A discrete, complete unit of meaning with clear boundaries. May be a single sentence, a paragraph, a code block, or a structured data element — but never a partial thought. |
| **Block** | The system's implementation of a semantic chunk. A Block is addressable, typed, and carries metadata. |
| **Relationship** | An explicit, typed connection between two blocks. Relationships exist independently of the blocks they connect. |
| **Assembly** | The temporary combination of blocks into a human-readable format. Assemblies are views, not storage. |

---

## 3. Invariants

These conditions MUST hold at all times. Violation of any invariant indicates a system defect.

### INV-C001-01: Atomic Addressability
> **Every semantic chunk MUST have a globally unique, immutable identifier.**

**Justification:** Without unique addressing, chunks cannot be referenced, versioned, or tracked. The identifier must never change because external systems (caches, logs, links) depend on stability.

**Implementation Mapping:** `Block.id: string` — UUID v4 or equivalent

---

### INV-C001-02: Self-Contained Meaning
> **A semantic chunk MUST be comprehensible without requiring adjacent content.**

**Justification:** If a chunk's meaning depends on "the previous paragraph," it is not a valid chunk — it is a fragment. Fragments cannot be independently versioned, searched, or reused.

**Verification:** A chunk passes this invariant if a human reader can understand its core assertion without context. Referential mentions ("As noted in X...") are permitted if the reference is explicit.

---

### INV-C001-03: Typed Classification
> **Every chunk MUST be assigned exactly one Block Type from the defined taxonomy.**

**Justification:** Type enables differential handling. A "Requirement" block has different authority rules than a "Note" block. Untyped blocks cannot be governed.

**Current Type Taxonomy:**
- `note` — Informal, mutable observation
- `requirement` — Formal constraint (default: locked)
- `spec` — Technical specification
- `impl` — Implementation detail
- `test` — Verification criteria
- `manifest` — Assembly root node

**Extension Protocol:** New types require Contract Amendment.

---

### INV-C001-04: Explicit Boundaries
> **Every chunk MUST define its content boundaries. No implicit continuation.**

**Justification:** If content "continues" across chunks, edits to one chunk may break another. Explicit boundaries enable independent editing.

**Anti-pattern:** "Continued from above..." or numbering that spans chunks.

---

### INV-C001-05: Relationship Externalization
> **Relationships between chunks MUST be stored as independent entities, not embedded content.**

**Justification:** Embedded relationships (inline links, implicit ordering) cannot be:
- Typed and governed independently
- Queried without parsing content
- Visualized as graph structure

**Implementation Mapping:** `Edge` entities with `fromBlockId`, `toBlockId`, `relationType`

---

### INV-C001-06: Single Source of Truth
> **A fact MUST exist in exactly one chunk. All other references MUST be relationships, not copies.**

**Justification:** Duplication is the root cause of contradiction. If a fact exists in two places, they will eventually disagree. References (relationships) ensure that updates propagate automatically.

**Exception:** Denormalization for read performance is permitted in caching layers only, never in source storage.

---

## 4. Verification Criteria

### 4.1 Automated Verification

| Check | Frequency | Method |
|-------|-----------|--------|
| Unique ID | On write | Database constraint violation |
| Type assigned | On write | Schema validation |
| Boundary defined | On write | Content parsing — no continuation markers |
| Relationships external | On write | No `[link](...)` patterns in content |

### 4.2 Manual Verification

| Check | Frequency | Method |
|-------|-----------|--------|
| Self-contained meaning | On review | Human readability assessment |
| Single source of truth | Weekly | Similarity detection scan |

### 4.3 Failure Handling

- **Automated check failure:** Write rejected, user notified with specific invariant violation
- **Manual check failure:** Block flagged for remediation in consistency dashboard

---

## 5. Implementation Guidance

### 5.1 For the Ingestion Pipeline (LLM Chunking)

When decomposing a document into chunks:

1. **Identify natural boundaries** — Headings, paragraph breaks, code fences
2. **Test self-containment** — Can each chunk stand alone?
3. **Extract relationships** — "See also X" becomes an edge, not inline text
4. **Assign type** — Infer from content or prompt user

**Reference:** [Epic E001 — Core Foundation](../epics/E001-core-foundation.md)

### 5.2 For the UI Layer

When displaying chunks:

1. **Preserve boundaries visually** — Cards, borders, or spacing
2. **Show relationships on demand** — Hover or toggle
3. **Edit chunks individually** — Never allow "cross-chunk" selection

### 5.3 Anti-Patterns to Avoid

| Anti-Pattern | Why It Violates C001 |
|--------------|---------------------|
| Storing full Markdown documents | Violates INV-01, INV-04 |
| Using inline links instead of edges | Violates INV-05 |
| Copying content between blocks | Violates INV-06 |
| Partial thoughts as blocks | Violates INV-02 |
| Untyped "generic" blocks | Violates INV-03 |

---

## 6. Relationship to Other Contracts

| Contract | Relationship |
|----------|--------------|
| [C002 — Authority Chain](./C002-authority-chain.md) | Authority is assigned PER CHUNK (enables granular protection) |
| [C003 — Dynamic Assembly](./C003-dynamic-assembly.md) | Assembly traverses CHUNKS, not documents |
| [C005 — Audit Trail](./C005-audit-trail.md) | Audit logs reference chunk IDs, not document paths |

---

## 7. Ratification

This contract is derived from Constitutional Principle 1 and ratified as the foundational specification for data architecture.

**Ratified:** 2025-01-XX
**Version:** 1.0.0
**Status:** ACTIVE

---

*All implementations must satisfy these invariants. Deviations require Contract Amendment Proposal.*

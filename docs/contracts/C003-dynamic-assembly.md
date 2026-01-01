# Contract C003: Dynamic Assembly Protocol

> **Document Classification:** IMMUTABLE CONTRACT
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Constitutional Basis:** [Principle 3 — Dynamic Assembly, Static Truth](../CONSTITUTION.md#principle-3-dynamic-assembly-static-truth)
> **Modification Protocol:** Requires Contract Amendment Proposal + Architect Review
> **Related Contracts:** [C001](./C001-semantic-chunk-architecture.md), [C005](./C005-audit-trail.md)

---

## 1. Purpose

### 1.1 Why This Contract Exists

Humans and systems have incompatible needs:

| Humans Need | Systems Need |
|-------------|--------------|
| Narratives | Atoms |
| Linear flow | Graph traversal |
| Context | Isolation |
| Formatted documents | Raw data |

**Dynamic Assembly** bridges this gap: chunks remain atomic in storage, but humans receive assembled narratives. The assembly is a **view** — a transient construct — not a copy of truth.

### 1.2 What This Contract Prevents

- "Saving" assembled documents as new storage (duplication)
- Editing across chunk boundaries (corruption)
- Losing track of which chunks compose a document (lineage loss)
- Infinite recursion or circular traversal (system crash)

---

## 2. Definitions

| Term | Definition |
|------|------------|
| **Assembly** | A temporary, human-readable document constructed by traversing chunks and relationships |
| **Assembly Config** | Parameters that control traversal: root, depth, relations to follow, format |
| **Manifest Block** | A special block type that serves as the root of an assembly tree |
| **Traversal Profile** | A reusable set of traversal rules (e.g., "executive summary" vs. "full detail") |
| **Table of Contents (ToC)** | An auto-generated navigation structure derived from traversal order and block types |

---

## 3. The Assembly Model

### 3.1 Conceptual Flow

```
                                      ┌─────────────┐
                                      │  Assembled  │
                                      │  Document   │
                                      │  (View)     │
                                      └──────┬──────┘
                                             │
                                       Render Pass
                                             │
┌─────────────────────────────────────────────────────────────────┐
│                        ASSEMBLY ENGINE                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │Traverse │ -> │  Order  │ -> │ Format  │ -> │ Present │     │
│  │ Graph   │    │ Blocks  │    │ Output  │    │ to User │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
└─────────────────────────────────────────────────────────────────┘
                             │
                    Reads (never writes)
                             │
┌─────────────────────────────────────────────────────────────────┐
│                      KNOWLEDGE GRAPH                            │
│         ┌──────┐      ┌──────┐      ┌──────┐                   │
│         │Chunk │──────│Chunk │──────│Chunk │                   │
│         │  A   │      │  B   │      │  C   │                   │
│         └──────┘      └──────┘      └──────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Assembly is Read-Only

**Critical Invariant:** Assembly operations are pure reads. The engine traverses chunks and relationships but NEVER:
- Creates new chunks
- Modifies existing chunks
- Creates new relationships
- Modifies existing relationships

**WHY READ-ONLY:**
If assembly could write, viewing a document would have side effects. The same chunks assembled twice could produce different results. This violates determinism and audit integrity.

---

## 4. Invariants

### INV-C003-01: Assembly is Ephemeral
> **An assembled document MUST NOT be persisted as a unit. Only its constituent chunks and assembly config may be stored.**

**Justification:** Persisting assemblies creates duplication. The same information would exist in chunks AND in the assembled document. They will eventually diverge.

**Permitted:** Storing `AssemblyConfig` for reproducibility (a recipe, not a dish)

---

### INV-C003-02: Chunk Boundaries Preserved
> **The assembled document MUST visually or structurally indicate chunk boundaries.**

**Justification:** Users must know what they're editing. If boundaries are invisible, a user might attempt to edit "across" chunks, creating ambiguity about which chunk receives the change.

**Implementation Options:**
- Visual separators (lines, spacing)
- Card-based rendering (each chunk is a card)
- Hover-to-reveal boundaries
- Edit-mode explicit boundaries

---

### INV-C003-03: Traversal Determinism
> **Given the same AssemblyConfig and the same graph state, assembly MUST produce identical output.**

**Justification:** Non-deterministic assembly would make testing impossible and produce inconsistent user experiences. Assembly is a pure function: `f(config, graph) -> document`.

**Corollary:** Assembly does not depend on time, session, or user (except where config explicitly parameterizes these).

---

### INV-C003-04: Cycle Detection Required
> **The traversal algorithm MUST detect and handle cycles. Infinite recursion is a system failure.**

**Justification:** Knowledge graphs naturally develop cycles (A references B, B references A). The assembly engine must detect this and apply a termination strategy.

**Termination Strategies:**
- Visit-once: Each chunk appears at most once
- Depth limit: Stop traversal at configured max depth
- Explicit cycle marker: Show "[See Section X]" instead of repeating

---

### INV-C003-05: Configurable Depth
> **Assembly MUST support configurable traversal depth to enable executive summaries and detailed reports from the same source.**

**Justification:** Different users need different detail levels. A project manager wants the executive summary. An engineer wants full specs. Both should assemble from the same chunks.

**Depth Semantics:**
- Depth 0: Root chunk only
- Depth 1: Root + immediate children
- Depth N: Root + N levels of descendants
- Depth ∞: All reachable chunks (with cycle handling)

---

### INV-C003-06: Relationship Filtering
> **Assembly MUST support filtering which relationship types to traverse.**

**Justification:** Not all relationships should be included in all assemblies:
- "Structural" relationships (PARENT_OF, CONTAINS) define document structure
- "Semantic" relationships (IMPLEMENTS, DEPENDS_ON) define knowledge connections

An assembly might traverse only structural relations (for document flow) or include semantic (for knowledge map).

---

## 5. Assembly Configuration

### 5.1 Configuration Schema

```typescript
interface AssemblyConfig {
  // Required
  rootBlockId: BlockId;              // Starting point

  // Traversal
  strategy: 'depth-first' | 'breadth-first';
  followRelations: RelationType[];    // Which edges to traverse
  maxDepth: number;                   // Cycle prevention + detail control
  respectOrder: boolean;              // Use Edge.order for sequencing

  // Filtering
  includeTypes?: BlockType[];         // Only include these block types
  excludeTypes?: BlockType[];         // Exclude these block types
  tagFilter?: TagFilter;              // Include/exclude by tag

  // Presentation
  format: 'markdown' | 'html' | 'json';
  includeToc: boolean;
  includeMetadata: boolean;
  chunkBoundaryStyle: 'cards' | 'separators' | 'none';
}
```

### 5.2 Traversal Profiles (Presets)

| Profile | Depth | Relations | Types | Use Case |
|---------|-------|-----------|-------|----------|
| `executive` | 2 | PARENT_OF | requirement, manifest | High-level summary |
| `technical` | 5 | PARENT_OF, CONTAINS_ORDERED | spec, impl, test | Engineering detail |
| `audit` | ∞ | ALL | ALL | Compliance review |
| `presentation` | 3 | PARENT_OF | note, requirement | Stakeholder deck |

---

## 6. Verification Criteria

### 6.1 Automated Verification

| Check | When | Method |
|-------|------|--------|
| No writes during assembly | Continuous | Transaction mode: read-only |
| Determinism | On config change | Hash comparison of repeated assemblies |
| Cycle termination | On traversal | Visited-set size limit |

### 6.2 Integration Tests

| Test | Expected Behavior |
|------|-------------------|
| Assemble, modify chunk, assemble again | Second assembly reflects modification |
| Assemble with cycle in graph | Terminates without crash, shows cycle indicator |
| Assemble with depth=2 vs depth=5 | Different content, same root |
| Assemble same config twice | Byte-identical output |

### 6.3 User Acceptance Criteria

- [ ] User can clearly see where one chunk ends and another begins
- [ ] User can request different detail levels from same source
- [ ] Assembled document renders in < 500ms for typical graphs

---

## 7. Implementation Guidance

### 7.1 The Compositor Pattern

The assembly engine (Compositor) follows a pipeline:

1. **Parse Config** — Validate and normalize AssemblyConfig
2. **Traverse Graph** — Build ordered list of BlockIds to include
3. **Fetch Blocks** — Retrieve block content (batch for performance)
4. **Render Output** — Format blocks according to config
5. **Generate ToC** — If requested, create navigation structure
6. **Return View** — The assembled document (not persisted)

### 7.2 Performance Considerations

**WHY PERFORMANCE MATTERS:**
Assembly is a frequent operation. Slow assembly destroys user experience. The system should feel like browsing documents, not querying a database.

**Strategies:**
- Pre-compute common traversal paths (invalidate on graph change)
- Cache rendered fragments (keyed by block.id + block.updatedAt)
- Lazy-render off-screen content
- Stream output for very large assemblies

### 7.3 Edit Flow

When a user "edits" an assembled document:

1. User clicks within a chunk boundary
2. UI isolates that chunk for editing
3. Edit is applied to the CHUNK, not the assembly
4. Assembly is regenerated (ideally just the affected portion)

**Anti-Pattern:** Allowing edits that span chunks. This creates ambiguity and violates C001.

---

## 8. Relationship to Other Contracts

| Contract | Relationship |
|----------|--------------|
| [C001 — Semantic Chunk](./C001-semantic-chunk-architecture.md) | Assembly traverses chunks; chunks are atomic |
| [C002 — Authority Chain](./C002-authority-chain.md) | Assembled view may show authority indicators per chunk |
| [C005 — Audit Trail](./C005-audit-trail.md) | Assembly config is logged; chunk edits via assembly are audited |

---

## 9. UI Vision: Progressive Disclosure

Assembly serves the "Tethered Canvas" vision through layers:

### Layer 1: Narrative View (Default)
- Assembled document looks like a traditional document
- Chunk boundaries are subtle (spacing/styling)
- "Break Apart" button to reveal structure

### Layer 2: Structural View
- Chunks displayed as cards
- Relationships shown as tethers
- Drag to rearrange (creates new edge order)

### Layer 3: Full Graph
- Knowledge graph visualization
- Assembly path highlighted
- Filter by traversal profile

**WHY PROGRESSIVE DISCLOSURE:**
Most users most of the time want to read. The graph is powerful but overwhelming. Progressive disclosure lets users choose their complexity level.

---

## 10. Ratification

This contract is derived from Constitutional Principle 3, establishing the dynamic assembly mechanism that bridges atomic storage with human-readable presentation.

**Ratified:** 2025-01-XX
**Version:** 1.0.0
**Status:** ACTIVE

---

*Assembled documents are views, not copies. The chunks are the truth.*

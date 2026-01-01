# Glossary of Terms

> **Document Classification:** REFERENCE
> **Purpose:** Define terms used consistently across all documentation
> **Note:** Terms in ALL CAPS have contractual significance

---

## Core Concepts

### Block
The atomic unit of knowledge in the system. A discrete, complete semantic chunk that can be independently addressed, versioned, and governed.

**WHY:** Documents mix concerns. Blocks isolate them.

**Reference:** [C001 — Semantic Chunk Architecture](../contracts/C001-semantic-chunk-architecture.md)

---

### Edge
An explicit, typed relationship between two blocks. Edges are first-class entities with their own identity and metadata.

**Types:**
- Structural: PARENT_OF, CONTAINS_ORDERED
- Semantic: IMPLEMENTS, DEPENDS_ON, VERIFIED_BY, SUPERSEDES

**Reference:** [C001-INV-05](../contracts/C001-semantic-chunk-architecture.md#inv-c001-05-relationship-externalization)

---

### Assembly
A temporary, human-readable document constructed by traversing blocks and relationships. Assemblies are views — they do not persist.

**WHY:** Humans need narratives. Systems need atoms. Assembly bridges the gap.

**Reference:** [C003 — Dynamic Assembly](../contracts/C003-dynamic-assembly.md)

---

### Compositor
The engine that performs assembly. Takes an `AssemblyConfig` and produces a formatted document by traversing the graph.

**Reference:** [E001-S06](../epics/E001-core-foundation.md#e001-s06-document-compositor)

---

## Authority & Governance

### IMMUTABILITY LEVEL
The authority classification of a block that determines who can modify it.

| Level | Name | Meaning |
|-------|------|---------|
| 1 | MUTABLE | Any authorized user can modify |
| 2 | LOCKED | Requires elevated permission |
| 3 | IMMUTABLE | Requires formal change protocol |

**Reference:** [C002 — Authority Chain](../contracts/C002-authority-chain.md)

---

### CLEARANCE
The maximum authority level a principal (user or agent) may exercise. Clearance is identity-bound, not session-bound.

**User Clearance Mapping:**
- Viewer → 0
- Editor → 1
- Admin → 2
- Architect → 3

**Reference:** [C002-INV-02](../contracts/C002-authority-chain.md#inv-c002-02-principal-clearance-binding)

---

### Principal
Any actor that may read or write in the system. Includes human users and AI agents.

---

### ESCALATION
The formal process triggered when an operation is blocked due to insufficient clearance. Routes the request to a higher-authority principal for review.

**Reference:** [C002 Section 5](../contracts/C002-authority-chain.md#5-the-escalation-protocol)

---

### ESCALATION RUBRIC
The ordered evaluation steps for reviewing an escalation:
1. Execution Error
2. Tooling Error
3. Design Error
4. Constraint Error
5. Requirement Error

**WHY:** Most issues resolve at steps 1-2. The rubric prevents premature escalation to "just change the requirement."

---

## Agent Concepts

### Agent
An AI system that can read, reason about, and potentially modify blocks within defined authority bounds.

---

### AGENT TIER
The ranked level that determines an agent's capabilities and clearance.

| Tier | Name | Clearance | Role |
|------|------|-----------|------|
| 1 | Drones | 0 (read-only) | Linting, formatting, retrieval |
| 2 | Architects | 1 (mutable) | Drafting, synthesis, code generation |
| 3 | Judges | 3 (review) | Evaluate changes to protected content |

**Reference:** [C004 — Agent Hierarchy](../contracts/C004-agent-hierarchy.md)

---

### Orchestrator
The system component that assigns tasks to agents and manages their lifecycle.

---

### AGENTIC CHAT
A structured multi-agent deliberation process for evaluating changes to protected content. Three agents (Prosecutor, Defense, Judge) debate a proposed change.

**Reference:** [C004 Section 5](../contracts/C004-agent-hierarchy.md#5-the-agentic-chat-protocol)

---

### Motion
A formal request for permission to modify protected content. Submitted to Agentic Chat for evaluation.

---

### Verdict
The outcome of an Agentic Chat deliberation. Includes: outcome (approved/denied), reasoning, and rubric step reached.

---

## Audit & Consistency

### AUDIT LOG
An append-only record of all state-changing operations. Cannot be modified or deleted after creation.

**Reference:** [C005 — Audit Trail](../contracts/C005-audit-trail.md)

---

### TOMBSTONE
A marker indicating logical deletion without physical erasure. Preserves history while marking content as deleted.

**WHY:** Physical deletion destroys audit trail. Tombstones preserve accountability.

---

### Time-Travel Query
A query that retrieves system state at a specific past timestamp. Enabled by append-only logging.

---

### CONTRADICTION
Two blocks that assert logically incompatible facts. Detected by consistency scans.

---

### CONSISTENCY SCAN
An automated process that detects contradictions, orphans, and other integrity issues.

**Cadence:**
- Hourly: Incremental scan
- Nightly: Full verification

**Reference:** [C005 Section 5](../contracts/C005-audit-trail.md#5-consistency-verification)

---

## UI Concepts

### Tethered Canvas
The spatial UI metaphor where blocks float as cards connected by magnetic relationships. Progressive disclosure reveals complexity on demand.

**Reference:** [VISION.md Part III](../VISION.md#part-iii-the-tethered-canvas-vision)

---

### Semantic Magnetism
The physics-based behavior where blocks with strong relationships gravitate toward each other.

---

### Tether
A visual connection between blocks indicating a relationship. Appears on hover or toggle.

---

### Progressive Disclosure
UI pattern with three layers:
1. **Narrative View:** Clean reading
2. **Logic Layer:** Relationship types visible
3. **Gardener Interface:** Full editing

---

## Document Hierarchy

### CONSTITUTION
The immutable foundational principles of the system. Highest authority document.

**Reference:** [CONSTITUTION.md](../CONSTITUTION.md)

---

### CONTRACT
An immutable specification derived from Constitutional principles. Defines invariants that must always hold.

**Reference:** [Contracts Index](../contracts/README.md)

---

### EPIC
A strategic initiative that implements one or more contracts. Contains stories.

**Reference:** [Epics Index](../epics/README.md)

---

### Story
A tactical unit of work within an epic. Independently deliverable with defined acceptance criteria.

---

### INVARIANT
A condition that must always hold true. Violation indicates a system defect. Named with `INV-` prefix.

---

### ADR (Architecture Decision Record)
A document recording a key technical decision with rationale.

**Reference:** [architecture/DECISIONS.md](../architecture/DECISIONS.md)

---

## Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| CAP | Contract Amendment Proposal |
| CI/CD | Continuous Integration / Continuous Deployment |
| GDPR | General Data Protection Regulation |
| LLM | Large Language Model |
| MVP | Minimum Viable Product |
| SOTA | State of the Art |
| ToC | Table of Contents |
| UI/UX | User Interface / User Experience |
| UUID | Universally Unique Identifier |

---

*Use terms consistently. Shared vocabulary enables shared understanding.*

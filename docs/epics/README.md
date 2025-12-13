# Epics Index

> **Document Classification:** STRATEGIC PLANNING
> **Authority Level:** CONTRACT DERIVATIVE
> **Governance:** Each epic must trace to at least one [Contract](../contracts/README.md)
> **Purpose:** Define strategic initiatives that implement contract requirements

---

## What is an Epic?

In this system, an **Epic** is a strategic initiative that:

1. **Traces to** one or more Contracts
2. **Defines capabilities** the system must provide
3. **Decomposes into** Stories (tactical units of work)
4. **Delivers value** to specific user/system personas

**WHY EPICS EXIST:**
Contracts define invariants ("what must be true"). Epics define capabilities ("what users can do"). This separation ensures we build the *right* things (contracts) in the *right* way (epics).

---

## Document Hierarchy

```
CONSTITUTION.md
    │
    ▼
CONTRACTS (Invariants)
    │   C001: Semantic Chunk
    │   C002: Authority Chain
    │   C003: Dynamic Assembly
    │   C004: Agent Hierarchy
    │   C005: Audit Trail
    │
    ▼
EPICS (Capabilities)  ◄── YOU ARE HERE
    │   E001: Core Foundation
    │   E002: Governance System
    │   E003: Tethered Canvas UI
    │   E004: Agent Orchestration
    │   E005: KnowledgeOps
    │
    ▼
STORIES (Tactical Work)
        [Contained within each Epic]
```

---

## Epic Registry

| ID | Name | Primary Contracts | Phase | Status |
|----|------|-------------------|-------|--------|
| [E001](./E001-core-foundation.md) | Core Foundation | C001 | MVP | COMPLETE |
| [E002](./E002-governance-system.md) | Governance System | C002, C005 | 2A | IN PROGRESS |
| [E003](./E003-tethered-canvas-ui.md) | Tethered Canvas UI | C003 | 2B | PLANNED |
| [E004](./E004-agent-orchestration.md) | Agent Orchestration | C004, C002 | 3A | PLANNED |
| [E005](./E005-knowledge-ops.md) | KnowledgeOps Pipeline | C005 | 3B | PLANNED |

---

## Reading an Epic

Each epic follows a standard structure:

### 1. Header Block
- Classification and governance
- Contract traceability
- Status and phase

### 2. Vision Statement
- WHY this epic matters
- What user/system need it addresses
- What success looks like

### 3. Stories
- Tactical units of work
- Each story is independently deliverable
- Stories have acceptance criteria

### 4. Dependencies
- What must exist before this epic can proceed
- What other epics/systems this connects to

### 5. Risks & Mitigations
- What could go wrong
- How we prevent or respond to issues

---

## Epic Lifecycle

```
PROPOSED → APPROVED → IN PROGRESS → DELIVERED → CLOSED
    │          │           │             │          │
    │          │           │             │          └─ All stories complete
    │          │           │             └─ Value demonstrated
    │          │           └─ Stories being implemented
    │          └─ Contract alignment verified
    └─ Initial scoping complete
```

### Status Definitions

| Status | Meaning |
|--------|---------|
| PROPOSED | Epic scoped, awaiting approval |
| APPROVED | Contract alignment verified, ready for work |
| IN PROGRESS | At least one story in development |
| DELIVERED | All stories complete, value demonstrated |
| CLOSED | Epic complete, no further work expected |

---

## Traceability Requirements

### Upward Traceability
Every epic MUST demonstrate how it satisfies contract invariants:
```
Epic E001 satisfies:
  - C001-INV-01: Atomic Addressability → Story E001-S01
  - C001-INV-03: Typed Classification → Story E001-S02
  ...
```

### Downward Traceability
Every story within an epic MUST trace to specific invariants:
```
Story E001-S01: "Implement Block ID generation"
  Satisfies: C001-INV-01 (Atomic Addressability)
  Acceptance: Every block has UUID, IDs are globally unique
```

**WHY TRACEABILITY:**
Without explicit tracing, work becomes disconnected from purpose. We build features that don't satisfy requirements, or satisfy requirements nobody asked for. Traceability ensures alignment.

---

## Cross-References

- **Upstream:** [Contracts](../contracts/README.md) — Defines invariants epics must satisfy
- **Parallel:** [Architecture Decisions](../architecture/DECISIONS.md) — Technical choices within epic scope
- **Downstream:** Implementation code — Must trace to stories

---

## Phase Mapping

| Phase | Epics | Focus |
|-------|-------|-------|
| MVP (Phase 1) | E001 | Core data structures and UI |
| Phase 2A | E002 | Governance enforcement |
| Phase 2B | E003 | UI enhancements |
| Phase 3A | E004 | Agent infrastructure |
| Phase 3B | E005 | Operational automation |

---

*Epics bridge contracts to implementation. They answer "what capabilities will we build to satisfy invariants?"*

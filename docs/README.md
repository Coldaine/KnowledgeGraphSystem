# Documentation Index

> **Welcome to the Knowledge Graph System Documentation**

This documentation follows a spec-based design with immutable contracts. All decisions trace from principles to implementation.

---

## Document Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     CONSTITUTION                             │
│              Immutable Foundational Principles               │
│                        (The WHY)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       CONTRACTS                              │
│              Immutable Specifications                        │
│                (What invariants must hold)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         EPICS                                │
│                Strategic Initiatives                         │
│              (What capabilities we build)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION                            │
│                      Code + ADRs                             │
│                   (How we build it)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Links

### Foundational Documents

| Document | Purpose |
|----------|---------|
| [CONSTITUTION.md](./CONSTITUTION.md) | Immutable principles that govern the system |
| [VISION.md](./VISION.md) | Unified vision merging technical and governance goals |

### Specification Documents

| Document | Purpose |
|----------|---------|
| [Contracts Index](./contracts/README.md) | Immutable specifications |
| [C001 — Semantic Chunk](./contracts/C001-semantic-chunk-architecture.md) | Block architecture |
| [C002 — Authority Chain](./contracts/C002-authority-chain.md) | Governance model |
| [C003 — Dynamic Assembly](./contracts/C003-dynamic-assembly.md) | Document composition |
| [C004 — Agent Hierarchy](./contracts/C004-agent-hierarchy.md) | AI governance |
| [C005 — Audit Trail](./contracts/C005-audit-trail.md) | Logging & consistency |

### Planning Documents

| Document | Purpose |
|----------|---------|
| [Epics Index](./epics/README.md) | Strategic initiatives |
| [E001 — Core Foundation](./epics/E001-core-foundation.md) | MVP implementation |
| [E002 — Governance System](./epics/E002-governance-system.md) | Authority enforcement |
| [E003 — Tethered Canvas](./epics/E003-tethered-canvas-ui.md) | UI vision |
| [E004 — Agent Orchestration](./epics/E004-agent-orchestration.md) | AI infrastructure |
| [E005 — KnowledgeOps](./epics/E005-knowledge-ops.md) | Automated verification |

### Technical Documents

| Document | Purpose |
|----------|---------|
| [Architecture Decisions](./architecture/DECISIONS.md) | ADRs with rationale |
| [Glossary](./glossary/TERMS.md) | Term definitions |

---

## How to Navigate

### "I want to understand WHY decisions were made"
Start with [CONSTITUTION.md](./CONSTITUTION.md), then read [VISION.md](./VISION.md).

### "I want to understand WHAT invariants must hold"
Read the [Contracts](./contracts/README.md) — these are the immutable specifications.

### "I want to understand WHAT we're building"
Read the [Epics](./epics/README.md) — these are the strategic initiatives.

### "I want to understand HOW we're building it"
Read the [Architecture Decisions](./architecture/DECISIONS.md) — these explain technology choices.

### "I want to implement a feature"
1. Find the relevant Epic
2. Read the Stories within that Epic
3. Check which Contracts the Story satisfies
4. Read the ADRs for technology guidance

---

## Traceability

Every document in this system traces to its source:

- **Constitution** → Defines principles
- **Contracts** → Derive from principles, define invariants
- **Epics** → Derive from contracts, define capabilities
- **Stories** → Derive from epics, define work units
- **Code** → Derives from stories, implements features

**WHY TRACEABILITY:**
Without explicit tracing, work becomes disconnected from purpose. Traceability ensures:
- We build what we planned
- We can explain why anything exists
- Changes are impact-assessed

---

## Modification Rules

| Document Type | Modification Protocol |
|---------------|----------------------|
| CONSTITUTION | Unanimous consent + formal review |
| CONTRACTS | Contract Amendment Proposal |
| EPICS | Architect approval |
| STORIES | Team consensus |
| ADRs | Architect approval |

---

*This documentation is itself a knowledge graph. Contracts protect it.*

# Unified Vision: The Knowledge Graph System

> **Document Classification:** STRATEGIC VISION
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Governance:** Changes require alignment check against [CONSTITUTION.md](./CONSTITUTION.md)
> **References:** [Epics Index](./epics/README.md), [Architecture Decisions](./architecture/DECISIONS.md)

---

## Executive Summary

The Knowledge Graph System is a **Constitutional Knowledge Architecture** — a platform where information is protected proportionally to its importance, where authority is explicit rather than implicit, and where humans and AI agents collaborate within clearly defined boundaries.

**This is not just a documentation system. It is a governance framework for truth.**

---

## Part I: The Problem We Solve

### The Documentation Paradox

Organizations face an impossible choice:

| Traditional Wikis | Traditional Docs |
|------------------|------------------|
| Easy to update | Hard to update |
| Information decays | Information ossifies |
| No authority model | Implicit authority |
| Truth becomes opinion | Opinion becomes truth |

Both approaches fail because they conflate **information** with **presentation**:
- Wikis edit documents, not knowledge
- Traditional docs version documents, not truth
- Neither protects important information from casual override
- Neither detects contradictions until they cause failures

### The Agent Amplification Problem

As AI agents become more capable, they will:
1. Read and synthesize documentation
2. Propose and implement changes
3. Author new documentation and plans
4. Task subordinate agents

**Without governance, agents will "drift":**
- A junior agent may "interpret" a requirement in a way that subverts intent
- Multiple agents may create contradictory documentation
- Strategic decisions may be overridden by tactical expediency
- The human-AI authority relationship becomes unclear

**WHY THIS MATTERS NOW:**
We are in the "Governance Phase" of Generative AI (2025+). The experimental phase (2023-2024) is over. Organizations now need control, lineage, and accountability — not just capability.

---

## Part II: Our Solution Architecture

### The Three-Layer Model

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│        "The Tethered Canvas" / Dynamic Assembly              │
│     ┌─────────────────────────────────────────────────┐     │
│     │  Assembled Documents • Dashboards • Narratives  │     │
│     │  (Temporary views for human consumption)        │     │
│     └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Reads/Assembles
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE LAYER                           │
│              Semantic Chunks + Relationships                 │
│     ┌─────────────────────────────────────────────────┐     │
│     │  Blocks • Edges • Tags • Immutability Levels    │     │
│     │  (The actual source of truth)                   │     │
│     └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Governed by
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   GOVERNANCE LAYER                           │
│               Authority Chain + Audit Trail                  │
│     ┌─────────────────────────────────────────────────┐     │
│     │  Agent Hierarchy • Escalation • Consistency     │     │
│     │  (The rules that protect truth)                 │     │
│     └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**WHY THIS STRUCTURE:**
By separating these concerns, we achieve what neither wikis nor traditional docs can:
- **Presentation** can be infinitely flexible without affecting truth
- **Knowledge** can be atomically precise without sacrificing readability
- **Governance** can be strict without creating bureaucratic friction

---

## Part III: The "Tethered Canvas" Vision

### The Core Metaphor

Traditional document editors present a blank page. Traditional graph tools present a hairball of connections. Both are wrong.

**The Tethered Canvas presents:**
- **Floating cards** (semantic chunks) that are visually independent
- **Magnetic connections** (relationships) that pull related cards together
- **Progressive disclosure** that hides complexity until requested

### Semantic Magnetism

When a user drags Card A near Card B:
- If they share a strong edge in the Knowledge Graph, they **snap/gravitate** toward each other
- Visual weight (line thickness) indicates relationship strength
- Hovering reveals **tethers** — the explicit relationships

**WHY THIS METAPHOR:**
Humans need spatial reasoning. By making relationships physical (magnetism, gravity), we leverage intuition rather than forcing users to parse graph theory.

### The Three Interface Layers

| Layer | Name | Purpose | Interaction |
|-------|------|---------|-------------|
| 1 | Narrative View | "The Briefing" | Read assembled documents |
| 2 | Logic Layer | "The Why" | Toggle to see relationship types |
| 3 | Gardener Interface | "The Editing" | Human-in-loop taxonomy editing |

**Progressive Disclosure Flow:**
1. User starts with clean, readable document
2. "Break Apart" button reveals constituent chunks
3. "Show Logic" toggle reveals relationship taxonomy
4. "Edit Taxonomy" sidebar enables structural changes

**WHY PROGRESSIVE DISCLOSURE:**
Most users most of the time want to read. Some users sometimes want to understand structure. Few users rarely want to modify structure. The UI should match these probabilities.

---

## Part IV: The Agent Senate Architecture

### The Hierarchy

AI agents in this system operate within explicit tiers:

```
┌────────────────────────────────────────────────┐
│              TIER 3: THE JUDGES                │
│     Model: SOTA Reasoning (o1, Claude 3.5)     │
│     Role: Evaluate changes to immutable blocks │
│     Authority: Review and approve/deny         │
└────────────────────────────────────────────────┘
                      ▲
                      │ Escalates to
                      │
┌────────────────────────────────────────────────┐
│            TIER 2: THE ARCHITECTS              │
│     Model: Reasoning (GPT-4o, Claude Sonnet)   │
│     Role: Draft plans, write code, synthesize  │
│     Authority: Edit MUTABLE blocks only        │
└────────────────────────────────────────────────┘
                      ▲
                      │ Delegates to
                      │
┌────────────────────────────────────────────────┐
│              TIER 1: THE DRONES                │
│     Model: Fast (Gemini Flash, GPT-4o-mini)    │
│     Role: Linting, retrieval, formatting       │
│     Authority: READ-ONLY                       │
└────────────────────────────────────────────────┘
```

**WHY THIS HIERARCHY:**
Without structural enforcement, capable agents will "reason" their way around constraints. A sufficiently clever agent can argue that any requirement should be changed. Hierarchy makes certain changes structurally impossible regardless of reasoning quality.

### The "Motion to Change" Protocol

When any process (human or agent) attempts to modify an immutable chunk:

1. **Trigger** — System intercepts the edit attempt
2. **UI Lock** — Text field locked, "Drafting Change Request..." displayed
3. **Agentic Chat** — Three Tier-3 agents convene:
   - **Prosecutor**: Argues why change violates constraint
   - **Defense**: Argues why change is necessary
   - **Judge**: Weighs arguments, issues verdict
4. **Resolution** — Edit approved or denied with reasoning logged

**WHY AGENTIC CHAT:**
Single-agent evaluation is vulnerable to blind spots. The adversarial structure ensures that changes are stress-tested from multiple perspectives before approval.

---

## Part V: KnowledgeOps — Treating Truth Like Code

### The "Nightly Build" for Knowledge

Just as software runs CI/CD pipelines, the Knowledge Graph runs:

| Schedule | Process | Purpose |
|----------|---------|---------|
| Continuous | Linting Agents | Format, syntax, style compliance |
| Hourly | Consistency Scan | Detect contradictions |
| Nightly | Full Verification | Cross-reference all relationships |
| Weekly | Authority Audit | Verify permission integrity |

**WHY DEVOPS FOR KNOWLEDGE:**
Knowledge bases fail the same way code does — through accumulated small errors. The difference is that code fails loudly (crash) while knowledge fails silently (bad decision). Automated verification surfaces knowledge errors before they cause damage.

### Conflict Resolution Rules

When the system detects contradictions:

1. **Higher authority wins** — Immutable chunk beats mutable chunk
2. **More recent wins** (same authority) — Last-updated timestamp breaks ties
3. **Human wins** (same authority, same time) — Human edits override agent edits
4. **Explicit conflict flag** — If ambiguous, surface for manual resolution

**WHY THESE RULES:**
Explicit rules prevent paralysis. The system can auto-resolve most conflicts while flagging edge cases for human judgment.

---

## Part VI: Technical Alignment

### How This Maps to Current Implementation

| Vision Concept | Current Implementation | Status |
|----------------|----------------------|--------|
| Semantic Chunk | `Block` type | Implemented |
| Authority Level | `ImmutabilityLevel` enum | Implemented |
| Relationships | `Edge` with `relationType` | Implemented |
| Dynamic Assembly | `compositor.assemble()` | Implemented |
| Tethered Canvas | React Flow graph | Partial |
| Agent Hierarchy | — | Not started |
| KnowledgeOps | — | Not started |
| Escalation Protocol | — | Not started |

### The Path Forward

The existing MVP provides the **Knowledge Layer** foundation. The roadmap now shifts from "more features" to "governance capabilities":

1. **Phase 2A**: Implement authority enforcement (not just storage)
2. **Phase 2B**: Implement basic escalation protocol
3. **Phase 3A**: Implement agent tiering infrastructure
4. **Phase 3B**: Implement consistency checking pipeline
5. **Phase 4+**: Implement Tethered Canvas UI refinements

---

## Part VII: Success Criteria

This system succeeds when:

### For Users
- [ ] Reading documentation feels like reading, not graph parsing
- [ ] Editing is friction-appropriate (easy for notes, deliberate for requirements)
- [ ] Contradictions are surfaced before they cause damage
- [ ] The "why" behind any decision is traceable

### For Agents
- [ ] Authority boundaries are structurally enforced, not just documented
- [ ] Escalation is the only path for blocked operations
- [ ] Agent-to-agent communication uses the same chunk system as human documentation

### For Organizations
- [ ] Audit trail satisfies compliance requirements
- [ ] Critical knowledge is protected from accidental modification
- [ ] Human oversight of AI agents is built into the architecture

---

## Appendix: Vision Lineage

This unified vision synthesizes:

1. **Original Repository Vision** (README.md, PROJECT_SUMMARY.md)
   - Block-based architecture
   - Dual relationship model
   - React Flow visualization
   - LLM-powered chunking

2. **Constitutional Governance Vision** (User requirements)
   - Selective immutability with ACLs
   - Agent hierarchy with escalation
   - Dynamic assembly with configurable depth
   - KnowledgeOps automated verification

3. **Tethered Canvas UX Vision** (Design requirements)
   - Semantic magnetism metaphor
   - Progressive disclosure layers
   - Motion-to-change protocol UI

**WHY UNIFICATION MATTERS:**
A fragmented vision creates a fragmented system. By explicitly merging these perspectives into a single document with clear traceability, we prevent the vision itself from drifting.

---

*This document is authoritative for strategic direction. All epics and stories must demonstrate alignment.*

*References: [CONSTITUTION.md](./CONSTITUTION.md) | [Epics](./epics/README.md) | [Contracts](./contracts/README.md)*

# Unified Vision: Knowledge Graph System

> **Document Status**: Foundational
> **Authority Level**: Requires human approval for modifications
> **Cross-References**: [ROADMAP.md](./ROADMAP.md) | [types/index.ts](./src/types/index.ts) | [README.md](./README.md)

---

## Preamble: Why This Document Exists

This document unifies two philosophical approaches into a single, coherent vision:

1. **The Technical Foundation** — A block-based knowledge management system with graph visualization, intelligent document assembly, and LLM-powered processing (existing implementation).

2. **The Governance Framework** — A set of requirements for access control, immutability enforcement, agent collaboration, and operational integrity (requirements specification).

**The synthesis is necessary because**: Technical capability without governance leads to chaos; governance without technical capability leads to bureaucracy. A knowledge system that will be operated by both humans and AI agents requires both—the ability to dynamically compose and retrieve knowledge AND the ability to protect, audit, and escalate when that knowledge is contested.

---

## I. Immutable Principles

These principles are **foundational and non-negotiable**. They represent the philosophical bedrock upon which all other decisions rest. Any proposal to modify these principles triggers the [Immutable Change Review Protocol](#d-immutable-change-review-protocol).

### Principle 1: The Block is the Atomic Unit

> **WHY**: Atomicity enables composition. A system built on large, monolithic documents cannot be selectively queried, dynamically assembled, or granularly protected. By making the Block the fundamental unit, we gain:
> - Surgical immutability (protect a single requirement, not an entire document)
> - Flexible retrieval (assemble views at any depth)
> - Semantic relationships (connect specific ideas, not just files)

**Implementation Reference**: [types/index.ts:60-104](./src/types/index.ts) — The `Block` interface
**Related Principle**: [Configurable Depth](#principle-3-configurable-depth-of-retrieval)

```typescript
// The Block: atomic, typed, auditable, protectable
Block {
  id: BlockId;
  type: BlockType;
  content: string;           // Markdown/MDX
  immutability: ImmutabilityLevel;
  createdBy: string;
  version: number;
  // ...
}
```

---

### Principle 2: Dual Relationship Model

> **WHY**: Knowledge exists in two dimensions simultaneously—**hierarchical structure** (for document assembly) and **semantic meaning** (for knowledge graphs). Collapsing these into a single relationship type forces a false choice between "Where does this belong?" and "What does this relate to?"

| Structural Relationships | Purpose | Example |
|--------------------------|---------|---------|
| `PARENT_OF` | Hierarchy | Manifest → Sections |
| `CONTAINS_ORDERED` | Sequence | Chapter → Paragraphs |
| `SECTION_OF` | Grouping | Block → Parent Section |

| Semantic Relationships | Purpose | Example |
|------------------------|---------|---------|
| `IMPLEMENTS` | Realization | Code → Requirement |
| `CONTRADICTS` | Conflict | Statement ↔ Statement |
| `DEPENDS_ON` | Dependency | Feature → Feature |
| `ELABORATES` | Expansion | Detail → Summary |

**Implementation Reference**: [types/index.ts:172-191](./src/types/index.ts) — `StructuralRelation` and `SemanticRelation` enums

**This enables**:
- Assembling a document by traversing structural relationships
- Discovering contradictions by traversing semantic relationships
- Answering "What implements Requirement X?" without breaking document structure

---

### Principle 3: Configurable Depth of Retrieval

> **WHY**: Different users need different granularities of the same knowledge. An executive needs a summary; an engineer needs exhaustive detail. Forcing everyone to consume the same format wastes time and obscures critical information.

The system must support:
- **Executive Briefing**: Traverse only top-level blocks, generate summary
- **Working Document**: Traverse all blocks to configured depth, full content
- **Audit Trail**: Traverse all blocks, include metadata, provenance, version history

**Implementation Reference**: [lib/compositor/index.ts](./src/lib/compositor/index.ts) — `TraversalProfile` and `AssemblyConfig`

```typescript
// Configurable traversal enables multiple views of same data
TraversalProfile {
  strategy: 'depth-first' | 'breadth-first';
  maxDepth: number;
  followRelations: RelationType[];
  respectOrder: boolean;
}
```

---

### Principle 4: Three-Tier Immutability with Authority Chain

> **WHY**: Protection without hierarchy is either useless (anyone can unlock) or paralyzing (nothing can change). The three tiers map to natural organizational authority levels.

| Level | Meaning | Who Can Modify | Use Case |
|-------|---------|----------------|----------|
| **Mutable** | Normal editing | Any authorized user/agent | Draft content, working notes |
| **Locked** | Requires explicit unlock | Users/agents with unlock permission | Reviewed content, approved drafts |
| **Immutable** | Requires elevated authority | Only designated authorities | Core requirements, legal constraints, strategic decisions |

**Critical addition from requirements document**: Immutability is not just a technical flag—it carries **authorization level context**. An `IMMUTABLE` block marked by a principal architect cannot be modified by a junior agent, even if that agent has general edit permissions.

**Implementation Reference**: [types/index.ts:41-45](./src/types/index.ts) — `ImmutabilityLevel` enum
**Extension Needed**: Add `authorityLevel` and `markedBy` fields (see [Type Extensions](#type-extensions-for-authority-chain))

---

### Principle 5: Dual-State Operation

> **WHY**: Humans and AI agents consume knowledge differently. Humans need readable documents with familiar formatting. Agents need raw, structured data for processing. The system must serve both without forcing translation.

- **Human View**: Dynamically assembled document with table of contents, visual chunk boundaries, familiar formatting
- **Agent View**: Raw block access, direct relationship traversal, structured queries

**The assembled document is ephemeral**. It exists only for human consumption and is regenerated on demand. The source of truth is always the raw blocks and their relationships.

**Visual Structure Requirement** (from requirements document): When a document is assembled for viewing/editing, the underlying semantic chunk structure must be visually apparent. This aids comprehension and makes clear which sections are discrete units that could be independently modified or protected.

---

### Principle 6: Comprehensive Audit Trail

> **WHY**: Knowledge systems operated by AI agents will inevitably make mistakes. Without comprehensive logging, those mistakes are invisible, unaccountable, and unrepairable. Audit trails enable:
> - Debugging agent behavior
> - Compliance and accountability
> - Rollback and recovery
> - Pattern detection for improvement

**Every action must be logged**:
- Block creation, modification, deletion
- Immutability changes (especially elevations)
- Access events (who read what, when)
- Agent escalation events
- Conflict detection and resolution

**Implementation Reference**: [types/index.ts:415-423](./src/types/index.ts) — `UserAction` interface
**Extension Needed**: Add `EscalationEvent`, `ConflictRecord`, and enhanced audit types

---

## II. Operational Processes

These processes implement the principles above. They define **how** the system behaves at runtime.

### A. Automated Review & Inconsistency Detection

> **WHY**: As the knowledge base grows and multiple agents contribute, inconsistencies will emerge. Waiting for humans to discover them is inefficient and dangerous. Proactive detection catches problems early.

**Implementation**:

1. **Cadenced Reviews**: The system runs automated reviews on a configurable schedule (e.g., nightly) to detect:
   - Contradictions (blocks with `CONTRADICTS` relationships)
   - Redundancies (semantically similar blocks that should be merged)
   - Orphans (blocks with no relationships)
   - Stale content (blocks not updated within threshold)

2. **Authoritative Conflict Resolution**: When conflicts are detected, default resolution favors:
   - More recent updates from more authoritative sources
   - User-group hierarchy determines authority
   - Unresolvable conflicts are surfaced for human review

3. **Continuous Maintenance Agents**: Background agents perform:
   - Formatting linting
   - Link validation
   - Tag normalization
   - Relationship integrity checks

**Cross-Reference**: These agents are part of [Phase 4: AI Enhancement](./ROADMAP.md#phase-4-ai-enhancement-q3-2025) in the roadmap

---

### B. Criticality Dashboard & Monitoring

> **WHY**: Detected issues must be visible. A dashboard provides centralized visibility into system health and surfaces problems by severity.

**Dashboard Components**:

| Widget | Purpose |
|--------|---------|
| **Conflict Tracker** | Unresolved contradictions, ranked by criticality |
| **Escalation Queue** | Agent escalation events awaiting review |
| **Authority Changes** | Recent immutability elevations/demotions |
| **Health Metrics** | Orphan blocks, stale content, broken links |
| **Agent Activity** | Recent agent actions, success/failure rates |

**Criticality Levels**:
- **Critical**: Contradictions in immutable content, failed escalations
- **High**: Unresolved conflicts, authority violations
- **Medium**: Redundancies, stale content warnings
- **Low**: Formatting issues, optimization suggestions

**UI Consideration**: This extends the existing [Dashboard system](./src/components/Dashboard/Dashboard.tsx) with new widget types specifically for system health monitoring.

---

### C. Agent Escalation Protocol

> **WHY**: Agents operating autonomously will encounter situations where their tasking conflicts with reality. Without a formal escalation process, agents either fail silently (hiding problems) or halt entirely (blocking progress). The escalation protocol provides a structured middle path.

**Trigger Condition**: An escalation event is triggered when:
1. A subordinate agent determines that an immutable requirement in its tasking is incorrect, unachievable, or flawed
2. AND changing it would exceed the agent's designated authority

**Escalation Process**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT ESCALATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Agent encounters conflict with immutable requirement        │
│                          ↓                                      │
│  2. Agent logs conflict with full context                       │
│                          ↓                                      │
│  3. Escalation event created → appears on Criticality Dashboard │
│                          ↓                                      │
│  4. Higher-level agent or human is summoned for review          │
│                          ↓                                      │
│  5. Reviewer applies Formal Evaluation Rubric (see below)       │
│                          ↓                                      │
│  6. Resolution is logged, agent is unblocked                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Formal Evaluation Rubric** (applied in order—stop at first match):

| Order | Error Type | Question | Resolution |
|-------|------------|----------|------------|
| 1 | **Execution Error** | Did the junior agent fail to apply the task correctly due to limited knowledge? | Provide guidance, no requirement change |
| 2 | **Tooling Error** | Was the wrong tool or method used for the proposed design? | Suggest alternative tool, no requirement change |
| 3 | **Design Error** | Is the implementation design itself flawed? | Revise design, no requirement change |
| 4 | **Constraint Error** | Are the requirements technically possible but overly stringent? | Relax constraints, minor requirement adjustment |
| 5 | **Requirement Error** | Are the core, immutable requirements fundamentally wrong? | Trigger [Immutable Change Review Protocol](#d-immutable-change-review-protocol) |

**Implementation Reference**: See [Type Extensions](#type-extensions-for-escalation-events) for `EscalationEvent` type

---

### D. Immutable Change Review Protocol

> **WHY**: Immutable content exists precisely because it should not change lightly. But "immutable" cannot mean "permanent"—requirements evolve, errors are discovered, context shifts. The protocol ensures changes are deliberate, reviewed, and audited.

**Trigger**: Any modification to content previously marked as immutable, regardless of who initiates it.

**Review Process (AI-Initiated Changes)**:

1. **Agentic Chat**: The proposing agent invokes a collaborative review session
   - **Advocate Agent**: Argues for the proposed change
   - **Critic Agent**: Argues against the proposed change
   - **Neutral Agent**: Evaluates both perspectives, identifies missing considerations

2. **Structured Output**: The review produces:
   - Summary of proposed change
   - Arguments for and against
   - Risk assessment
   - Recommended action (approve, reject, escalate to human)

3. **Audit Log**: Full review transcript is logged regardless of outcome

**Review Process (Human-Initiated Changes)**:

1. **Dual Authorization**: For certain critical changes, require sign-off from a second authorized human
2. **Change Justification**: Mandatory field explaining why the immutable content must change
3. **Impact Analysis**: System-generated report of what depends on the changing content

**Cross-Reference**: This protocol interacts with the [Audit Trail](#principle-6-comprehensive-audit-trail) and [Authority Chain](#principle-4-three-tier-immutability-with-authority-chain)

---

## III. User Experience Philosophy

### A. Visual Chunk Boundaries

> **WHY**: When editing a dynamically assembled document, users must understand they are editing discrete units, not a monolithic file. Visual boundaries prevent accidental cross-chunk edits and make the system's structure transparent.

**Implementation Approach**:
- Subtle borders or background color shifts between blocks
- Block type indicators (icon or label) visible in edit mode
- Immutability indicators (lock icon, shield icon) directly on blocks
- Collapse/expand controls for block content

**Existing Pattern**: The [Block component](./src/components/Block/Block.tsx) already implements visual type differentiation and immutability indicators. This extends that pattern to the document assembly view.

---

### B. On-the-Fly Formatting

> **WHY**: Users expect traditional document affordances (table of contents, page numbers, headers) even when the underlying structure is block-based. Generate these dynamically rather than storing them.

**Dynamic Features**:
- Table of contents generated from block hierarchy
- Section numbering based on structural relationships
- Header levels derived from traversal depth
- Cross-references resolved from semantic relationships

**Implementation Reference**: [lib/compositor/index.ts](./src/lib/compositor/index.ts) — `includeToc` option already supported

---

### C. Graph View as Primary Navigation

> **WHY**: Traditional file browsers obscure relationships. A graph view makes connections explicit and enables navigation by meaning rather than by folder structure.

**Current Implementation**: [GraphView component](./src/components/GraphView/GraphView.tsx) with React Flow

**Enhancement Considerations**:
- Filter by authority level (show only immutable content)
- Highlight escalation hotspots (blocks involved in recent escalations)
- Contradiction overlay (visualize `CONTRADICTS` relationships prominently)
- Agent activity traces (animate recent agent paths through the graph)

---

### D. The Block as a "Card" with Flip Interaction

> **WHY**: The double-click flip metaphor (already implemented) naturally supports the dual nature of blocks—content on front, metadata on back. This pattern should extend to:
> - Front: Human-readable content
> - Back: Authority info, audit trail summary, relationship map

**Existing Pattern**: [Block.tsx](./src/components/Block/Block.tsx) — Double-click flip animation with Framer Motion

**Extension**: Add to back face:
- `markedImmutableBy` (who set the immutability level)
- `authorityLevel` (what level of authority is required to modify)
- Recent escalation events involving this block
- Relationship minimap

---

## IV. Type Extensions for Unified Vision

The following type additions are needed to fully support the unified vision. These extend [types/index.ts](./src/types/index.ts).

### Type Extensions for Authority Chain

```typescript
/**
 * Authority levels in the system hierarchy
 * WHY: Immutability without authority levels is binary.
 * With authority levels, we can express "immutable to junior agents
 * but modifiable by senior architects."
 */
export enum AuthorityLevel {
  SYSTEM = 'system',           // System-defined, highest authority
  PRINCIPAL = 'principal',     // Principal architects, strategic decisions
  SENIOR = 'senior',           // Senior contributors, reviewed decisions
  CONTRIBUTOR = 'contributor', // Standard contributors
  AGENT = 'agent',             // AI agents (default)
  VIEWER = 'viewer',           // Read-only access
}

/**
 * Extended Block interface with authority tracking
 */
export interface BlockAuthority {
  immutability: ImmutabilityLevel;
  authorityLevel: AuthorityLevel;      // Required authority to modify
  markedBy: string;                     // Who set the immutability
  markedAt: Date;                       // When immutability was set
  justification?: string;               // Why this is immutable
}
```

### Type Extensions for Escalation Events

```typescript
/**
 * Escalation event when an agent encounters immutable constraint conflict
 */
export interface EscalationEvent {
  id: string;
  timestamp: Date;

  // Context
  agentId: string;
  taskDescription: string;
  conflictingBlockId: BlockId;

  // Conflict details
  expectedBehavior: string;
  actualConstraint: string;
  proposedResolution?: string;

  // Evaluation
  errorType?: 'execution' | 'tooling' | 'design' | 'constraint' | 'requirement';
  evaluatedBy?: string;
  evaluatedAt?: Date;

  // Resolution
  status: 'pending' | 'reviewed' | 'resolved' | 'escalated_to_human';
  resolution?: string;
  resultingChanges?: BlockId[];
}

/**
 * Agentic review session for immutable change proposals
 */
export interface AgenticReview {
  id: string;
  proposedChange: {
    blockId: BlockId;
    currentContent: string;
    proposedContent: string;
    justification: string;
  };

  // Review perspectives
  advocateArguments: string[];
  criticArguments: string[];
  neutralAssessment: string;

  // Outcome
  recommendation: 'approve' | 'reject' | 'escalate_to_human';
  confidence: number;

  // Audit
  reviewedAt: Date;
  transcript: string;
}
```

### Type Extensions for Conflict Detection

```typescript
/**
 * Detected inconsistency in the knowledge base
 */
export interface ConflictRecord {
  id: string;
  type: 'contradiction' | 'redundancy' | 'orphan' | 'stale';

  // Involved blocks
  blockIds: BlockId[];

  // Detection
  detectedAt: Date;
  detectedBy: 'automated_review' | 'agent' | 'human';

  // Classification
  criticality: 'critical' | 'high' | 'medium' | 'low';

  // Resolution
  status: 'unresolved' | 'in_review' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;
}
```

---

## V. Cross-Reference Summary

| This Document Section | References |
|-----------------------|------------|
| [Principle 1: Atomic Blocks](#principle-1-the-block-is-the-atomic-unit) | [types/index.ts:60-104](./src/types/index.ts) |
| [Principle 2: Dual Relationships](#principle-2-dual-relationship-model) | [types/index.ts:172-191](./src/types/index.ts) |
| [Principle 3: Configurable Depth](#principle-3-configurable-depth-of-retrieval) | [lib/compositor/index.ts](./src/lib/compositor/index.ts) |
| [Principle 4: Authority Chain](#principle-4-three-tier-immutability-with-authority-chain) | [types/index.ts:41-45](./src/types/index.ts), [Type Extensions](#type-extensions-for-authority-chain) |
| [Process C: Escalation Protocol](#c-agent-escalation-protocol) | [Type Extensions](#type-extensions-for-escalation-events), [ROADMAP.md Phase 4](./ROADMAP.md) |
| [Process D: Immutable Change Review](#d-immutable-change-review-protocol) | [Type Extensions](#type-extensions-for-escalation-events) |
| [UX: Visual Boundaries](#a-visual-chunk-boundaries) | [Block.tsx](./src/components/Block/Block.tsx) |
| [UX: Graph Navigation](#c-graph-view-as-primary-navigation) | [GraphView.tsx](./src/components/GraphView/GraphView.tsx) |

---

## VI. Natural Patterns That Will Emerge

> **WHY THIS SECTION**: Understanding how patterns naturally emerge helps us design for them rather than against them.

### Pattern: Authority Stratification

As the system matures, content will naturally stratify:
- **Core immutable layer**: Strategic decisions, legal constraints, architectural principles
- **Reviewed locked layer**: Approved designs, verified implementations
- **Working mutable layer**: Drafts, explorations, work-in-progress

The system should visualize this stratification, perhaps as depth in the graph view.

### Pattern: Escalation Clustering

Certain blocks will become "escalation hotspots"—requirements that agents frequently conflict with. These hotspots are signals:
- The requirement may be unclear and need refinement
- The requirement may be unrealistic and need relaxation
- The agents may need better training on this domain

The dashboard should surface these clusters for human attention.

### Pattern: Trust Gradient

Over time, some agents will prove more reliable than others. The system should support (but not initially implement) the concept of agent trust levels that affect:
- Whether agent changes require review
- What authority level agent-authored content receives
- How escalation events from that agent are prioritized

---

## VII. What This Vision Does NOT Prescribe

To avoid over-engineering, this vision explicitly leaves the following as implementation details:

1. **Specific UI layouts** — The principles describe what information must be available, not where buttons go
2. **Database technology** — Neo4j is planned but not mandated; the principles work with any graph-capable storage
3. **Specific LLM providers** — The agentic review process is provider-agnostic
4. **Authentication mechanisms** — The authority chain requires authorization, but JWT vs OAuth vs other is implementation detail
5. **Notification systems** — Escalations must be surfaced, but email vs Slack vs in-app is implementation detail

---

## VIII. Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-01-XX | Initial | Unified vision document created, merging technical foundation with governance framework |

---

*This document is itself subject to the [Immutable Change Review Protocol](#d-immutable-change-review-protocol) for its core principles (Section I). Operational processes (Section II) and UX philosophy (Section III) may be modified through standard review processes.*

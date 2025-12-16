# Architecture Decision Records (ADRs)

> **Document Classification:** TECHNICAL REFERENCE
> **Authority Level:** EPIC DERIVATIVE
> **Governance:** Decisions must align with [Contracts](../contracts/README.md)
> **Purpose:** Document key technical decisions with rationale

---

## How to Read This Document

Each ADR follows the format:
1. **Decision:** What we decided
2. **Status:** Proposed | Accepted | Deprecated | Superseded
3. **Context:** The situation that required a decision
4. **Alternatives:** Other options considered
5. **Decision:** The choice made
6. **Rationale (WHY):** Why this choice was made
7. **Consequences:** What this decision enables and constrains
8. **Contract Alignment:** How this satisfies contract requirements

---

## ADR-001: Block as Atomic Unit

**Status:** Accepted

### Context
The system needs a fundamental data structure for storing knowledge. Traditional options include:
- Full documents (markdown files)
- Paragraphs (text units)
- Sentences (smallest meaningful unit)
- Custom "blocks" (defined semantic units)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Documents | Simple, familiar | Too coarse for granular control |
| Paragraphs | Natural boundaries | May split related thoughts |
| Sentences | Maximum granularity | Too fine, loses context |
| Blocks | Flexible, semantic | Requires careful definition |

### Decision
Use "Block" as the atomic unit — a discrete, complete semantic chunk that can be independently addressed, versioned, and governed.

### Rationale (WHY)
**Blocks solve the granularity problem:**
- Documents are too coarse for selective immutability
- Sentences are too fine for meaningful governance
- Blocks are "just right" — complete thoughts that can stand alone

**Blocks enable the core vision:**
- Each block can have its own authority level
- Blocks can be assembled into different documents
- Relationships between blocks are explicit and queryable

### Consequences
- **Enables:** Granular immutability, dynamic assembly, relationship graphs
- **Constrains:** Cannot edit across block boundaries, requires chunking on ingest
- **Requires:** LLM-powered chunking for good block boundaries

### Contract Alignment
- Satisfies [C001-INV-01](../contracts/C001-semantic-chunk-architecture.md#inv-c001-01-atomic-addressability): Atomic Addressability
- Satisfies [C001-INV-02](../contracts/C001-semantic-chunk-architecture.md#inv-c001-02-self-contained-meaning): Self-Contained Meaning

---

## ADR-002: React Flow for Graph Visualization

**Status:** Accepted

### Context
The system needs to visualize knowledge as a graph. Options include:
- D3.js (low-level, maximum control)
- Cytoscape.js (graph-focused, good performance)
- React Flow (React-native, node-based UIs)
- vis.js (general-purpose network visualization)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| D3.js | Maximum flexibility | Steep learning curve, manual React integration |
| Cytoscape.js | Graph algorithms built-in | Not React-native, style system differs |
| React Flow | React-native, modern, active community | Less graph algorithms |
| vis.js | Feature-rich | Older, React integration awkward |

### Decision
Use React Flow for graph visualization, with d3-force for physics extensions.

### Rationale (WHY)
**React Flow fits the stack:**
- Next.js + React is the chosen frontend stack
- React Flow is React-native with hooks support
- Active development and strong community
- Built-in support for custom nodes and edges

**Physics extension:**
- React Flow doesn't include advanced physics
- d3-force integrates cleanly for semantic magnetism
- This combination provides both UI polish and physics capability

### Consequences
- **Enables:** Smooth React integration, custom node components, physics simulation
- **Constrains:** Graph algorithms must be implemented separately
- **Requires:** Custom hooks for d3-force integration

### Contract Alignment
- Supports [C003-INV-02](../contracts/C003-dynamic-assembly.md#inv-c003-02-chunk-boundaries-preserved): Visual chunk boundaries
- Supports Tethered Canvas UX vision (see [E003](../epics/E003-tethered-canvas-ui.md))

---

## ADR-003: Zustand for State Management

**Status:** Accepted

### Context
The frontend needs state management for blocks, edges, UI state, and user preferences. Options include:
- Redux (industry standard, verbose)
- MobX (observable-based, less boilerplate)
- Zustand (minimal, hooks-based)
- Jotai/Recoil (atomic, fine-grained)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Redux | Battle-tested, DevTools | Verbose, boilerplate heavy |
| MobX | Automatic reactivity | Magic, learning curve |
| Zustand | Simple, TypeScript-native | Less ecosystem |
| Jotai | Fine-grained updates | Atomicity adds complexity |

### Decision
Use Zustand with persist middleware for state management.

### Rationale (WHY)
**Zustand is simple:**
- Minimal boilerplate matches project philosophy
- TypeScript-native with excellent inference
- Persist middleware handles localStorage seamlessly

**Zustand scales:**
- Despite simplicity, handles complex state well
- Slices pattern enables modularity
- DevTools available for debugging

### Consequences
- **Enables:** Fast development, type safety, persistence
- **Constrains:** Less ecosystem than Redux
- **Requires:** Manual optimization for large state trees

### Contract Alignment
- Supports E001-S08 (Persistence Layer)
- Foundation for E002 governance state

---

## ADR-004: Three-Tier Authority Model

**Status:** Accepted

### Context
The system needs authority levels to protect important information. Options range from:
- Binary (editable/locked)
- Three-tier (mutable/locked/immutable)
- Five-tier (none/low/medium/high/absolute)
- Role-based (per-user permissions)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Binary | Simple | Insufficient granularity |
| Three-tier | Intuitive, maps to workflows | May need extension |
| Five-tier | Fine-grained | Confusing, overhead |
| Role-based only | Flexible | Doesn't protect content inherently |

### Decision
Use three-tier authority (Mutable, Locked, Immutable) combined with role-based clearance.

### Rationale (WHY)
**Three tiers map to real workflows:**
- **Mutable:** Working documents, drafts, notes
- **Locked:** Approved specs, reviewed designs
- **Immutable:** Requirements, compliance, contracts

**More tiers add confusion:**
- Users struggle to distinguish 5 levels
- Three is cognitively manageable
- Extension possible via contract amendment if needed

### Consequences
- **Enables:** Clear governance model, intuitive UI
- **Constrains:** May need amendment for complex enterprises
- **Requires:** Mapping user roles to clearance levels

### Contract Alignment
- Satisfies [C002](../contracts/C002-authority-chain.md): Authority Chain contract
- Three-tier model defined in C002 Section 3.1

---

## ADR-005: LLM-Powered Document Chunking

**Status:** Accepted

### Context
When users ingest documents, the system must decompose them into blocks. Options:
- Rule-based (split on headers, paragraphs)
- ML-based (sentence embeddings, clustering)
- LLM-based (semantic understanding)
- Hybrid (rules + ML/LLM)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Rule-based | Fast, predictable | Poor semantic boundaries |
| ML clustering | Better boundaries | Requires training data |
| LLM-based | Best semantic understanding | Cost, latency |
| Hybrid | Balance speed/quality | Complexity |

### Decision
Use LLM-powered chunking (Gemini API) with rule-based fallback.

### Rationale (WHY)
**Semantic chunking is critical:**
- [C001-INV-02](../contracts/C001-semantic-chunk-architecture.md#inv-c001-02-self-contained-meaning) requires self-contained meaning
- Rule-based chunking splits mid-thought
- LLMs understand semantic boundaries

**Cost is acceptable:**
- Chunking happens at ingest, not continuously
- Gemini Flash provides good quality at low cost
- Caching reduces repeated chunking

### Consequences
- **Enables:** High-quality semantic chunks, relationship extraction
- **Constrains:** Requires API key, adds ingest latency
- **Requires:** Error handling for API failures

### Contract Alignment
- Satisfies [C001-INV-02](../contracts/C001-semantic-chunk-architecture.md#inv-c001-02-self-contained-meaning): Self-Contained Meaning
- Supports [C001-INV-05](../contracts/C001-semantic-chunk-architecture.md#inv-c001-05-relationship-externalization): Relationship extraction

---

## ADR-006: Append-Only Audit Log

**Status:** Accepted

### Context
The system needs audit logging for compliance and debugging. Options for log mutability:
- Mutable logs (can correct mistakes)
- Soft-immutable (delete via admin)
- Append-only (never modify/delete)
- Blockchain-anchored (cryptographic proof)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Mutable | Flexible | No compliance value |
| Soft-immutable | Admin override | Audit trail questionable |
| Append-only | Strong compliance | No error correction |
| Blockchain | Cryptographic proof | Complexity, cost |

### Decision
Use append-only logs with optional blockchain anchoring for enterprise.

### Rationale (WHY)
**Append-only is the minimum bar:**
- [C005-INV-01](../contracts/C005-audit-trail.md#inv-c005-01-append-only-log) requires append-only
- Mutable logs defeat the purpose of auditing
- Compliance frameworks (SOC 2, HIPAA) expect immutable logs

**Blockchain is optional:**
- Provides cryptographic proof for high-compliance environments
- Not needed for most users
- Can be added as enterprise feature

### Consequences
- **Enables:** Compliance, accountability, debugging
- **Constrains:** Cannot "fix" log mistakes
- **Requires:** Careful log entry design (can't change later)

### Contract Alignment
- Satisfies [C005-INV-01](../contracts/C005-audit-trail.md#inv-c005-01-append-only-log): Append-Only Log
- Foundation for time-travel queries ([C005-INV-04](../contracts/C005-audit-trail.md#inv-c005-04-time-travel-queries-supported))

---

## ADR-007: Agent Tier Model

**Status:** Proposed

### Context
The system will use AI agents for automation. Options for agent governance:
- Flat (all agents equal)
- Role-based (agents have roles, not levels)
- Tiered (explicit hierarchy)
- Capability-based (permissions per action)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Flat | Simple | No hierarchy enforcement |
| Role-based | Flexible | Doesn't prevent drift |
| Tiered | Clear hierarchy | Less flexible |
| Capability-based | Fine-grained | Complex to manage |

### Decision
Use three-tier agent model (Drones, Architects, Judges) with tier-derived clearance.

### Rationale (WHY)
**Hierarchy prevents drift:**
- Agents are getting more capable
- Without structural limits, agents reason around constraints
- Tier hierarchy makes certain changes impossible

**Three tiers map to operational reality:**
- High-volume, low-risk tasks (Tier 1)
- Creative, bounded tasks (Tier 2)
- Critical evaluation tasks (Tier 3)

### Consequences
- **Enables:** Safe AI automation, clear accountability
- **Constrains:** No agent self-elevation, strict boundaries
- **Requires:** Orchestrator to assign tiers, tier enforcement hooks

### Contract Alignment
- Satisfies [C004](../contracts/C004-agent-hierarchy.md): Agent Hierarchy contract
- Integrates with [C002](../contracts/C002-authority-chain.md): Authority Chain

---

## ADR-008: Dynamic Assembly Architecture

**Status:** Accepted

### Context
Users need to view assembled documents from blocks. Architecture options:
- Pre-computed (store assembled docs)
- On-demand (assemble at request time)
- Cached (assemble once, cache, invalidate)
- Streaming (assemble progressively)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Pre-computed | Fast read | Stale, storage overhead |
| On-demand | Always fresh | Latency |
| Cached | Balance | Cache invalidation complexity |
| Streaming | Progressive UX | Implementation complexity |

### Decision
Use on-demand assembly with intelligent caching for common configurations.

### Rationale (WHY)
**Assembly must be ephemeral:**
- [C003-INV-01](../contracts/C003-dynamic-assembly.md#inv-c003-01-assembly-is-ephemeral) prohibits persisting assemblies
- Pre-computed assemblies would violate this
- On-demand ensures fresh truth

**Caching for performance:**
- Common traversal paths can be cached
- Cache invalidates when any constituent block changes
- Provides good UX without violating contracts

### Consequences
- **Enables:** Fresh assemblies, configurable depth, relationship filtering
- **Constrains:** Latency for uncached assemblies
- **Requires:** Smart cache invalidation strategy

### Contract Alignment
- Satisfies [C003-INV-01](../contracts/C003-dynamic-assembly.md#inv-c003-01-assembly-is-ephemeral): Assembly is Ephemeral
- Satisfies [C003-INV-03](../contracts/C003-dynamic-assembly.md#inv-c003-03-traversal-determinism): Determinism

---

## Index

| ADR | Decision | Status | Primary Contract |
|-----|----------|--------|-----------------|
| ADR-001 | Block as Atomic Unit | Accepted | C001 |
| ADR-002 | React Flow | Accepted | C003 |
| ADR-003 | Zustand | Accepted | E001 |
| ADR-004 | Three-Tier Authority | Accepted | C002 |
| ADR-005 | LLM Chunking | Accepted | C001 |
| ADR-006 | Append-Only Logs | Accepted | C005 |
| ADR-007 | Agent Tiers | Proposed | C004 |
| ADR-008 | Dynamic Assembly | Accepted | C003 |

---

*Each decision traces to contracts and epics. Technology follows function.*

# Contract C004: Agent Hierarchy & Orchestration

> **Document Classification:** IMMUTABLE CONTRACT
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Constitutional Basis:** [Principle 4 — Agents Have Rank](../CONSTITUTION.md#principle-4-agents-have-rank)
> **Modification Protocol:** Requires Contract Amendment Proposal + Architect Review
> **Related Contracts:** [C002](./C002-authority-chain.md), [C005](./C005-audit-trail.md)

---

## 1. Purpose

### 1.1 Why This Contract Exists

AI agents are becoming more capable, autonomous, and integral to knowledge systems. Without structural governance:

1. **Authority Erosion** — Agents "reason" their way around constraints
2. **Accountability Gap** — When agents fail, attribution is unclear
3. **Capability Creep** — Agents gain permissions through usage patterns, not policy
4. **Human Override Failure** — Humans cannot intervene in opaque agent operations

This contract establishes that **agents operate within explicit tiers** with defined capabilities, and **lower-tier agents cannot override higher-tier decisions** — structurally, not just by policy.

### 1.2 What This Contract Prevents

- Execution-level agents modifying strategic requirements
- Agents self-elevating their permission levels
- Single-agent evaluation of critical changes
- Agent operations without audit trails
- Human inability to halt or override agent actions

---

## 2. Definitions

| Term | Definition |
|------|------------|
| **Agent** | An AI system that can read, reason about, and potentially modify chunks |
| **Agent Tier** | A ranked level that determines an agent's capabilities and permissions |
| **Orchestrator** | The system component that assigns tasks to agents and manages their lifecycle |
| **Task** | A discrete unit of work assigned to an agent |
| **Agentic Chat** | A structured multi-agent deliberation process for evaluating changes |
| **Motion** | A formal request for permission to modify protected content |

---

## 3. The Three-Tier Agent Model

### 3.1 Tier Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    TIER 3: JUDGES                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Role: Evaluate changes to protected content               │ │
│  │ Model: SOTA Reasoning (Claude, o1, Gemini Pro)           │ │
│  │ Authority: Review immutable change requests               │ │
│  │ Cannot: Directly modify any content                       │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Escalates
┌────────────────────────────────────────────────────────────────┐
│                   TIER 2: ARCHITECTS                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Role: Draft plans, synthesize documents, write code       │ │
│  │ Model: Reasoning (GPT-4o, Claude Sonnet)                  │ │
│  │ Authority: Modify MUTABLE content only                    │ │
│  │ Cannot: Modify locked/immutable content                   │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Reports
┌────────────────────────────────────────────────────────────────┐
│                    TIER 1: DRONES                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Role: Linting, formatting, retrieval, basic processing    │ │
│  │ Model: Fast (Gemini Flash, GPT-4o-mini)                   │ │
│  │ Authority: READ-ONLY                                      │ │
│  │ Cannot: Modify any content                                │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Tier Characteristics

| Tier | Name | Primary Tasks | Model Tier | Clearance |
|------|------|---------------|------------|-----------|
| 1 | Drones | Linting, search, formatting, retrieval | Fast/cheap | 0 (read-only) |
| 2 | Architects | Drafting, synthesis, code generation | Reasoning | 1 (mutable) |
| 3 | Judges | Change evaluation, conflict resolution | SOTA | 3 (review) |

**WHY THREE TIERS:**
- Tier 1 handles 80% of operations (read-heavy workloads) with fast, cheap models
- Tier 2 handles creation and modification with capable but constrained models
- Tier 3 handles critical decisions with the best available models
- The pyramid matches operational frequency to cost/capability

---

## 4. Invariants

### INV-C004-01: Explicit Tier Assignment
> **Every agent instance MUST be assigned exactly one tier at instantiation. Tier cannot change during execution.**

**Justification:** Dynamic tier changes would allow agents to self-elevate. Tier is fixed at creation, determined by the orchestrator, not the agent.

---

### INV-C004-02: Tier Determines Clearance
> **An agent's clearance level is derived exclusively from its tier. No other factor may increase clearance.**

**Justification:** This prevents "earned trust" or "demonstrated competence" from bypassing structural limits. A Tier 2 agent is always Tier 2, regardless of its output quality.

**Mapping:**
- Tier 1 → Clearance 0 (read-only)
- Tier 2 → Clearance 1 (mutable)
- Tier 3 → Clearance 3 (review authority, not write authority)

---

### INV-C004-03: Lower Cannot Override Higher
> **An agent at Tier N cannot modify, invalidate, or bypass decisions made by agents at Tier > N.**

**Justification:** This is the structural enforcement of hierarchy. A drone cannot "interpret" an architect's output in a way that reverses it. The hierarchy is enforced by the system, not by agent behavior.

---

### INV-C004-04: Judges Do Not Write
> **Tier 3 (Judge) agents MAY evaluate and approve/deny changes but MAY NOT directly modify content.**

**Justification:** Separating judgment from execution prevents a single point of compromise. Even a Judge cannot unilaterally change immutable content — they can only approve a change proposed by another principal.

---

### INV-C004-05: All Agent Actions Logged
> **Every action taken by an agent MUST be logged with agent identifier, tier, task ID, and outcome.**

**Justification:** Audit trails require agent attribution. When something goes wrong, we must know which agent, at which tier, with which task, caused the issue.

**Reference:** [C005 — Audit Trail](./C005-audit-trail.md#agent-action-logging)

---

### INV-C004-06: Human Override Always Available
> **A human with sufficient clearance MUST be able to halt, override, or rollback any agent action.**

**Justification:** Agents are tools. Humans retain ultimate authority. The system must never reach a state where agents cannot be overridden.

---

## 5. The Agentic Chat Protocol

When a modification to protected content is proposed, Tier 3 agents convene in a structured deliberation.

### 5.1 Participants

| Role | Responsibility |
|------|----------------|
| **Prosecutor** | Argues AGAINST the proposed change |
| **Defense** | Argues FOR the proposed change |
| **Judge** | Weighs arguments, applies rubric, issues verdict |

### 5.2 Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    MOTION INITIATED                         │
│  Proposer: [human/agent]                                    │
│  Target: [chunk ID]                                         │
│  Proposed Change: [diff]                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   PROSECUTOR ARGUES                         │
│  - Why this change violates constraints                     │
│  - What risks this change introduces                        │
│  - What alternatives exist                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    DEFENSE ARGUES                           │
│  - Why this change is necessary                             │
│  - What problems the current state causes                   │
│  - Why alternatives are insufficient                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   JUDGE DELIBERATES                         │
│  Apply Escalation Rubric (C002):                            │
│  1. Execution Error?                                        │
│  2. Tooling Error?                                          │
│  3. Design Error?                                           │
│  4. Constraint Error?                                       │
│  5. Requirement Error?                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERDICT ISSUED                           │
│  Outcome: APPROVED / DENIED                                 │
│  Reasoning: [structured explanation]                        │
│  Conditions: [if approved, any constraints]                 │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 WHY Agentic Chat?

**Single-agent evaluation is vulnerable to:**
- Model blind spots
- Confirmation bias (especially if the proposer is also the evaluator)
- Missing edge cases

**Adversarial structure ensures:**
- Both sides of the argument are articulated
- The judge must weigh competing claims
- Reasoning is explicit and logged

---

## 6. Orchestration Rules

### 6.1 Task Assignment

The orchestrator assigns tasks based on:

| Factor | Rule |
|--------|------|
| Required clearance | Task must go to tier with sufficient clearance |
| Cost efficiency | Lowest capable tier preferred |
| Latency requirements | Faster models for time-sensitive tasks |
| Quality requirements | Higher-tier models for critical tasks |

### 6.2 Task Lifecycle

```
CREATED → ASSIGNED → IN_PROGRESS → COMPLETED/FAILED → LOGGED
```

Each state transition is logged with timestamp and agent ID.

### 6.3 Failure Handling

| Failure Type | Response |
|--------------|----------|
| Agent timeout | Task reassigned to same tier |
| Agent error | Log error, escalate to higher tier for review |
| Permission denied | Escalation per C002 |
| Constraint conflict | Agentic Chat initiated |

---

## 7. Verification Criteria

### 7.1 Automated Verification

| Check | When | Method |
|-------|------|--------|
| Tier assigned | On agent creation | Constructor validation |
| Clearance match | On any write | Pre-write hook (C002) |
| Action logged | After every action | Audit log write |
| No self-elevation | Continuous | Tier field immutable |

### 7.2 Integration Tests

| Test | Expected Behavior |
|------|-------------------|
| Tier 1 agent attempts write | Operation blocked |
| Tier 2 agent writes mutable | Success |
| Tier 2 agent writes locked | Escalation triggered |
| Tier 3 approves change | Change applied, logged |
| Tier 3 denies change | Change rejected, logged |
| Agentic Chat with no defense argument | Defense still runs, may concede |

---

## 8. Implementation Guidance

### 8.1 Agent Instantiation

```typescript
interface AgentConfig {
  tier: 1 | 2 | 3;
  model: string;          // e.g., "gemini-flash", "gpt-4o", "claude-opus"
  taskTypes: TaskType[];  // What tasks this agent can handle
  timeoutMs: number;
}

// Tier is immutable after creation
class Agent {
  readonly tier: 1 | 2 | 3;
  readonly clearance: number;

  constructor(config: AgentConfig) {
    this.tier = config.tier;
    this.clearance = this.tierToClearance(config.tier);
  }

  private tierToClearance(tier: 1 | 2 | 3): number {
    return tier === 1 ? 0 : tier === 2 ? 1 : 3;
  }
}
```

### 8.2 UI Considerations

- **Agent Activity Dashboard:** Show which agents are active, their tiers, current tasks
- **Agentic Chat Viewer:** Allow humans to observe deliberations in real-time
- **Override Controls:** Clear buttons to halt agent operations
- **Audit Log Browser:** Filterable view of agent actions

### 8.3 Anti-Patterns

| Anti-Pattern | Why It Violates C004 |
|--------------|---------------------|
| Agents that modify their own tier | INV-01: Tier fixed at instantiation |
| Single agent evaluating its own output | INV-04: Judges don't write |
| "Trust earned" clearance increases | INV-02: Clearance from tier only |
| Agent operations without logging | INV-05: All actions logged |
| No human halt capability | INV-06: Human override required |

---

## 9. Relationship to Other Contracts

| Contract | Relationship |
|----------|--------------|
| [C002 — Authority Chain](./C002-authority-chain.md) | Agent tier determines clearance level |
| [C005 — Audit Trail](./C005-audit-trail.md) | All agent actions logged |
| [C001 — Semantic Chunk](./C001-semantic-chunk-architecture.md) | Agents operate on chunks, not documents |

---

## 10. Ratification

This contract is derived from Constitutional Principle 4, establishing the agent hierarchy and orchestration framework that ensures AI operates within defined boundaries.

**Ratified:** 2025-01-XX
**Version:** 1.0.0
**Status:** ACTIVE

---

*Agents are powerful tools with explicit limits. Hierarchy is structural, not advisory.*

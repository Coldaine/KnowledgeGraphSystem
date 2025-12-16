# Contract C002: Authority Chain & Escalation Protocol

> **Document Classification:** IMMUTABLE CONTRACT
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Constitutional Basis:** [Principle 2 — Authority is Hierarchical](../CONSTITUTION.md#principle-2-authority-is-hierarchical-and-explicit), [Principle 6 — Escalation is Mandatory](../CONSTITUTION.md#principle-6-escalation-is-mandatory)
> **Modification Protocol:** Requires Contract Amendment Proposal + Architect Review
> **Related Contracts:** [C001](./C001-semantic-chunk-architecture.md), [C004](./C004-agent-hierarchy.md)

---

## 1. Purpose

### 1.1 Why This Contract Exists

Without explicit authority, collaborative systems fail in predictable ways:

1. **Creeping Override** — Important information gets "updated" by users who don't understand its importance
2. **Agent Drift** — AI agents "reason" their way around constraints
3. **Authority Ambiguity** — Nobody knows who is allowed to change what

This contract establishes that:
- Every chunk has an explicit authority level
- Modification requires matching or exceeding that authority
- Blocked operations trigger escalation, never workarounds

### 1.2 What This Contract Prevents

- Junior agents modifying strategic requirements
- Casual users overwriting compliance documentation
- Silent failures when constraints cannot be satisfied
- Ambiguity about "who owns what"

---

## 2. Definitions

| Term | Definition |
|------|------------|
| **Authority Level** | A ranked classification that determines what permission is required to modify a chunk |
| **Immutability Level** | The system's implementation of authority — Mutable, Locked, Immutable |
| **Principal** | Any actor (human user or AI agent) that may read or write chunks |
| **Clearance** | The maximum authority level a principal may exercise |
| **Escalation** | The formal process of requesting higher-authority intervention |

---

## 3. Authority Levels

### 3.1 The Three-Tier Model

| Level | Name | Meaning | Typical Content |
|-------|------|---------|-----------------|
| 1 | **Mutable** | Any authorized principal may modify | Notes, drafts, working documents |
| 2 | **Locked** | Modification requires elevated permission | Specifications, approved designs |
| 3 | **Immutable** | Modification requires formal change protocol | Requirements, compliance statements, contracts |

**WHY THREE TIERS:**
- Fewer tiers: Insufficient granularity — everything is either "free" or "locked"
- More tiers: Excessive complexity — users can't remember 7 levels
- Three tiers map to natural categories: "working," "approved," "canonical"

### 3.2 Default Assignments

| Block Type | Default Level | Rationale |
|------------|--------------|-----------|
| `note` | Mutable | Working content, expected to change |
| `requirement` | Locked | Should be stable, but teams iterate |
| `spec` | Locked | Technical decisions need stability |
| `impl` | Mutable | Code changes frequently |
| `test` | Mutable | Tests evolve with implementation |
| `manifest` | Immutable | Document structure is architectural |

**Override:** Authorized users may explicitly set any level. Defaults are conventions, not constraints.

---

## 4. Invariants

### INV-C002-01: Explicit Level Assignment
> **Every chunk MUST have an explicit authority level. No implicit defaults at read time.**

**Justification:** If level must be inferred, different readers may infer differently. Explicit assignment is stored, not computed.

**Implementation Mapping:** `Block.immutability: ImmutabilityLevel` — Required field, never null

---

### INV-C002-02: Principal Clearance Binding
> **Every principal (user or agent) MUST have a defined maximum clearance level.**

**Justification:** Without clearance binding, the system cannot determine permission at write time. Clearance is not per-session — it is identity-bound.

**Implementation:**
- Users: Role-based (viewer < editor < admin < architect)
- Agents: Tier-based (drone < architect < judge)

---

### INV-C002-03: Modification Requires Clearance Match
> **A principal MAY modify a chunk only if `principal.clearance >= chunk.authority`**

**Justification:** This is the core enforcement rule. A junior entity cannot bypass a senior constraint through any mechanism.

**Enforcement:** Pre-write validation. Violations are blocked, not logged-and-allowed.

---

### INV-C002-04: Level Escalation Only Upward
> **A principal MAY increase a chunk's authority level, but decreasing requires higher clearance.**

**Justification:** Promoting a chunk to "locked" is protective. Demoting from "locked" to "mutable" opens attack surface. The asymmetry is intentional.

**Rule:** To decrease level L → L', principal must have clearance > L (not just >= L')

---

### INV-C002-05: Blocked Operations Trigger Escalation
> **When a modification is blocked due to insufficient clearance, the system MUST initiate escalation — never silently fail.**

**Justification:** Silent failure is the worst outcome. The principal attempted something they believed was correct. If blocked, the system must provide a path forward.

**Escalation Output:**
- Notification to higher-clearance principal(s)
- Logged escalation event
- UI feedback to originating principal

---

## 5. The Escalation Protocol

### 5.1 Trigger Conditions

Escalation is triggered when:
1. A principal attempts to modify a chunk above their clearance
2. An agent determines that an immutable constraint is incorrect/impossible
3. A consistency check detects an unresolvable contradiction

### 5.2 The Formal Review Rubric

When evaluating an escalation, the reviewer MUST apply this rubric in order:

| Step | Question | If Yes |
|------|----------|--------|
| 1 | **Execution Error:** Did the junior entity misunderstand or misapply the task? | Correct the execution, no constraint change |
| 2 | **Tooling Error:** Was the wrong tool or method chosen? | Redirect to correct approach |
| 3 | **Design Error:** Is the implementation approach flawed? | Revise design within existing constraints |
| 4 | **Constraint Error:** Are requirements technically possible but too stringent? | Propose constraint relaxation (triggers C002-04) |
| 5 | **Requirement Error:** Are the core requirements fundamentally wrong? | Initiate formal requirement change process |

**WHY THIS ORDER:**
Each step escalates in impact. Most escalations resolve at steps 1-2 (user/agent error). Few reach step 5 (requirements are wrong). The rubric prevents premature escalation to "just change the requirement."

### 5.3 Resolution Outcomes

| Outcome | Action | Authority Required |
|---------|--------|-------------------|
| Execution Correction | Guide principal to correct approach | Same level |
| Constraint Relaxation | Lower authority level of blocking chunk | Higher clearance |
| Requirement Amendment | Modify immutable chunk content | Formal review process |
| Rejection | Deny request with documented reasoning | Reviewer authority |

### 5.4 Logging Requirements

Every escalation MUST log:
- Timestamp
- Originating principal
- Blocked operation
- Blocking chunk ID
- Escalation reviewer
- Rubric step reached
- Resolution outcome
- Reasoning summary

---

## 6. Agent-Specific Rules

When the principal is an AI agent:

### 6.1 Agent Clearance Mapping

| Agent Tier | Clearance | Effective Permission |
|------------|-----------|---------------------|
| Tier 1 (Drone) | 0 | Read-only |
| Tier 2 (Architect) | 1 | May modify Mutable only |
| Tier 3 (Judge) | 3 | May review Immutable changes |

**Note:** Judges don't directly modify — they approve/deny modifications proposed by others.

### 6.2 Agent Escalation Trigger

An agent MUST trigger escalation when:
- Tasked with modifying a chunk above its clearance
- Discovers that fulfilling its task requires changing a locked/immutable chunk
- Detects that its output contradicts an immutable chunk

**WHY AGENTS MUST ESCALATE:**
Agents are more capable than they are authorized. A well-designed agent could "reason" its way to changing any constraint. Mandatory escalation ensures that capability does not exceed authority.

---

## 7. Verification Criteria

### 7.1 Automated Verification

| Check | When | Method |
|-------|------|--------|
| Level assigned | On write | Schema validation — non-null |
| Clearance check | On write | Pre-write hook — reject if insufficient |
| Escalation generated | On blocked write | Event log audit |

### 7.2 Integration Tests

| Test | Expected Behavior |
|------|-------------------|
| User with clearance=1 modifies Mutable chunk | Success |
| User with clearance=1 modifies Locked chunk | Block + Escalation |
| Agent Tier 2 modifies Immutable chunk | Block + Escalation |
| Admin downgrades Locked to Mutable | Success |
| User with clearance=1 downgrades Locked to Mutable | Block |

---

## 8. Implementation Guidance

### 8.1 UI Patterns

- **Visual Authority Indicator:** Chips/badges showing "Mutable," "Locked," "Immutable"
- **Proactive Warning:** If user begins editing Locked chunk, display "This requires elevated permission"
- **Escalation Modal:** On block, present "Request Review" action that initiates escalation

### 8.2 API Patterns

```typescript
// Pre-write hook (pseudocode)
function validateWrite(principal: Principal, chunk: Chunk, newContent: Content): ValidationResult {
  if (principal.clearance < chunk.authority) {
    return {
      allowed: false,
      reason: 'INSUFFICIENT_CLEARANCE',
      escalationRequired: true,
      blockedBy: chunk.id
    };
  }
  return { allowed: true };
}
```

### 8.3 Anti-Patterns

| Anti-Pattern | Why It Violates C002 |
|--------------|---------------------|
| "Admin override" that bypasses all checks | Violates INV-03 — no principal is above the system |
| Silent permission denial | Violates INV-05 — escalation is mandatory |
| Per-session clearance elevation | Violates INV-02 — clearance is identity-bound |
| Agents modifying their own clearance | Structural violation — agents cannot self-elevate |

---

## 9. Relationship to Other Contracts

| Contract | Relationship |
|----------|--------------|
| [C001 — Semantic Chunk](./C001-semantic-chunk-architecture.md) | Authority is assigned per-chunk, enabling granular protection |
| [C004 — Agent Hierarchy](./C004-agent-hierarchy.md) | Agent tiers determine agent clearance levels |
| [C005 — Audit Trail](./C005-audit-trail.md) | Escalation events are logged in audit trail |

---

## 10. Ratification

This contract is derived from Constitutional Principles 2 and 6, establishing the authority enforcement and escalation mechanisms.

**Ratified:** 2025-01-XX
**Version:** 1.0.0
**Status:** ACTIVE

---

*All principals — human and agent — operate within this authority framework. No exceptions.*

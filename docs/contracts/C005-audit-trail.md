# Contract C005: Audit Trail & Consistency Verification

> **Document Classification:** IMMUTABLE CONTRACT
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Constitutional Basis:** [Principle 5 — Every Change Leaves a Trail](../CONSTITUTION.md#principle-5-every-change-leaves-a-trail), [Principle 7 — Consistency is Verified](../CONSTITUTION.md#principle-7-consistency-is-verified-not-assumed)
> **Modification Protocol:** Requires Contract Amendment Proposal + Architect Review
> **Related Contracts:** [C001](./C001-semantic-chunk-architecture.md), [C002](./C002-authority-chain.md), [C004](./C004-agent-hierarchy.md)

---

## 1. Purpose

### 1.1 Why This Contract Exists

Knowledge systems fail in characteristic ways:

1. **Invisible Change** — Critical information is modified without record
2. **Undetected Contradiction** — Two chunks assert incompatible facts
3. **Lost Context** — The "why" behind a change is forgotten
4. **Untraceable Decisions** — Nobody knows who approved what

This contract establishes that:
- **Every modification is logged** — No silent writes
- **Contradictions are detected** — Active verification, not assumed consistency
- **History is immutable** — Logs cannot be altered after the fact
- **Accountability is traceable** — Who, what, when, why — always answerable

### 1.2 What This Contract Prevents

- "Ghost edits" that happen without attribution
- Contradictions that persist until they cause damage
- Audit failures due to incomplete records
- Inability to answer "who changed this and why?"

---

## 2. Definitions

| Term | Definition |
|------|------------|
| **Audit Log** | An append-only record of all state-changing operations |
| **Log Entry** | A single record in the audit log, capturing one operation |
| **Consistency Check** | An automated scan that detects contradictions between chunks |
| **Contradiction** | Two chunks that assert logically incompatible facts |
| **Tombstone** | A marker indicating deletion without physical erasure |
| **Time-Travel Query** | A query that retrieves system state at a specific past timestamp |

---

## 3. Audit Trail Requirements

### 3.1 What Must Be Logged

| Operation Type | Logged Data |
|----------------|-------------|
| **Chunk Create** | id, type, creator, timestamp, initial content hash |
| **Chunk Modify** | id, modifier, timestamp, before hash, after hash, change summary |
| **Chunk Delete** | id, deleter, timestamp, reason (tombstone created) |
| **Authority Change** | id, changer, timestamp, old level, new level, justification |
| **Relationship Create** | edge id, from, to, type, creator, timestamp |
| **Relationship Delete** | edge id, deleter, timestamp, reason |
| **Escalation** | escalation id, trigger, reviewer, rubric step, outcome, timestamp |
| **Agent Action** | agent id, tier, task id, action type, target, outcome, timestamp |
| **Access Attempt** | principal, resource, action, granted/denied, timestamp |

### 3.2 Log Entry Schema

```typescript
interface AuditLogEntry {
  // Identity
  entryId: string;            // UUID, globally unique
  sequence: number;           // Monotonically increasing per resource
  timestamp: ISO8601;         // When the operation occurred

  // Operation
  operation: OperationType;   // CREATE | MODIFY | DELETE | ACCESS | ESCALATE | ...
  resourceType: ResourceType; // CHUNK | EDGE | AGENT_TASK | ...
  resourceId: string;         // ID of affected resource

  // Principal
  principal: {
    type: 'human' | 'agent';
    id: string;               // User ID or Agent ID
    tier?: number;            // For agents
    clearance: number;        // Effective clearance at time of operation
  };

  // State Change
  before?: string;            // Hash of previous state (null for creates)
  after?: string;             // Hash of new state (null for deletes)
  changeSummary?: string;     // Human-readable description

  // Context
  reason?: string;            // Why the operation was performed
  relatedEntries?: string[];  // Links to related log entries (e.g., escalation chain)
}
```

---

## 4. Invariants

### INV-C005-01: Append-Only Log
> **The audit log MUST be append-only. No entry may be modified or deleted after creation.**

**Justification:** Mutable logs are meaningless for compliance. If logs can be edited, they prove nothing. Append-only structure provides cryptographic guarantees.

**Implementation:** Write-only database table, no UPDATE/DELETE permissions, optional blockchain/merkle anchoring.

---

### INV-C005-02: No Silent Writes
> **Every state-changing operation MUST create a log entry before the operation is considered complete.**

**Justification:** If logging fails, the operation must fail. A successful write without a log entry is a data integrity violation.

**Implementation:** Transaction wrapping — operation and log write in same transaction.

---

### INV-C005-03: Principal Attribution Required
> **Every log entry MUST include an identifiable principal. Anonymous operations are prohibited.**

**Justification:** Accountability requires attribution. Even system-initiated operations must be logged as "system" with context.

**Exception:** Truly anonymous read operations (if allowed by policy) need not be logged. All writes must be attributed.

---

### INV-C005-04: Time-Travel Queries Supported
> **The system MUST support querying the state of any chunk as of any past timestamp.**

**Justification:** Debugging, compliance, and auditing often require answering: "What did this say on date X?" Without time-travel, this is impossible.

**Implementation:** Event sourcing, temporal tables, or snapshot + delta reconstruction.

---

### INV-C005-05: Deletions Are Tombstones
> **Deletion of a chunk MUST create a tombstone record, not physical erasure. The chunk's history remains queryable.**

**Justification:** Physical deletion destroys audit trail. Tombstones preserve history while marking content as "logically deleted."

**Exception:** GDPR/legal erasure may require physical deletion — this triggers a special "legal erasure" log entry that documents the legally-mandated exception.

---

### INV-C005-06: Retention Period Defined
> **Audit logs MUST be retained for a defined period. The retention policy MUST be documented and enforced.**

**Justification:** Infinite retention has cost and legal implications. Defined retention allows capacity planning and compliance alignment.

**Default:** 7 years (common compliance baseline). Configurable per deployment.

---

## 5. Consistency Verification

### 5.1 The "Nightly Build" for Knowledge

Just as code runs CI/CD pipelines, the knowledge graph runs verification pipelines:

| Schedule | Check Type | Purpose |
|----------|------------|---------|
| On write | Basic validation | Schema compliance, required fields |
| Hourly | Consistency scan | Detect new contradictions |
| Nightly | Full verification | Cross-reference all relationships, detect orphans |
| Weekly | Authority audit | Verify permission integrity, detect drift |
| Monthly | Archive check | Verify backup integrity, test restore |

### 5.2 Contradiction Detection

A contradiction exists when:
- Two chunks assert facts that cannot both be true
- A chunk asserts something that violates a relationship's semantics
- A chunk's content contradicts its metadata

**Detection Methods:**

| Method | Description | Automation |
|--------|-------------|------------|
| **Semantic embedding** | Compare embeddings for conflicting assertions | High |
| **Rule-based** | Check explicit constraint rules | Full |
| **LLM review** | Agent reads related chunks, detects conflicts | Medium |
| **Human flagging** | Users report contradictions | Manual |

### 5.3 Conflict Resolution Protocol

When a contradiction is detected:

1. **Log the detection** — Contradiction ID, involved chunks, detection method, timestamp
2. **Categorize severity** — Critical (blocks operations), Warning (surfaced to users), Info (logged only)
3. **Apply resolution rules:**

| Rule | Condition | Action |
|------|-----------|--------|
| **Authority wins** | Chunks have different authority levels | Higher authority chunk is canonical |
| **Recency wins** | Same authority, different timestamps | More recent chunk is canonical |
| **Human wins** | Same authority, same time, different principal types | Human edit overrides agent edit |
| **Escalate** | Cannot auto-resolve | Surface to human reviewer |

4. **Update canonical indicator** — Mark winning chunk, add relationship to losing chunk ("SUPERSEDED_BY")
5. **Notify stakeholders** — Alert subscribers to affected chunks

### 5.4 Criticality Dashboard

All detected issues surface through a monitoring dashboard:

| Criticality | Criteria | Response Time |
|-------------|----------|---------------|
| **Critical** | Contradiction in immutable chunks | Immediate alert |
| **High** | Contradiction in locked chunks | Same-day review |
| **Medium** | Contradiction in mutable chunks | Weekly review |
| **Low** | Style/formatting inconsistencies | Monthly review |
| **Info** | Potential duplicates detected | Advisory only |

---

## 6. Verification Criteria

### 6.1 Automated Verification

| Check | When | Method |
|-------|------|--------|
| Log entry created | After every write | Transaction audit |
| Principal attributed | On log write | Schema validation |
| Append-only enforced | Continuous | Database triggers / immutable storage |
| Time-travel works | On demand | Test query for past timestamp |

### 6.2 Integration Tests

| Test | Expected Behavior |
|------|-------------------|
| Write without principal | Operation fails |
| Attempt to modify log entry | Operation blocked |
| Delete chunk | Tombstone created, history preserved |
| Query chunk at T-1 day | Returns historical state |
| Create contradictory chunks | Contradiction detected within 1 hour |

### 6.3 Compliance Tests

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| SOC 2 | Access logging | All access attempts logged |
| GDPR | Right to erasure | Legal erasure process documented and functional |
| HIPAA | Audit trail | 6+ year retention, tamper-proof |

---

## 7. Implementation Guidance

### 7.1 Database Schema (Conceptual)

```sql
-- Audit log table (append-only)
CREATE TABLE audit_log (
  entry_id UUID PRIMARY KEY,
  sequence BIGSERIAL NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  operation VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  principal_type VARCHAR(20) NOT NULL,
  principal_id VARCHAR(255) NOT NULL,
  principal_tier INT,
  principal_clearance INT NOT NULL,
  before_hash VARCHAR(64),
  after_hash VARCHAR(64),
  change_summary TEXT,
  reason TEXT,
  related_entries UUID[]
);

-- No UPDATE or DELETE triggers allowed on this table
-- Consider partitioning by timestamp for performance
-- Consider write-ahead log replication for durability
```

### 7.2 Event Sourcing Pattern

For time-travel support, consider event sourcing:

```
Events (source of truth):
  ChunkCreated { id, content, ... }
  ChunkModified { id, before, after, ... }
  ChunkDeleted { id, ... }

Projections (queryable state):
  Current state = replay all events
  State at T = replay events up to T
```

### 7.3 UI Patterns

- **Audit Trail Viewer:** Filterable list of log entries by resource, principal, time range
- **Chunk History:** Timeline view showing all changes to a specific chunk
- **Contradiction Dashboard:** List of detected conflicts with severity indicators
- **Resolution Queue:** Workflow UI for reviewing and resolving conflicts

### 7.4 Anti-Patterns

| Anti-Pattern | Why It Violates C005 |
|--------------|---------------------|
| Soft deletes without tombstones | INV-05: History lost |
| Logging after operation complete | INV-02: Gap if logging fails |
| Anonymous "system" edits | INV-03: Attribution required |
| Mutable log tables | INV-01: Append-only required |
| No retention policy | INV-06: Must be defined |

### 7.5 TypeScript Implementation Types

The following types in [`src/types/index.ts`](../../src/types/index.ts) implement this contract:

| Type | Purpose | Contract Mapping |
|------|---------|------------------|
| `ConflictType` | Extended conflict taxonomy | Section 5.2: Beyond contradiction-only |
| `ConflictCriticality` | Severity classification | Section 5.4: Criticality Dashboard |
| `ConflictStatus` | Resolution lifecycle | Section 5.3: Conflict Resolution Protocol |
| `ConflictRecord` | Full conflict tracking | Section 5: Consistency Verification |
| `AuditActionType` | Comprehensive action enum | Section 3.1: What Must Be Logged |
| `AuditEntry` | Enhanced audit record | Section 3.2: Log Entry Schema |
| `DecayCategory` | Knowledge freshness categories | Links to docs/knowledge-decay-strategy.md |
| `BlockDecay` | Block-level decay tracking | Extends conflict detection with staleness |

**Extended Conflict Taxonomy:**

The contract focuses on contradiction detection. The implementation extends this with a richer taxonomy:

```typescript
type ConflictType =
  | 'contradiction'  // Blocks with conflicting statements (per contract)
  | 'redundancy'     // Semantically similar blocks that should merge
  | 'orphan'         // Blocks with no relationships
  | 'stale';         // Blocks not updated within staleness threshold
```

**WHY extend beyond contradiction:** Growing knowledge bases accumulate multiple failure modes. Orphan blocks indicate structural problems. Stale blocks require re-verification. This taxonomy enables comprehensive KnowledgeOps (see [E005](../epics/E005-knowledge-ops.md)).

---

## 8. Relationship to Other Contracts

| Contract | Relationship |
|----------|--------------|
| [C001 — Semantic Chunk](./C001-semantic-chunk-architecture.md) | Logs reference chunk IDs; history is per-chunk |
| [C002 — Authority Chain](./C002-authority-chain.md) | Authority changes logged; escalations logged |
| [C004 — Agent Hierarchy](./C004-agent-hierarchy.md) | All agent actions logged with tier |

---

## 9. Ratification

This contract is derived from Constitutional Principles 5 and 7, establishing the audit trail and consistency verification mechanisms that ensure accountability and data integrity.

**Ratified:** 2025-01-XX
**Version:** 1.0.0
**Status:** ACTIVE

---

*Every change is recorded. Every contradiction is detected. History is preserved.*

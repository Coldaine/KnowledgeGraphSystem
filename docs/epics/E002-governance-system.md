# Epic E002: Governance System

> **Document Classification:** STRATEGIC EPIC
> **Authority Level:** CONTRACT DERIVATIVE
> **Primary Contracts:** [C002 — Authority Chain](../contracts/C002-authority-chain.md), [C005 — Audit Trail](../contracts/C005-audit-trail.md)
> **Secondary Contracts:** [C001 — Semantic Chunk](../contracts/C001-semantic-chunk-architecture.md)
> **Phase:** 2A
> **Status:** IN PROGRESS

---

## 1. Vision Statement

### 1.1 WHY This Epic Matters

The core foundation (E001) created blocks and relationships. But blocks are currently **equally modifiable** — any user can change any content. This is the "wiki failure mode" where important information gets overwritten.

This epic transforms the system from a **collaborative notepad** to a **governed knowledge base** where:
- Critical information is protected from casual modification
- Changes are tracked and attributed
- Authority is explicit and enforced

### 1.2 What User Need It Addresses

| Persona | Need |
|---------|------|
| **Compliance Officer** | "I need to know who changed what, when, and why" |
| **Project Manager** | "I need requirements to be stable — not edited without review" |
| **System Admin** | "I need to enforce policies, not just document them" |
| **Knowledge Worker** | "I need to trust that important information hasn't been silently changed" |

### 1.3 Success Criteria

- [ ] Blocks have enforced authority levels (mutable, locked, immutable)
- [ ] Users have defined clearance levels
- [ ] Modification requires clearance >= authority
- [ ] Blocked modifications trigger escalation
- [ ] All changes are logged with attribution
- [ ] UI shows authority indicators and handles denied operations

---

## 2. Contract Traceability

This epic satisfies the following contract invariants:

| Contract | Invariant | Story |
|----------|-----------|-------|
| C002 | INV-01: Explicit Level Assignment | E002-S01 |
| C002 | INV-02: Principal Clearance Binding | E002-S02 |
| C002 | INV-03: Modification Requires Clearance Match | E002-S03 |
| C002 | INV-04: Level Escalation Only Upward | E002-S04 |
| C002 | INV-05: Blocked Operations Trigger Escalation | E002-S05 |
| C005 | INV-01: Append-Only Log | E002-S06 |
| C005 | INV-02: No Silent Writes | E002-S07 |
| C005 | INV-03: Principal Attribution Required | E002-S07 |

---

## 3. Stories

### E002-S01: Authority Level Enforcement

**Satisfies:** C002-INV-01 (Explicit Level Assignment)

**Description:**
Upgrade the existing `immutability` field from storage-only to actively enforced.

**Acceptance Criteria:**
- [ ] Every block has explicit authority level (default based on type)
- [ ] Authority level is stored in block metadata
- [ ] Authority level is visible in UI (badge/chip)
- [ ] Level changes are logged

**Current State:** Blocks have `immutability` field but it is advisory only.

**Implementation Notes:**
- Add enforcement hook to block update operations
- UI shows "Mutable" / "Locked" / "Immutable" badges

**Priority:** HIGH

---

### E002-S02: User Clearance System

**Satisfies:** C002-INV-02 (Principal Clearance Binding)

**Description:**
Implement user clearance levels that determine what authority levels a user can modify.

**Acceptance Criteria:**
- [ ] User model includes `clearance` field
- [ ] Clearance levels: 0 (viewer), 1 (editor), 2 (admin), 3 (architect)
- [ ] Clearance is assigned at user creation/role assignment
- [ ] Clearance is checked before any write operation

**Implementation Notes:**
```typescript
interface User {
  id: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin' | 'architect';
  clearance: 0 | 1 | 2 | 3;  // Derived from role
}
```

**Priority:** HIGH

---

### E002-S03: Permission Enforcement Hook

**Satisfies:** C002-INV-03 (Modification Requires Clearance Match)

**Description:**
Implement pre-write validation that blocks operations when clearance is insufficient.

**Acceptance Criteria:**
- [ ] All write operations pass through validation hook
- [ ] Hook compares `user.clearance` to `block.authority`
- [ ] Insufficient clearance returns structured error (not just rejection)
- [ ] UI displays appropriate error message

**Implementation Notes:**
```typescript
function validateWrite(user: User, block: Block): ValidationResult {
  if (user.clearance < block.authority) {
    return {
      allowed: false,
      reason: 'INSUFFICIENT_CLEARANCE',
      required: block.authority,
      actual: user.clearance,
      escalationPath: '/escalate'
    };
  }
  return { allowed: true };
}
```

**Priority:** HIGH

---

### E002-S04: Authority Level Transitions

**Satisfies:** C002-INV-04 (Level Escalation Only Upward)

**Description:**
Implement asymmetric authority level changes — promoting is easy, demoting requires higher clearance.

**Acceptance Criteria:**
- [ ] Any authorized user can increase authority level
- [ ] Decreasing authority level requires clearance > current level
- [ ] UI shows different prompts for promote vs. demote
- [ ] Level changes are logged with justification field

**Implementation Notes:**
- Promote: `user.clearance >= block.authority`
- Demote: `user.clearance > block.authority`

**Priority:** MEDIUM

---

### E002-S05: Escalation Workflow

**Satisfies:** C002-INV-05 (Blocked Operations Trigger Escalation)

**Description:**
When a modification is blocked, provide a path to request escalation.

**Acceptance Criteria:**
- [ ] Blocked operations offer "Request Review" action
- [ ] Escalation captures: proposed change, requester, reason
- [ ] Escalation is routed to principals with sufficient clearance
- [ ] Reviewer can approve/deny with reasoning
- [ ] Outcome is logged and requester is notified

**Implementation Notes:**
```typescript
interface Escalation {
  id: string;
  blockId: string;
  proposedChange: Diff;
  requesterId: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  reviewerId?: string;
  reviewerReasoning?: string;
  createdAt: timestamp;
  resolvedAt?: timestamp;
}
```

**Priority:** MEDIUM

---

### E002-S06: Audit Log Infrastructure

**Satisfies:** C005-INV-01 (Append-Only Log)

**Description:**
Implement the foundational audit log storage that cannot be modified after write.

**Acceptance Criteria:**
- [ ] Audit log table/collection with append-only semantics
- [ ] No UPDATE or DELETE operations permitted
- [ ] Log entries have monotonically increasing sequence numbers
- [ ] Entries include timestamps with timezone

**Implementation Notes:**
- For MVP: localStorage with in-memory append-only array
- For production: Database table with no DELETE/UPDATE permissions
- Consider: event sourcing pattern for full traceability

**Priority:** HIGH

---

### E002-S07: Audit Logging Integration

**Satisfies:** C005-INV-02 (No Silent Writes), C005-INV-03 (Principal Attribution)

**Description:**
Integrate audit logging into all write operations so no change occurs without a log entry.

**Acceptance Criteria:**
- [ ] All block creates/updates/deletes create log entries
- [ ] All edge creates/deletes create log entries
- [ ] All authority changes create log entries
- [ ] Log entries include principal ID (never anonymous)
- [ ] Operation and log write occur in same transaction

**Implementation Notes:**
```typescript
async function updateBlock(user: User, blockId: string, changes: Partial<Block>) {
  // Transaction start
  const before = await getBlock(blockId);
  const after = applyChanges(before, changes);
  await writeBlock(after);
  await writeAuditLog({
    operation: 'MODIFY',
    resourceType: 'CHUNK',
    resourceId: blockId,
    principal: { type: 'human', id: user.id, clearance: user.clearance },
    beforeHash: hash(before),
    afterHash: hash(after),
    changeSummary: generateSummary(before, after)
  });
  // Transaction commit
}
```

**Priority:** HIGH

---

### E002-S08: Audit Log Viewer

**Satisfies:** (Implementation support for C005)

**Description:**
Provide UI for viewing and filtering audit logs.

**Acceptance Criteria:**
- [ ] Audit log viewer accessible to authorized users
- [ ] Filterable by: resource, principal, time range, operation type
- [ ] Shows full log entry details on selection
- [ ] Supports export for compliance reporting

**Implementation Notes:**
- Table view with pagination
- Advanced filters in sidebar
- Export to CSV/JSON

**Priority:** MEDIUM

---

### E002-S09: Block History View

**Satisfies:** C005-INV-04 (Time-Travel Queries)

**Description:**
Show the history of changes to a specific block.

**Acceptance Criteria:**
- [ ] Block detail view has "History" tab
- [ ] History shows timeline of all changes
- [ ] Each change shows: before/after, who, when, why
- [ ] User can view block state at any historical point

**Implementation Notes:**
- Reconstruct historical state from audit log
- Visual diff between versions
- "Restore" action creates new edit (not time travel mutation)

**Priority:** LOW (Phase 2B)

---

## 4. Dependencies

### Upstream Dependencies
- **E001 (Core Foundation):** Blocks must exist to have authority levels

### Downstream Dependents
- **E003 (Tethered Canvas):** UI must display governance indicators
- **E004 (Agent Orchestration):** Agent clearance derives from C002
- **E005 (KnowledgeOps):** Audit log is foundation for consistency checks

---

## 5. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance overhead from audit logging | Medium | Medium | Async logging, batch writes |
| User friction from permission denials | High | Medium | Clear messaging, easy escalation path |
| Complex state management | Medium | Medium | Zustand middleware for audit integration |
| Storage growth from audit logs | Low | High | Retention policy, archival strategy |

---

## 6. Technical Decisions

| Decision | Choice | WHY |
|----------|--------|-----|
| Audit log storage (MVP) | localStorage append-only array | Simple, sufficient for single-user MVP |
| Audit log storage (Prod) | Postgres with no DELETE permission | Industry standard, supports time-travel queries |
| Permission check timing | Pre-write hook | Fail fast, clear error messages |
| Escalation workflow | In-app workflow (not email) | Keeps context in system, faster resolution |

---

## 7. Story Priority

| Priority | Stories | Rationale |
|----------|---------|-----------|
| HIGH | S01, S02, S03, S06, S07 | Core enforcement — system is governed |
| MEDIUM | S04, S05, S08 | Enhanced workflow — better UX |
| LOW | S09 | Nice-to-have — historical view |

---

## 8. Delivery Estimate

| Story | Complexity | Status |
|-------|------------|--------|
| E002-S01 | Low | PLANNED |
| E002-S02 | Low | PLANNED |
| E002-S03 | Medium | PLANNED |
| E002-S04 | Low | PLANNED |
| E002-S05 | Medium | PLANNED |
| E002-S06 | Medium | PLANNED |
| E002-S07 | Medium | PLANNED |
| E002-S08 | Medium | PLANNED |
| E002-S09 | High | DEFERRED |

---

*This epic transforms the system from a notepad to a governed knowledge base. Authority becomes enforceable, not advisory.*

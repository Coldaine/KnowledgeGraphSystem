# Epic E004: Agent Orchestration

> **Document Classification:** STRATEGIC EPIC
> **Authority Level:** CONTRACT DERIVATIVE
> **Primary Contracts:** [C004 — Agent Hierarchy](../contracts/C004-agent-hierarchy.md)
> **Secondary Contracts:** [C002 — Authority Chain](../contracts/C002-authority-chain.md), [C005 — Audit Trail](../contracts/C005-audit-trail.md)
> **Phase:** 3A
> **Status:** PLANNED

---

## 1. Vision Statement

### 1.1 WHY This Epic Matters

AI agents are becoming more capable every quarter. Without governance infrastructure:

- Agents will "reason" around constraints
- Accountability will become unclear
- Human oversight will become impossible
- The system will drift from its purpose

This epic builds the **Senate Architecture** — a hierarchical agent system where:
- Drones handle high-volume, low-risk tasks
- Architects create and modify within bounds
- Judges evaluate changes to protected content

**WHY HIERARCHY:**
A sufficiently clever agent can argue that any constraint should be changed. Structural hierarchy makes certain changes *impossible*, regardless of reasoning quality.

### 1.2 What User Need It Addresses

| Persona | Need |
|---------|------|
| **System Admin** | "I need to control what AI can and cannot do" |
| **Knowledge Manager** | "I need AI to help organize without overwriting strategy" |
| **Compliance Officer** | "I need to prove AI actions were authorized" |
| **Developer** | "I need to build AI workflows with clear boundaries" |

### 1.3 Success Criteria

- [ ] Agents have explicit tier assignments (1/2/3)
- [ ] Agent clearance is derived from tier, not behavior
- [ ] Lower-tier agents cannot override higher-tier decisions
- [ ] Agentic Chat protocol evaluates protected content changes
- [ ] All agent actions are logged with tier and task context
- [ ] Humans can halt/override any agent operation

---

## 2. Contract Traceability

| Contract | Invariant | Story |
|----------|-----------|-------|
| C004 | INV-01: Explicit Tier Assignment | E004-S01 |
| C004 | INV-02: Tier Determines Clearance | E004-S02 |
| C004 | INV-03: Lower Cannot Override Higher | E004-S03 |
| C004 | INV-04: Judges Do Not Write | E004-S04 |
| C004 | INV-05: All Agent Actions Logged | E004-S05 |
| C004 | INV-06: Human Override Always Available | E004-S06 |
| C002 | (Escalation integration) | E004-S07 |

---

## 3. Stories

### E004-S01: Agent Registry & Tier System

**Satisfies:** C004-INV-01 (Explicit Tier Assignment)

**Description:**
Implement the agent registry where all agents are registered with explicit tiers.

**Acceptance Criteria:**
- [ ] Agent entity with: id, name, tier, model, taskTypes
- [ ] Tier is immutable after agent creation
- [ ] Registry tracks all active agents
- [ ] Admin UI for viewing/managing agents
- [ ] Agents cannot self-register (orchestrator creates them)

**Implementation Notes:**
```typescript
interface Agent {
  readonly id: string;
  readonly name: string;
  readonly tier: 1 | 2 | 3;
  readonly model: string;  // e.g., "gemini-flash", "claude-sonnet"
  taskTypes: TaskType[];
  status: 'active' | 'paused' | 'terminated';
  createdAt: timestamp;
  createdBy: string;  // Principal who created the agent
}
```

**Priority:** HIGH

---

### E004-S02: Tier-to-Clearance Mapping

**Satisfies:** C004-INV-02 (Tier Determines Clearance)

**Description:**
Implement the mapping from agent tier to clearance level, integrated with C002 authority system.

**Acceptance Criteria:**
- [ ] Tier 1 → Clearance 0 (read-only)
- [ ] Tier 2 → Clearance 1 (mutable only)
- [ ] Tier 3 → Clearance 3 (review authority)
- [ ] Mapping is structural (not configurable per-agent)
- [ ] Agent clearance is checked by same hook as user clearance

**Implementation Notes:**
- Reuse E002-S03 permission hook
- Agent appears as principal in audit logs
- No "trust earned" clearance increases

**Priority:** HIGH

---

### E004-S03: Hierarchy Enforcement

**Satisfies:** C004-INV-03 (Lower Cannot Override Higher)

**Description:**
Ensure lower-tier agents cannot modify, invalidate, or bypass higher-tier decisions.

**Acceptance Criteria:**
- [ ] Agent cannot modify chunk created by higher-tier agent
- [ ] Agent cannot delete relationship created by higher-tier agent
- [ ] Agent output cannot contradict higher-tier assertions
- [ ] Violations trigger escalation, not silent failure

**Implementation Notes:**
- Track `createdByTier` on chunks and edges
- Add check: `agent.tier >= resource.createdByTier`
- Contradiction detection compares agent output against higher-tier content

**Priority:** HIGH

---

### E004-S04: Judge Agent Protocol

**Satisfies:** C004-INV-04 (Judges Do Not Write)

**Description:**
Implement Tier 3 (Judge) agents that evaluate but do not directly modify.

**Acceptance Criteria:**
- [ ] Judges receive "Motion" objects (proposed changes)
- [ ] Judges return "Verdict" objects (approve/deny + reasoning)
- [ ] Judges cannot call write operations (structurally enforced)
- [ ] Verdict is logged regardless of outcome
- [ ] If approved, separate execution phase applies the change

**Implementation Notes:**
```typescript
interface Motion {
  id: string;
  proposerId: string;
  targetBlockId: string;
  proposedChange: Diff;
  justification: string;
}

interface Verdict {
  motionId: string;
  judgeId: string;
  outcome: 'approved' | 'denied';
  reasoning: string;
  rubricStep: 1 | 2 | 3 | 4 | 5;  // Per C002 escalation rubric
  timestamp: timestamp;
}
```

**Priority:** MEDIUM

---

### E004-S05: Agent Action Logging

**Satisfies:** C004-INV-05 (All Agent Actions Logged)

**Description:**
Ensure every agent action creates an audit log entry with full context.

**Acceptance Criteria:**
- [ ] All agent reads are logged (optional, configurable)
- [ ] All agent writes are logged (mandatory)
- [ ] Log includes: agentId, tier, taskId, action, target, outcome
- [ ] Logs integrate with E002 audit infrastructure
- [ ] Agent-specific filtering in audit viewer

**Implementation Notes:**
- Extend E002-S07 log entry to include agent-specific fields
- Add `agent_task_id` for tracing task context
- Consider separate "agent activity" view for monitoring

**Priority:** HIGH

---

### E004-S06: Human Override Controls

**Satisfies:** C004-INV-06 (Human Override Always Available)

**Description:**
Ensure humans can always halt, override, or rollback agent actions.

**Acceptance Criteria:**
- [ ] "Pause Agent" button immediately stops agent execution
- [ ] "Terminate Agent" button permanently stops agent
- [ ] "Rollback Task" button reverts all changes from a task
- [ ] Human actions take precedence over pending agent actions
- [ ] Override actions are logged with justification

**Implementation Notes:**
- Agent execution checks for pause/terminate flags
- Rollback uses audit log to identify task changes
- Consider "agent sandbox" mode for testing

**Priority:** HIGH

---

### E004-S07: Agentic Chat Implementation

**Satisfies:** C002 escalation + C004 hierarchy

**Description:**
Implement the multi-agent deliberation process for evaluating protected content changes.

**Acceptance Criteria:**
- [ ] Motion triggers three-agent deliberation
- [ ] Prosecutor agent argues against change
- [ ] Defense agent argues for change
- [ ] Judge agent weighs arguments, applies rubric
- [ ] Full deliberation is logged
- [ ] UI shows deliberation progress (optional viewing)

**Process Flow:**
```
Motion Submitted
      │
      ▼
┌─────────────┐
│ Prosecutor  │ ──► Arguments against change
└─────────────┘
      │
      ▼
┌─────────────┐
│  Defense    │ ──► Arguments for change
└─────────────┘
      │
      ▼
┌─────────────┐
│   Judge     │ ──► Applies rubric, issues verdict
└─────────────┘
      │
      ▼
Verdict Logged + Applied (if approved)
```

**Priority:** MEDIUM

---

### E004-S08: Orchestrator Implementation

**Satisfies:** (Infrastructure for agent management)

**Description:**
Implement the central orchestrator that assigns tasks to agents.

**Acceptance Criteria:**
- [ ] Task queue with priority management
- [ ] Task assignment based on: required clearance, agent availability, cost
- [ ] Task lifecycle tracking: created → assigned → running → completed/failed
- [ ] Retry logic with exponential backoff
- [ ] Dead letter queue for failed tasks

**Implementation Notes:**
- Consider using Bull/BullMQ for queue management
- Implement "agent pool" for each tier
- Task assignment algorithm prefers lowest capable tier (cost optimization)

**Priority:** MEDIUM

---

### E004-S09: Agent Activity Dashboard

**Satisfies:** (Operational visibility)

**Description:**
Provide UI for monitoring agent activity in real-time.

**Acceptance Criteria:**
- [ ] List of active agents with status indicators
- [ ] Real-time task progress visualization
- [ ] Agentic Chat viewer (for deliberations)
- [ ] Quick actions: pause, resume, terminate
- [ ] Historical activity graphs

**Implementation Notes:**
- WebSocket for real-time updates
- Consider Server-Sent Events as simpler alternative
- Dashboard accessible to admins only

**Priority:** LOW

---

## 4. Dependencies

### Upstream Dependencies
- **E001 (Core Foundation):** Chunks for agents to operate on
- **E002 (Governance):** Authority system agents integrate with

### Downstream Dependents
- **E005 (KnowledgeOps):** Automated verification uses agent infrastructure

---

## 5. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Agent costs unpredictable | High | High | Cost caps per task, tier-based budgets |
| Agentic Chat latency | Medium | High | Async processing, optimistic UI |
| Agent hallucination | High | Medium | Output validation, human review for critical |
| Complex debugging | High | Medium | Comprehensive logging, replay capability |

---

## 6. Technical Decisions

| Decision | Choice | WHY |
|----------|--------|-----|
| Agent framework | LangGraph | Supports stateful, multi-agent workflows |
| Queue system | Bull/BullMQ | Robust, Redis-backed, Node-native |
| Model routing | Cost-based | Lower-tier agents use cheaper models |
| Agentic Chat | Parallel then sequential | Prosecutor/Defense can run in parallel |

---

## 7. Model Selection by Tier

| Tier | Recommended Models | WHY |
|------|-------------------|-----|
| 1 (Drones) | Gemini Flash, GPT-4o-mini, Claude Haiku | Fast, cheap, sufficient for read/lint |
| 2 (Architects) | GPT-4o, Claude Sonnet | Good reasoning, cost-effective |
| 3 (Judges) | Claude Opus, o1, Gemini Pro | Best reasoning for critical decisions |

---

## 8. Story Priority

| Priority | Stories | Rationale |
|----------|---------|-----------|
| HIGH | S01, S02, S03, S05, S06 | Core infrastructure — agents can operate safely |
| MEDIUM | S04, S07, S08 | Advanced features — sophisticated governance |
| LOW | S09 | Operational tooling — nice-to-have |

---

*This epic builds the constitutional framework for AI. Agents become citizens with rights and limits, not unbound tools.*

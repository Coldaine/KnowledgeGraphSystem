# Epic E005: KnowledgeOps Pipeline

> **Document Classification:** STRATEGIC EPIC
> **Authority Level:** CONTRACT DERIVATIVE
> **Primary Contracts:** [C005 — Audit Trail & Consistency](../contracts/C005-audit-trail.md)
> **Secondary Contracts:** [C001](../contracts/C001-semantic-chunk-architecture.md), [C004](../contracts/C004-agent-hierarchy.md)
> **Phase:** 3B
> **Status:** PLANNED

---

## 1. Vision Statement

### 1.1 WHY This Epic Matters

Code has CI/CD — automated pipelines that catch errors before deployment. Documentation has nothing. Information rots silently until someone makes a bad decision based on outdated or contradictory facts.

This epic treats **knowledge like code**:
- Automated linting checks formatting and structure
- Consistency scans detect contradictions
- Nightly "builds" verify the entire knowledge base
- Issues surface in dashboards, not disasters

**WHY KNOWLEDGEOPS:**
The cost of bad documentation is invisible until it's catastrophic. A contradictory requirement isn't a syntax error — it's a delayed explosion. KnowledgeOps makes these problems visible and urgent.

### 1.2 What User Need It Addresses

| Persona | Need |
|---------|------|
| **Quality Manager** | "I need to know when documentation becomes inconsistent" |
| **System Admin** | "I need automated verification, not manual review" |
| **Compliance Officer** | "I need proof that our knowledge base is internally consistent" |
| **Knowledge Worker** | "I need to trust what I read" |

### 1.3 Success Criteria

- [ ] Automated linting on every write
- [ ] Hourly consistency scans detect contradictions
- [ ] Nightly full verification runs
- [ ] Issues surface in criticality dashboard
- [ ] Resolution workflow tracks contradiction cleanup
- [ ] Metrics show knowledge base health over time

---

## 2. Contract Traceability

| Contract | Invariant | Story |
|----------|-----------|-------|
| C005 | 5.1: The "Nightly Build" | E005-S01, E005-S02, E005-S03 |
| C005 | 5.2: Contradiction Detection | E005-S04 |
| C005 | 5.3: Conflict Resolution Protocol | E005-S05 |
| C005 | 5.4: Criticality Dashboard | E005-S06 |
| C001 | INV-06: Single Source of Truth | E005-S07 |

---

## 3. Stories

### E005-S01: Linting Pipeline

**Satisfies:** C005 5.1 (automated checks)

**Description:**
Implement automated linting that runs on every write operation.

**Acceptance Criteria:**
- [ ] Lint rules for: required fields, type correctness, boundary markers
- [ ] Linting runs before write commits
- [ ] Lint failures block write with actionable error
- [ ] Lint rules are configurable (enable/disable)
- [ ] Lint results logged for analysis

**Lint Rules (Initial Set):**
| Rule | Description |
|------|-------------|
| `required-title` | Block must have non-empty title |
| `valid-type` | Block type must be in taxonomy |
| `no-continuation` | Content must not contain "continued from" patterns |
| `max-length` | Content must not exceed length limit |
| `valid-relationships` | Edge references must point to existing blocks |

**Priority:** HIGH

---

### E005-S02: Hourly Consistency Scan

**Satisfies:** C005 5.1 (cadenced reviews)

**Description:**
Implement scheduled scans that detect new contradictions since last scan.

**Acceptance Criteria:**
- [ ] Scan runs every hour (configurable)
- [ ] Scan only checks content modified since last scan (incremental)
- [ ] Detected contradictions create "issue" records
- [ ] Issues are de-duplicated against existing issues
- [ ] Scan completion logged with statistics

**Implementation Notes:**
- Use `lastScanTimestamp` to limit scope
- Compare embeddings of modified chunks against potentially related chunks
- Threshold for "potential contradiction" is configurable

**Priority:** MEDIUM

---

### E005-S03: Nightly Full Verification

**Satisfies:** C005 5.1 (comprehensive verification)

**Description:**
Implement nightly full-graph verification that catches issues incremental scans might miss.

**Acceptance Criteria:**
- [ ] Runs once per day at configurable time
- [ ] Verifies all chunks, not just recently modified
- [ ] Detects: orphan chunks, broken relationships, authority drift
- [ ] Generates "health report" with metrics
- [ ] Report sent to configured recipients

**Verification Checks:**
| Check | Description |
|-------|-------------|
| Orphan detection | Chunks with no incoming relationships |
| Broken edges | Relationships pointing to deleted chunks |
| Authority drift | Locked chunks modified without escalation |
| Duplicate detection | Chunks with >85% content similarity |
| Cycle detection | Circular structural relationships |

**Priority:** MEDIUM

---

### E005-S04: Contradiction Detection Engine

**Satisfies:** C005 5.2 (Contradiction Detection)

**Description:**
Implement the engine that identifies logically contradictory chunks.

**Acceptance Criteria:**
- [ ] Embedding-based similarity detection
- [ ] Rule-based contradiction patterns (e.g., "X is Y" vs "X is not Y")
- [ ] LLM-assisted contradiction evaluation
- [ ] Contradiction confidence score (0-1)
- [ ] Human feedback loop to train detector

**Detection Methods:**
| Method | Automation Level | Accuracy |
|--------|------------------|----------|
| Embedding similarity | Full | Medium |
| Pattern matching | Full | High (for patterns) |
| LLM review | Semi | High |
| Human flagging | Manual | Highest |

**Priority:** HIGH

---

### E005-S05: Conflict Resolution Workflow

**Satisfies:** C005 5.3 (Conflict Resolution Protocol)

**Description:**
Implement the workflow for resolving detected contradictions.

**Acceptance Criteria:**
- [ ] Auto-resolution for clear cases (authority wins, recency wins)
- [ ] Human review queue for ambiguous cases
- [ ] Resolution creates "superseded by" relationship
- [ ] Resolution logged in audit trail
- [ ] Metrics track resolution time and method

**Auto-Resolution Rules (from C005):**
1. **Authority wins:** Higher authority chunk is canonical
2. **Recency wins:** More recent chunk wins (same authority)
3. **Human wins:** Human edit overrides agent (same authority, same time)
4. **Escalate:** Cannot auto-resolve → human review

**Priority:** MEDIUM

---

### E005-S06: Criticality Dashboard

**Satisfies:** C005 5.4 (Criticality Dashboard)

**Description:**
Build the operational dashboard that surfaces issues by criticality.

**Acceptance Criteria:**
- [ ] Dashboard shows issues categorized by criticality
- [ ] Criticality levels: Critical, High, Medium, Low, Info
- [ ] Real-time updates as new issues detected
- [ ] Drill-down to specific chunks and contradictions
- [ ] Trend charts showing issue counts over time
- [ ] Export for compliance reporting

**Criticality Criteria:**
| Level | Criteria | SLA |
|-------|----------|-----|
| Critical | Contradiction in immutable chunks | 4 hours |
| High | Contradiction in locked chunks | 24 hours |
| Medium | Contradiction in mutable chunks | 1 week |
| Low | Style/formatting issues | 1 month |
| Info | Potential duplicates | Advisory |

**Priority:** HIGH

---

### E005-S07: Duplicate Detection & Merge

**Satisfies:** C001-INV-06 (Single Source of Truth)

**Description:**
Detect potential duplicate chunks and provide merge workflow.

**Acceptance Criteria:**
- [ ] Similarity scan identifies chunks with >85% overlap
- [ ] Duplicates surfaced in dashboard with comparison view
- [ ] Merge wizard shows side-by-side content
- [ ] Merge creates canonical chunk + relationships from merged chunks
- [ ] Original chunks become "superseded" (tombstone)

**Implementation Notes:**
- Use embedding cosine similarity
- Highlight differences in merge wizard
- Track "merge history" for audit

**Priority:** LOW

---

### E005-S08: Health Metrics & Reporting

**Satisfies:** (Operational visibility)

**Description:**
Track and report knowledge base health metrics over time.

**Acceptance Criteria:**
- [ ] Metrics: total chunks, contradiction rate, resolution time, orphan count
- [ ] Daily snapshot of metrics
- [ ] Trend visualization (graphs)
- [ ] Alerting when metrics exceed thresholds
- [ ] Weekly summary report (optional email)

**Key Metrics:**
| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Contradiction rate | <1% | 1-5% | >5% |
| Orphan rate | <5% | 5-10% | >10% |
| Avg resolution time | <24h | 24-72h | >72h |
| Duplicate rate | <2% | 2-5% | >5% |

**Priority:** LOW

---

### E005-S09: Agent Integration

**Satisfies:** C004 + C005 integration

**Description:**
Integrate KnowledgeOps with agent infrastructure for automated remediation.

**Acceptance Criteria:**
- [ ] Tier 1 (Drone) agents handle linting fixes
- [ ] Tier 2 (Architect) agents propose contradiction resolutions
- [ ] Human approval required for resolution execution
- [ ] Agent activity visible in KnowledgeOps dashboard
- [ ] Agent-generated fixes logged with provenance

**Implementation Notes:**
- Drones can fix formatting issues automatically
- Architects propose resolutions for contradictions
- Judges (Tier 3) not involved — this is operational, not governance

**Priority:** LOW (Phase 4)

---

## 4. Dependencies

### Upstream Dependencies
- **E001 (Core Foundation):** Chunks to verify
- **E002 (Governance):** Audit log infrastructure
- **E004 (Agent Orchestration):** Agents for automated tasks

### Downstream Dependents
- None (this is operational infrastructure)

---

## 5. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| False positive contradictions | Medium | High | Confidence thresholds, human review |
| Performance impact of scans | Medium | Medium | Off-peak scheduling, incremental scans |
| Alert fatigue | High | Medium | Criticality filtering, smart grouping |
| LLM costs for detection | Medium | Medium | Use cheap models, cache results |

---

## 6. Technical Decisions

| Decision | Choice | WHY |
|----------|--------|-----|
| Scheduler | node-cron / Bull scheduler | Simple, reliable, Node-native |
| Embedding model | text-embedding-ada-002 | Good quality, reasonable cost |
| Similarity threshold | 0.85 cosine | Balance precision/recall |
| Dashboard framework | Existing UI + new views | Consistent UX, lower effort |

---

## 7. Story Priority

| Priority | Stories | Rationale |
|----------|---------|-----------|
| HIGH | S01, S04, S06 | Core detection + visibility |
| MEDIUM | S02, S03, S05 | Scheduled verification + resolution |
| LOW | S07, S08, S09 | Advanced features |

---

## 8. Schedule Cadence

| Job | Frequency | Trigger |
|-----|-----------|---------|
| Linting | On write | Pre-commit hook |
| Incremental scan | Hourly | Cron |
| Full verification | Daily | Cron (3 AM) |
| Metrics snapshot | Daily | Cron (6 AM) |
| Weekly report | Weekly | Cron (Monday 9 AM) |

---

*This epic treats knowledge like code: verified, tested, and deployed with confidence. Documentation debt becomes visible and manageable.*

# Contracts Index

> **Document Classification:** CONTRACT REGISTRY
> **Authority Level:** CONSTITUTIONAL DERIVATIVE
> **Governance:** Each contract derives from [CONSTITUTION.md](../CONSTITUTION.md) principles
> **Purpose:** Define immutable specifications that implementations must satisfy

---

## What is a Contract?

In this system, a **Contract** is an immutable specification that:

1. **Derives from** a Constitutional Principle
2. **Defines invariants** that must always hold
3. **Specifies verification** criteria for compliance
4. **Binds all** downstream implementation decisions

**WHY CONTRACTS EXIST:**
The Constitution defines *principles*. Principles are necessary but insufficient for implementation. Contracts bridge principles to practice by specifying testable conditions.

---

## Contract Hierarchy

```
CONSTITUTION.md
    │
    ├── Principle 1 (Semantic Chunk) ──────► C001-semantic-chunk-architecture.md
    │
    ├── Principle 2 (Authority Chain) ─────► C002-authority-chain.md
    │
    ├── Principle 3 (Dynamic Assembly) ────► C003-dynamic-assembly.md
    │
    ├── Principle 4 (Agent Hierarchy) ─────► C004-agent-hierarchy.md
    │
    └── Principle 5 (Audit Trail) ─────────► C005-audit-trail.md
        + Principle 6 (Escalation)
        + Principle 7 (Consistency)
```

---

## Contract Registry

| ID | Name | Constitutional Basis | Status |
|----|------|---------------------|--------|
| [C001](./C001-semantic-chunk-architecture.md) | Semantic Chunk Architecture | Principle 1 | RATIFIED |
| [C002](./C002-authority-chain.md) | Authority Chain & Escalation | Principles 2, 6 | RATIFIED |
| [C003](./C003-dynamic-assembly.md) | Dynamic Assembly Protocol | Principle 3 | RATIFIED |
| [C004](./C004-agent-hierarchy.md) | Agent Hierarchy & Orchestration | Principle 4 | RATIFIED |
| [C005](./C005-audit-trail.md) | Audit Trail & Consistency | Principles 5, 7 | RATIFIED |

---

## Reading a Contract

Each contract follows a standard structure:

### 1. Header Block
- Classification and authority level
- Constitutional principle reference
- Modification protocol

### 2. Purpose Statement
- WHY this contract exists
- What problem it solves
- What failure it prevents

### 3. Invariants
- Numbered list of conditions that MUST hold
- Each invariant includes justification
- Invariants are testable/verifiable

### 4. Verification Criteria
- How compliance is checked
- Automated vs. manual verification
- Failure handling

### 5. Implementation Guidance
- How epics/stories should interpret this contract
- Common patterns and anti-patterns
- Edge cases and boundaries

---

## Modifying a Contract

Contracts are **immutable specifications**. They cannot be casually edited.

**Modification Protocol:**
1. Author a **Contract Amendment Proposal (CAP)**
2. Demonstrate constitutional alignment
3. Impact analysis: which epics/stories are affected
4. Review by system architects
5. Formal ratification with version increment

**WHY THIS RIGOR:**
Contracts constrain all downstream work. Changing a contract mid-implementation invalidates assumptions. The friction is intentional — it ensures changes are worth the cost.

---

## Cross-References

- **Upstream:** [CONSTITUTION.md](../CONSTITUTION.md) — Defines principles contracts must satisfy
- **Downstream:** [Epics Index](../epics/README.md) — Epics must trace to contracts
- **Parallel:** [Architecture Decisions](../architecture/DECISIONS.md) — Technical choices within contract bounds

---

*This index is maintained as contracts are ratified. All implementations must trace to at least one contract.*

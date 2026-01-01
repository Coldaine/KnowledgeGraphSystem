# Merge Recommendation: TypeScript Types

## Sources
- **Upstream**: `src/types/index.ts` (existing codebase)
- **Ours**: `docs2/types-additions.ts` (~300 lines of governance types)
- **From Decay Docs**: `docs/knowledge-decay-strategy.md` (proposed types)
- **From Verification Docs**: `docs/verification-agents-plan.md` (proposed types)

---

## Current State: src/types/index.ts

The existing file has:
- Block, Edge, Tag interfaces
- BlockType, ImmutabilityLevel enums
- StructuralRelation, SemanticRelation enums
- TraversalProfile, AssemblyConfig for compositor
- UserAction for basic audit

---

## Our Additions (docs2/types-additions.ts)

### 1. Authority Chain Types (KEEP)

```typescript
// Our addition - not in upstream
export enum AuthorityLevel {
  SYSTEM = 'system',
  PRINCIPAL = 'principal',
  SENIOR = 'senior',
  CONTRIBUTOR = 'contributor',
  AGENT = 'agent',
  VIEWER = 'viewer',
}

export interface BlockAuthority {
  immutability: ImmutabilityLevel;
  authorityLevel: AuthorityLevel;
  markedBy: string;
  markedAt: Date;
  justification?: string;
}
```

**WHY KEEP**: Upstream C002 has 3-tier content protection but no principal authority model. Our 6-level enum maps to real organizational roles.

---

### 2. Escalation Types (KEEP + RENAME)

```typescript
// Keep, but rename to align with upstream "Motion to Change"
export type EscalationErrorType =
  'execution' | 'tooling' | 'design' | 'constraint' | 'requirement';

export interface EscalationEvent {
  id: string;
  timestamp: Date;
  agentId: string;
  agentTier: 1 | 2 | 3;  // CHANGE: was agentAuthorityLevel
  taskDescription: string;
  conflictingBlockId: BlockId;
  // ...
}
```

**WHY KEEP**: Upstream C002 describes escalation but doesn't type it. Our interface makes it implementable.

**RENAME**: `agentAuthorityLevel` → `agentTier` to match upstream's Drone/Architect/Judge model.

---

### 3. Agentic Review Types (KEEP + RENAME)

```typescript
// Keep, but rename fields to match "Motion to Change" protocol
export interface MotionToChange {  // RENAME: was AgenticReview
  id: string;
  triggeredBy: string;
  triggeredAt: Date;

  proposedChange: {
    blockId: BlockId;
    currentContent: string;
    proposedContent: string;
    justification: string;
  };

  // RENAME: prosecutor/defense/judge per upstream VISION.md
  prosecutorArguments: string[];  // was advocateArguments
  defenseArguments: string[];     // was criticArguments
  judgeVerdict: string;           // was neutralAssessment

  recommendation: 'approve' | 'reject' | 'escalate_to_human';
  confidence: number;
  // ...
}
```

**WHY RENAME**: Upstream's "Motion to Change" with Prosecutor/Defense/Judge naming is more evocative of an adversarial review process.

---

### 4. Conflict Types (KEEP + EXTEND)

```typescript
// Keep our taxonomy - upstream only has 'contradiction'
export type ConflictType =
  | 'contradiction'  // Upstream has this
  | 'redundancy'     // We add
  | 'orphan'         // We add
  | 'stale';         // We add, but upstream decay model is richer

export interface ConflictRecord {
  id: string;
  type: ConflictType;
  blockIds: BlockId[];
  // ...
}
```

**WHY KEEP**: Upstream C005 focuses on contradictions. Our taxonomy covers more failure modes.

---

### 5. Audit Types (KEEP)

```typescript
// Keep - upstream has SQL schema but no TypeScript
export type AuditActionType =
  | 'block.create' | 'block.update' | 'block.delete'
  | 'immutability.set' | 'immutability.elevate' | 'immutability.demote'
  | 'agent.escalate' | 'agent.review.start' | 'agent.review.complete'
  | 'conflict.detect' | 'conflict.resolve'
  // ...

export interface AuditEntry {
  id: string;
  action: AuditActionType;
  timestamp: Date;
  actorId: string;
  actorType: 'human' | 'agent' | 'system';
  actorAuthorityLevel: AuthorityLevel;
  // ...
}
```

**WHY KEEP**: Upstream C005 has SQL schema and invariants. Our TypeScript makes it implementable in the existing codebase.

---

## Additions from Upstream (ADD)

### 6. Decay Types (ADD from knowledge-decay-strategy.md)

```typescript
// ADD - we missed this entirely
export enum DecayCategory {
  FAST = 'fast',       // 30 days
  MEDIUM = 'medium',   // 180 days
  SLOW = 'slow',       // 730 days
  NONE = 'none',       // Never
}

// ADD to Block interface or as BlockDecay
export interface BlockDecay {
  decayCategory: DecayCategory;
  ttlDays?: number;
  lastVerifiedAt?: Date;
  verifiedBy?: string;
  verifiedByAuthority?: AuthorityLevel;  // Bridge to our types
  isAutoVerifiable: boolean;
  confidenceScore: number;  // Decays: 0.99^weeks_since_verify
}
```

**WHY ADD**: Critical functionality we missed. Knowledge freshness is as important as knowledge governance.

---

### 7. Agent Tier Types (ADD from C004)

```typescript
// ADD - aligns with upstream Agent Senate model
export enum AgentTier {
  DRONE = 1,      // Read-only, high-volume tasks
  ARCHITECT = 2,  // Create/modify mutable content
  JUDGE = 3,      // Review changes to protected content
}

export interface AgentIdentity {
  id: string;
  tier: AgentTier;
  clearance: number;  // Derived: Drone=0, Architect=1, Judge=3
  model?: string;     // e.g., 'gemini-flash', 'claude-sonnet'
}
```

**WHY ADD**: Our flat `AGENT` level doesn't capture the nuanced Senate model.

---

## Summary: Types Merge Plan

| Type | Action | Notes |
|------|--------|-------|
| AuthorityLevel | KEEP | Maps to organizational roles |
| BlockAuthority | KEEP | Extends Block with authority tracking |
| EscalationErrorType | KEEP | 5-tier rubric |
| EscalationEvent | KEEP + RENAME | agentAuthorityLevel → agentTier |
| AgenticReview | KEEP + RENAME → MotionToChange | advocate→prosecutor, critic→defense |
| ConflictType | KEEP | Richer than upstream |
| ConflictRecord | KEEP | Interface for conflict tracking |
| AuditActionType | KEEP | Comprehensive action enum |
| AuditEntry | KEEP | Full audit interface |
| DecayCategory | ADD | From upstream decay docs |
| BlockDecay | ADD | From upstream decay docs |
| AgentTier | ADD | From upstream C004 |
| AgentIdentity | ADD | From upstream C004 |

---

## Final Types File Structure

```typescript
// src/types/index.ts additions (after existing types)

// ============ AUTHORITY ============
export enum AuthorityLevel { ... }
export interface BlockAuthority { ... }

// ============ AGENT TIERS ============
export enum AgentTier { ... }
export interface AgentIdentity { ... }

// ============ ESCALATION ============
export type EscalationErrorType = ...
export type EscalationStatus = ...
export interface EscalationEvent { ... }

// ============ MOTION TO CHANGE ============
export type ReviewRecommendation = ...
export interface MotionToChange { ... }  // Renamed from AgenticReview

// ============ KNOWLEDGE DECAY ============
export enum DecayCategory { ... }
export interface BlockDecay { ... }

// ============ CONFLICT DETECTION ============
export type ConflictType = ...
export type ConflictCriticality = ...
export type ConflictStatus = ...
export interface ConflictRecord { ... }

// ============ AUDIT TRAIL ============
export type AuditActionType = ...
export interface AuditEntry { ... }

// ============ CONVENIENCE EXPORTS ============
export type EscalationEventMap = Map<string, EscalationEvent>;
// ...
```

# UI Philosophy & Recommended Alterations

> **Cross-Reference**: [VISION.md](../VISION.md) | [Block.tsx](../src/components/Block/Block.tsx) | [ROADMAP.md](../ROADMAP.md)

This document outlines the philosophical approach to UI design in the Knowledge Graph System and recommends specific alterations to align with the unified vision.

---

## Core UI Principle: Surface the Why

> **WHY this principle**: Users (and agents) interacting with a knowledge system need to understand not just WHAT is protected, but WHY it's protected and WHO protected it. A lock icon alone is insufficient—it provides no context for navigating around or challenging the constraint.

The existing UI shows **state** (locked, immutable). The vision requires showing **context** (who, when, why, authority required).

---

## Recommended Alteration 1: Authority-Aware Block Back Face

### Current State
The Block component's back face (revealed on double-click) shows:
- ID, Template, Version, State
- Custom fields
- Audit info (Updated date, By whom)

**Location**: [Block.tsx:233-313](../src/components/Block/Block.tsx)

### Recommended Enhancement

Add authority chain information to the back face:

```
┌─────────────────────────────────────────┐
│  METADATA                               │
├─────────────────────────────────────────┤
│  ID: abc-123        Template: note      │
│  Version: 3         State: active       │
├─────────────────────────────────────────┤
│  AUTHORITY                              │  ← NEW SECTION
│  Protection: IMMUTABLE                  │
│  Required Level: SENIOR                 │
│  Marked By: @alice                      │
│  Marked At: 2025-01-15                  │
│  Justification:                         │
│  "Core API contract, breaking changes   │
│   require architect review"             │
├─────────────────────────────────────────┤
│  RECENT ESCALATIONS (if any)            │  ← NEW SECTION
│  ⚠ 2 agents blocked in last 7 days     │
│  → Click to view escalation details     │
├─────────────────────────────────────────┤
│  AUDIT TRAIL                            │
│  Updated: 2025-01-20                    │
│  By: @bob                               │
│                                         │
│  [Edit] [Delete]                        │
└─────────────────────────────────────────┘
```

### Why This Matters
- **Escalation hotspots become visible**: If this block frequently causes agent escalations, users need to know
- **Authority context enables informed decisions**: Knowing WHO marked it immutable and WHY helps users decide whether to request changes
- **Audit surface area**: Expanding the back face creates space for the comprehensive audit trail required by [VISION: Principle 6](../VISION.md#principle-6-comprehensive-audit-trail)

### Implementation Guidance
1. Extend `BlockProps` to accept `BlockAuthority` data
2. Add `EscalationEvent[]` for blocks with recent escalations
3. Conditionally render authority section when `immutability !== MUTABLE`

---

## Recommended Alteration 2: Visual Chunk Boundaries in Document View

### Current State
The `viewMode === 'minimal'` rendering in Block.tsx simply renders prose:
```tsx
if (viewMode === 'minimal') {
  return (
    <div className="prose prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: block.content }} />
    </div>
  );
}
```

**Location**: [Block.tsx:110-117](../src/components/Block/Block.tsx)

### Recommended Enhancement

Even in minimal/document view, blocks should have subtle visual boundaries:

```tsx
if (viewMode === 'minimal') {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-none',
        // Subtle left border indicating chunk boundary
        'border-l-2 border-transparent hover:border-text-400/30',
        // Padding to show block structure
        'pl-4 py-2 my-1',
        // Immutability indication even in minimal mode
        block.immutability === ImmutabilityLevel.IMMUTABLE && 'border-l-error/50',
        block.immutability === ImmutabilityLevel.LOCKED && 'border-l-warning/50',
      )}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Block type indicator on hover */}
      <div className="opacity-0 hover:opacity-100 transition-opacity text-xs text-text-400 mb-1">
        {block.type.replace('_', ' ')}
      </div>
      <div dangerouslySetInnerHTML={{ __html: block.content }} />
    </div>
  );
}
```

### Why This Matters
- **Users understand what they're editing**: The vision requires that "the underlying semantic chunk structure will be made visually apparent" ([VISION: Visual Chunk Boundaries](../VISION.md#a-visual-chunk-boundaries))
- **Prevents accidental cross-block edits**: Clear boundaries prevent users from accidentally merging blocks
- **Immutability remains visible**: Even in document view, protected content should be identifiable

### Natural Pattern That Will Emerge
Users will develop spatial awareness of document structure. They'll recognize "this red-bordered section is the immutable API contract" and navigate accordingly.

---

## Recommended Alteration 3: Graph View Authority Stratification

### Current State
The GraphView uses React Flow with custom node rendering. Nodes are colored by block type.

### Recommended Enhancement

Add a "Stratification View" that layers nodes by authority level:

```
           ┌─────────────────────────────────────────┐
           │  SYSTEM (unreachable by normal users)   │ ← Top layer
           └─────────────────────────────────────────┘
                              ↓
         ┌─────────────────────────────────────────────┐
         │  PRINCIPAL (strategic, immutable by design) │
         └─────────────────────────────────────────────┘
                              ↓
       ┌─────────────────────────────────────────────────┐
       │  SENIOR (reviewed content, locked by default)   │
       └─────────────────────────────────────────────────┘
                              ↓
     ┌─────────────────────────────────────────────────────┐
     │  CONTRIBUTOR (standard content, mutable)            │
     └─────────────────────────────────────────────────────┘
                              ↓
   ┌─────────────────────────────────────────────────────────┐
   │  AGENT (AI-generated, pending review)                   │
   └─────────────────────────────────────────────────────────┘
```

### Implementation Approach
- Add new layout algorithm option: `'stratified'` in View config
- Y-position determined by `AuthorityLevel`
- X-position determined by existing force-directed algorithm
- Semantic relationships shown as arrows crossing layers (making dependencies on higher-authority content visible)

### Why This Matters
- **Visualizes the authority hierarchy**: Users immediately see what content is "above" their authority level
- **Natural pattern from VISION**: Section VI notes that "content will naturally stratify" into authority layers—this visualization makes that stratification explicit
- **Agent debugging**: When an agent escalates, tracing up the graph shows exactly which higher-authority block caused the conflict

---

## Recommended Alteration 4: Escalation Hotspot Highlighting

### Current State
Nodes in the graph have no indication of escalation history.

### Recommended Enhancement

Blocks that frequently cause agent escalations should be visually distinct:

```
Normal Block:       Escalation Hotspot:
┌─────────┐         ┌─────────┐
│         │         │  ⚠ 5    │  ← Escalation count badge
│  Title  │         │  Title  │
│         │         │         │
└─────────┘         └─────────┘
                    └── pulsing red glow ──┘
```

### Why This Matters
- **Surfaces problems proactively**: [VISION: Natural Patterns](../VISION.md#vi-natural-patterns-that-will-emerge) notes that escalation clusters are signals—the UI should surface these signals
- **Enables targeted improvement**: Users can click on hotspots to see escalation details and decide if the requirement needs clarification
- **Reduces agent friction**: By addressing hotspots, users reduce future agent escalations

### Implementation Approach
- Track escalation count per block in state
- Add `isEscalationHotspot` boolean (threshold: 3+ escalations in 7 days)
- Apply pulsing glow effect (`shadow-glow-error animate-pulse`)
- Add badge with count

---

## Recommended Alteration 5: Dashboard Widget for Criticality

### Current State
Dashboard supports widgets: `'block-list' | 'graph-view' | 'stats' | 'calendar' | 'custom'`

### Recommended Enhancement

Add dedicated criticality widgets:

```typescript
type DashboardWidgetType =
  | 'block-list'
  | 'graph-view'
  | 'stats'
  | 'calendar'
  | 'custom'
  // New widget types for criticality monitoring
  | 'escalation-queue'      // Pending escalations requiring review
  | 'conflict-tracker'      // Unresolved contradictions/redundancies
  | 'authority-timeline'    // Recent authority level changes
  | 'agent-activity'        // Agent action summary
```

### Widget Specifications

**Escalation Queue Widget**:
```
┌──────────────────────────────────────┐
│  ESCALATION QUEUE (3 pending)        │
├──────────────────────────────────────┤
│  ⚠ Critical: API Contract Conflict   │
│    Agent: planning-agent-001         │
│    Block: api-requirements-001       │
│    2 hours ago                       │
│    [Review] [Dismiss]                │
├──────────────────────────────────────┤
│  ◆ High: Schema Mismatch             │
│    Agent: validation-agent-003       │
│    ...                               │
└──────────────────────────────────────┘
```

**Conflict Tracker Widget**:
```
┌──────────────────────────────────────┐
│  CONFLICTS (5 unresolved)            │
├──────────────────────────────────────┤
│  ⊗ CONTRADICTION: 2 blocks           │
│    "API supports pagination"         │
│       vs                             │
│    "API returns all results"         │
│    [View in Graph] [Resolve]         │
├──────────────────────────────────────┤
│  ≡ REDUNDANCY: 3 blocks              │
│    Similar content detected          │
│    ...                               │
└──────────────────────────────────────┘
```

### Why This Matters
- **Implements the Criticality Dashboard from VISION**: [VISION: Criticality Dashboard](../VISION.md#b-criticality-dashboard--monitoring) requires centralized visibility
- **Actionable insights**: Each item in the widgets is actionable—users can resolve conflicts directly
- **Natural dashboard composition**: Users can arrange these widgets according to their role (e.g., architect dashboard vs. contributor dashboard)

---

## Recommended Alteration 6: Document Assembly View Mode

### Current State
No dedicated "assembled document" view that shows visual chunk structure.

### Recommended Enhancement

Add a new view mode specifically for assembled documents:

```typescript
type ViewType = 'graph' | 'document' | 'brainstorm' | 'folder' | 'timeline' | 'assembled';
```

The `assembled` view would:
1. Traverse blocks using the compositor
2. Render each block with subtle chunk boundaries
3. Show immutability inline (colored bars, icons)
4. Generate TOC from block hierarchy
5. Allow per-block collapse/expand
6. Enable in-place editing with authority checks

### Visual Mockup

```
┌────────────────────────────────────────────────────────────────────┐
│  ASSEMBLED: Project Requirements                                    │
│  Root: manifest-001 | Depth: 3 | Blocks: 15                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TABLE OF CONTENTS                                                  │
│  ├─ 1. Overview (REQUIREMENT) 🔒                                    │
│  ├─ 2. Authentication (SPEC)                                        │
│  │   ├─ 2.1 OAuth Flow (IMPLEMENTATION)                             │
│  │   └─ 2.2 Token Management (IMPLEMENTATION)                       │
│  └─ 3. API Contract (REQUIREMENT) 🛡                                │
│                                                                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ 1. Overview ─────────────────────────────────────── 🔒 LOCKED ─┐
│  │                                                                  │
│  │  This document outlines the core requirements for the system.   │
│  │  All implementations must comply with these requirements.       │
│  │                                                                  │
│  │  [block: requirement-001]  [Authority: SENIOR]  [v3]            │
│  └──────────────────────────────────────────────────────────────────┘
│                                                                     │
│  ┌─ 2. Authentication ────────────────────────────────── MUTABLE ──┐
│  │                                                                  │
│  │  The system uses OAuth 2.0 for authentication...                │
│  │                                                                  │
│  │  [block: spec-002]  [Authority: CONTRIBUTOR]  [v1]              │
│  └──────────────────────────────────────────────────────────────────┘
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Why This Matters
- **Implements Dual-State Operation**: [VISION: Principle 5](../VISION.md#principle-5-dual-state-operation) requires human-readable assembled documents
- **Chunk boundaries visible**: Each block is clearly demarcated with type, authority, and version
- **Editing respects authority**: Users can only edit blocks at or below their authority level
- **TOC generated on-the-fly**: As described in [VISION: On-the-Fly Formatting](../VISION.md#b-on-the-fly-formatting)

---

## Summary: Prioritized Alterations

| Priority | Alteration | Vision Reference | Complexity |
|----------|------------|------------------|------------|
| 1 | Authority info on block back face | Principle 4 | Low |
| 2 | Visual chunk boundaries in document view | UX: Visual Boundaries | Low |
| 3 | Criticality dashboard widgets | Process B | Medium |
| 4 | Escalation hotspot highlighting | Natural Patterns | Medium |
| 5 | Assembled document view mode | Principle 5, UX | High |
| 6 | Graph stratification view | Principle 4, Patterns | High |

---

## Anti-Patterns to Avoid

### Do NOT hide authority information
The temptation is to keep the UI "clean" by hiding complexity. Resist this. Users operating in a governed system need governance information surfaced, not buried.

### Do NOT over-gamify
Escalation hotspots should be informational, not alarming. Avoid red flashing alerts that induce anxiety. Use subtle, consistent visual language.

### Do NOT conflate views
The graph view shows relationships. The document view shows assembled prose. The assembled view shows structure. Keep these distinct—each serves a purpose.

### Do NOT require navigation for status
Key status indicators (immutability, authority, escalation history) should be visible without navigating to a detail page. The flip card pattern is effective because it's instant access.

---

*This document is a living guide. As the system evolves, revisit and update these recommendations.*

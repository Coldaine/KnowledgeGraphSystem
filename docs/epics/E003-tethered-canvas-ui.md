# Epic E003: Tethered Canvas UI

> **Document Classification:** STRATEGIC EPIC
> **Authority Level:** CONTRACT DERIVATIVE
> **Primary Contracts:** [C003 — Dynamic Assembly](../contracts/C003-dynamic-assembly.md)
> **Secondary Contracts:** [C001 — Semantic Chunk](../contracts/C001-semantic-chunk-architecture.md), [C002 — Authority Chain](../contracts/C002-authority-chain.md)
> **Phase:** 2B
> **Status:** PLANNED

---

## 1. Vision Statement

### 1.1 WHY This Epic Matters

The current UI (E001) provides basic graph visualization — nodes and edges displayed with React Flow. But users face two competing problems:

1. **Graph Overwhelm:** Too many relationships visible → cognitive overload
2. **Document Blindness:** Assembled documents hide relationships → context loss

The "Tethered Canvas" concept resolves this paradox through **progressive disclosure**:
- Start with readable documents
- Reveal structure on demand
- Show relationships when relevant, hide when not

**WHY THIS METAPHOR:**
Humans think spatially. By making relationships physical (magnetism, tethers), we leverage intuition. Users don't need to understand graph theory — they see connected things near each other.

### 1.2 What User Need It Addresses

| Persona | Need |
|---------|------|
| **Reader** | "I want to read a document, not parse a graph" |
| **Explorer** | "I want to understand how ideas connect" |
| **Editor** | "I want to edit without breaking relationships" |
| **Auditor** | "I want to see authority levels and provenance" |

### 1.3 Success Criteria

- [ ] Narrative view renders clean, readable documents
- [ ] "Break Apart" reveals underlying chunk structure
- [ ] Semantic magnetism pulls related chunks together
- [ ] Tethers (relationship indicators) appear on hover/toggle
- [ ] Progressive disclosure through three distinct layers
- [ ] Authority indicators visible but not intrusive

---

## 2. Contract Traceability

| Contract | Invariant | Story |
|----------|-----------|-------|
| C003 | INV-02: Chunk Boundaries Preserved | E003-S01 |
| C003 | INV-05: Configurable Depth | E003-S02 |
| C003 | INV-06: Relationship Filtering | E003-S03 |
| C001 | INV-05: Relationship Externalization | E003-S04 |
| C002 | (Visual indicators) | E003-S05 |

---

## 3. Stories

### E003-S01: Narrative View with Chunk Boundaries

**Satisfies:** C003-INV-02 (Chunk Boundaries Preserved)

**Description:**
Default view renders assembled document that looks like a traditional document but with subtle chunk boundaries.

**Acceptance Criteria:**
- [ ] Assembled document renders in readable format
- [ ] Chunk boundaries indicated by subtle styling (spacing, background, border)
- [ ] Boundary style configurable (cards | separators | minimal)
- [ ] "Break Apart" button transitions to structural view
- [ ] Clicking within chunk boundary focuses that chunk for editing

**Implementation Notes:**
- Use CSS transitions for smooth reveal
- Maintain scroll position across view transitions
- Keyboard shortcut for Break Apart (e.g., Cmd+Shift+B)

**Priority:** HIGH

---

### E003-S02: Depth Control Interface

**Satisfies:** C003-INV-05 (Configurable Depth)

**Description:**
Allow users to control traversal depth to see executive summaries or full details.

**Acceptance Criteria:**
- [ ] Depth slider/selector in assembly controls
- [ ] Preset profiles: "Executive" (depth 2), "Technical" (depth 5), "Full" (depth ∞)
- [ ] Live preview as depth changes
- [ ] Depth persists in URL for sharing

**Implementation Notes:**
- Debounce depth changes to avoid excessive re-renders
- Show chunk count at each depth level
- Animate additions/removals when depth changes

**Priority:** MEDIUM

---

### E003-S03: Relationship Type Filtering

**Satisfies:** C003-INV-06 (Relationship Filtering)

**Description:**
Allow users to choose which relationship types to display/follow.

**Acceptance Criteria:**
- [ ] Relationship type toggles in settings panel
- [ ] "Structural only" preset (PARENT_OF, CONTAINS)
- [ ] "All relationships" option
- [ ] Custom presets can be saved
- [ ] Filtering affects both traversal and visualization

**Implementation Notes:**
- Filter state in URL for sharing
- Show count of each relationship type
- Highlight filtered-out relationships in light gray (optional)

**Priority:** MEDIUM

---

### E003-S04: Semantic Magnetism & Tethers

**Satisfies:** C001-INV-05 (Relationship Externalization visible)

**Description:**
Implement the physics-based "magnetism" that pulls related chunks together, with visible tethers showing relationships.

**Acceptance Criteria:**
- [ ] Chunks with strong relationships gravitate toward each other
- [ ] Relationship strength affects gravitational pull
- [ ] Tethers (connecting lines) appear on hover over chunk
- [ ] Tether thickness indicates relationship strength
- [ ] Tether labels show relationship type (toggle-able)

**Implementation Notes:**
- Extend React Flow physics to include relationship-based forces
- Calculate "semantic distance" from edge weight/type
- Use `d3-force` for custom physics simulation
- Performance: limit physics calculations to visible chunks

**Priority:** HIGH

---

### E003-S05: Authority & Provenance Indicators

**Satisfies:** C002 (visual support)

**Description:**
Display authority levels and provenance information without cluttering the view.

**Acceptance Criteria:**
- [ ] Authority level badge on each chunk (color-coded)
- [ ] Provenance info on hover (last edited by, timestamp)
- [ ] Immutable chunks have distinct visual treatment (border, icon)
- [ ] "Show Governance" toggle reveals all governance metadata
- [ ] Changes since last visit highlighted (optional)

**Implementation Notes:**
- Use subtle icons (lock, shield) rather than text labels
- Color coding: green (mutable), yellow (locked), red (immutable)
- Hover card shows full metadata without leaving context

**Priority:** MEDIUM

---

### E003-S06: Three-Layer Progressive Disclosure

**Satisfies:** (UX pattern supporting multiple contracts)

**Description:**
Implement the three-layer interface model from the vision document.

**Acceptance Criteria:**
- [ ] Layer 1 (Narrative): Clean reading view, minimal UI
- [ ] Layer 2 (Logic): Toggle reveals relationship types and taxonomy
- [ ] Layer 3 (Gardener): Full editing capabilities, taxonomy editor
- [ ] Smooth transitions between layers
- [ ] Layer state persists in session

**UI Pattern:**
```
┌────────────────────────────────────────────────┐
│ [Narrative] ───► [Logic] ───► [Gardener]       │
│     🔘            ○            ○               │
│                                                │
│  Toggle between layers with keyboard or UI     │
└────────────────────────────────────────────────┘
```

**Priority:** HIGH

---

### E003-S07: Taxonomy Editor (Gardener Interface)

**Satisfies:** (Human-in-loop governance)

**Description:**
Allow authorized users to edit relationship types and weights directly.

**Acceptance Criteria:**
- [ ] Sidebar showing all relationship types
- [ ] Ability to create custom relationship types (with approval)
- [ ] Adjust relationship weights via slider
- [ ] Visual preview of changes before commit
- [ ] Require confirmation for changes to locked/immutable chunks

**Implementation Notes:**
- Changes to relationship taxonomy require elevated permission
- Preview mode shows "ghost" relationships
- Batch changes with single commit for performance

**Priority:** LOW (Phase 3)

---

### E003-S08: Chunk Edit-in-Place

**Satisfies:** C003-INV-02 (editing respects boundaries)

**Description:**
Enable editing individual chunks without leaving the assembled view.

**Acceptance Criteria:**
- [ ] Click on chunk to enter edit mode (if authorized)
- [ ] Edit mode shows clear chunk boundary
- [ ] Only current chunk is editable (no cross-chunk selection)
- [ ] Save exits edit mode and refreshes assembly
- [ ] Esc cancels without saving

**Implementation Notes:**
- Use contenteditable with custom handlers
- Prevent selection across chunk boundaries
- Auto-save draft to prevent data loss

**Priority:** HIGH

---

### E003-S09: Authority-Aware Block Back Face

**Satisfies:** C002 (authority visibility), [src/types/index.ts:BlockAuthority]

**Description:**
Extend the block back-face (revealed on double-click) to show authority chain information and recent escalation history. Users need to understand not just WHAT is protected, but WHO protected it and WHY.

**Acceptance Criteria:**
- [ ] Authority section shows: Protection level, Required authority, Marked by, Marked at
- [ ] Justification field displayed for IMMUTABLE blocks
- [ ] Recent escalations section shows count and summary (if any)
- [ ] Click-through to escalation details
- [ ] Authority section only appears when `immutability !== MUTABLE`

**Visual Mockup:**
```
┌─────────────────────────────────────────┐
│  METADATA                               │
├─────────────────────────────────────────┤
│  ID: abc-123        Template: note      │
├─────────────────────────────────────────┤
│  AUTHORITY                              │
│  Protection: IMMUTABLE                  │
│  Required Level: SENIOR                 │
│  Marked By: @alice                      │
│  Justification: "Core API contract..."  │
├─────────────────────────────────────────┤
│  RECENT ESCALATIONS (if any)            │
│  ⚠ 2 agents blocked in last 7 days     │
│  → Click to view escalation details     │
└─────────────────────────────────────────┘
```

**WHY:** Escalation hotspots become visible; authority context enables informed decisions about whether to request changes.

**Priority:** HIGH

---

### E003-S10: Visual Chunk Boundaries in Document View

**Satisfies:** C003-INV-02 (chunk boundaries preserved in assembly)

**Description:**
Even in minimal/document view, blocks should have subtle visual boundaries that make the underlying semantic chunk structure apparent. This prevents accidental cross-block edits and maintains immutability visibility.

**Acceptance Criteria:**
- [ ] Subtle left border indicates chunk boundary (visible on hover)
- [ ] Immutable blocks have distinct border color (error/red)
- [ ] Locked blocks have warning/yellow border
- [ ] Block type indicator appears on hover (small, non-intrusive)
- [ ] `data-block-id` attribute for debugging/inspection

**Implementation Notes:**
- Extend minimal viewMode in Block.tsx
- Use CSS: `border-l-2 border-transparent hover:border-text-400/30`
- Color by immutability: `block.immutability === IMMUTABLE && 'border-l-error/50'`

**WHY:** Users develop spatial awareness of document structure—they'll recognize "this red-bordered section is the immutable API contract" and navigate accordingly.

**Priority:** HIGH

---

### E003-S11: Graph View Authority Stratification

**Satisfies:** C002 (authority hierarchy visualization)

**Description:**
Add a "Stratification View" layout option that layers nodes by authority level on the Y-axis. This makes authority hierarchy explicit and helps trace escalation paths.

**Acceptance Criteria:**
- [ ] New layout algorithm option: `'stratified'` in View config
- [ ] Y-position determined by `AuthorityLevel` (SYSTEM at top, AGENT at bottom)
- [ ] X-position determined by existing force-directed algorithm
- [ ] Semantic relationships shown as arrows crossing layers
- [ ] Toggle between standard and stratified views

**Visual Mockup:**
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
```

**WHY:** Users immediately see what content is "above" their authority level. Agent debugging becomes visual—tracing up shows exactly which higher-authority block caused conflict.

**Priority:** MEDIUM

---

### E003-S12: Escalation Hotspot Highlighting

**Satisfies:** C002-INV-05 (escalation visibility), [src/types/index.ts:EscalationEvent]

**Description:**
Blocks that frequently cause agent escalations should be visually distinct in graph view, with a badge showing escalation count and a pulsing glow effect.

**Acceptance Criteria:**
- [ ] Track escalation count per block in state
- [ ] Hotspot threshold: 3+ escalations in 7 days
- [ ] Pulsing glow effect on hotspot blocks
- [ ] Badge showing escalation count
- [ ] Click on badge to see escalation details
- [ ] Hotspots visible in all graph layouts (including stratified)

**Visual Mockup:**
```
Normal Block:       Escalation Hotspot:
┌─────────┐         ┌─────────┐
│         │         │  ⚠ 5    │  ← Escalation count badge
│  Title  │         │  Title  │
│         │         │         │
└─────────┘         └─────────┘
                    └── pulsing glow ──┘
```

**Implementation Notes:**
- Add `isEscalationHotspot` computed property
- Apply `shadow-glow-error animate-pulse` CSS
- Consider performance with many hotspots

**WHY:** Escalation clusters are signals that requirements may need clarification. By addressing hotspots, users reduce future agent friction.

**Priority:** MEDIUM

---

## 4. Dependencies

### Upstream Dependencies
- **E001 (Core Foundation):** Graph visualization foundation
- **E002 (Governance):** Authority levels to display

### Downstream Dependents
- **E004 (Agent Orchestration):** UI must show agent activity
- **E005 (KnowledgeOps):** Dashboard may embed canvas views

---

## 5. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance with many chunks | High | Medium | Virtualization, lazy rendering |
| Physics simulation jank | Medium | Medium | Web Workers, throttling |
| Cognitive overload despite design | High | Low | User testing, simplify defaults |
| Mobile/touch support | Medium | Medium | Separate touch-optimized mode |

---

## 6. Technical Decisions

| Decision | Choice | WHY |
|----------|--------|-----|
| Physics engine | d3-force | Proven, customizable, integrates with React Flow |
| Animation library | Framer Motion | Already in stack, declarative API |
| Tether rendering | SVG overlays | Performant, style-able, z-index control |
| Edit mode | Custom implementation | Need fine control over selection boundaries |

---

## 7. Story Priority

| Priority | Stories | Rationale |
|----------|---------|-----------|
| HIGH | S01, S04, S06, S08, S09, S10 | Core UX — readable + discoverable + authority visibility |
| MEDIUM | S02, S03, S05, S11, S12 | Enhanced control — power users + governance visualization |
| LOW | S07 | Advanced editing — Phase 3 |

---

## 8. Design References

### Inspiration Sources
- **Notion:** Clean document editing
- **Miro:** Spatial canvas metaphor
- **Obsidian:** Graph visualization
- **Figma:** Progressive disclosure, hover states

### Key Differentiator
Unlike these tools, Tethered Canvas enforces **semantic chunk boundaries** — you cannot accidentally break the atomic structure of knowledge. The UI guides users to work *with* the graph, not around it.

---

*This epic transforms the graph from a visualization tool to an intuitive workspace where structure emerges naturally.*

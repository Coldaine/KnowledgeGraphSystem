# Epic E001: Core Foundation

> **Document Classification:** STRATEGIC EPIC
> **Authority Level:** CONTRACT DERIVATIVE
> **Primary Contracts:** [C001 — Semantic Chunk Architecture](../contracts/C001-semantic-chunk-architecture.md)
> **Secondary Contracts:** [C003 — Dynamic Assembly](../contracts/C003-dynamic-assembly.md)
> **Phase:** MVP (Complete)
> **Status:** DELIVERED

---

## 1. Vision Statement

### 1.1 WHY This Epic Matters

Before any governance, before any agents, before any sophisticated UI — the system must have a **solid data foundation**. This epic establishes:

- The Block as the atomic unit of knowledge
- Relationships as explicit, typed connections
- The ability to assemble blocks into readable documents

Without this foundation, all other epics are impossible.

### 1.2 What User Need It Addresses

| Persona | Need |
|---------|------|
| **Knowledge Worker** | "I need to capture information in discrete, reusable chunks" |
| **Technical Writer** | "I need to assemble chunks into coherent documents" |
| **System** | "I need atomic units I can index, search, and govern" |

### 1.3 Success Criteria

- [ ] Blocks can be created, edited, deleted
- [ ] Blocks have unique IDs, types, and content
- [ ] Relationships connect blocks with explicit types
- [ ] The compositor can traverse blocks to create documents
- [ ] Basic UI displays blocks and allows manipulation

---

## 2. Contract Traceability

This epic satisfies the following contract invariants:

| Contract | Invariant | Story |
|----------|-----------|-------|
| C001 | INV-01: Atomic Addressability | E001-S01 |
| C001 | INV-02: Self-Contained Meaning | E001-S02 |
| C001 | INV-03: Typed Classification | E001-S03 |
| C001 | INV-04: Explicit Boundaries | E001-S02 |
| C001 | INV-05: Relationship Externalization | E001-S04 |
| C001 | INV-06: Single Source of Truth | E001-S05 |
| C003 | INV-01: Assembly is Ephemeral | E001-S06 |
| C003 | INV-02: Chunk Boundaries Preserved | E001-S06 |
| C003 | INV-03: Traversal Determinism | E001-S06 |

---

## 3. Stories

### E001-S01: Block Identity System

**Satisfies:** C001-INV-01 (Atomic Addressability)

**Description:**
Implement the block identity system that ensures every block has a globally unique, immutable identifier.

**Acceptance Criteria:**
- [ ] Every block receives a UUID v4 on creation
- [ ] Block ID cannot be modified after creation
- [ ] Duplicate IDs are impossible (constraint enforced)
- [ ] IDs are used for all references (no position-based addressing)

**Implementation Notes:**
- Use `crypto.randomUUID()` or equivalent
- ID field is `readonly` in TypeScript interface
- Database enforces unique constraint

**Status:** COMPLETE

---

### E001-S02: Block Content Model

**Satisfies:** C001-INV-02 (Self-Contained Meaning), C001-INV-04 (Explicit Boundaries)

**Description:**
Implement the block content model that ensures each block contains a complete, bounded thought.

**Acceptance Criteria:**
- [ ] Block has `content` field for markdown/text
- [ ] Block has `title` field for identification
- [ ] Content is stored without continuation markers
- [ ] LLM chunker validates self-containment

**Implementation Notes:**
- Content is markdown string
- Chunking prompts emphasize complete thoughts
- UI prevents "continued from..." patterns

**Status:** COMPLETE

---

### E001-S03: Block Type Taxonomy

**Satisfies:** C001-INV-03 (Typed Classification)

**Description:**
Implement the block type system with the defined taxonomy.

**Acceptance Criteria:**
- [ ] `BlockType` enum with: note, requirement, spec, impl, test, manifest
- [ ] Every block must have exactly one type
- [ ] Type determines default behaviors (authority level, rendering)
- [ ] Type is assigned at creation, changeable by authorized users

**Implementation Notes:**
```typescript
type BlockType = 'note' | 'requirement' | 'spec' | 'impl' | 'test' | 'manifest';
```

**Status:** COMPLETE

---

### E001-S04: Relationship System

**Satisfies:** C001-INV-05 (Relationship Externalization)

**Description:**
Implement relationships as first-class entities external to block content.

**Acceptance Criteria:**
- [ ] `Edge` entity with fromBlockId, toBlockId, relationType
- [ ] Structural relations: PARENT_OF, CONTAINS_ORDERED
- [ ] Semantic relations: IMPLEMENTS, DEPENDS_ON, VERIFIED_BY
- [ ] Edges are independently addressable (have own ID)
- [ ] No inline links in block content

**Implementation Notes:**
```typescript
interface Edge {
  id: string;
  fromBlockId: string;
  toBlockId: string;
  relationType: RelationType;
  order?: number;
  metadata?: Record<string, unknown>;
}
```

**Status:** COMPLETE

---

### E001-S05: Reference vs. Copy Enforcement

**Satisfies:** C001-INV-06 (Single Source of Truth)

**Description:**
Ensure that information exists in exactly one block, with all other occurrences being references.

**Acceptance Criteria:**
- [ ] No "copy block" operation that duplicates content
- [ ] Links/references create edges, not copies
- [ ] LLM chunker detects and deduplicates similar content
- [ ] Similarity detection flags potential duplicates

**Implementation Notes:**
- "Duplicate" button creates REFERENCES relationship, not copy
- Similarity threshold: 0.85 embedding cosine similarity

**Status:** PARTIAL — Similarity detection planned for Phase 2

---

### E001-S06: Document Compositor

**Satisfies:** C003-INV-01 (Assembly is Ephemeral), C003-INV-02 (Chunk Boundaries Preserved), C003-INV-03 (Traversal Determinism)

**Description:**
Implement the document compositor that assembles blocks into readable documents.

**Acceptance Criteria:**
- [ ] Compositor takes AssemblyConfig and returns assembled document
- [ ] Assembled document is not persisted (ephemeral)
- [ ] Chunk boundaries are visually indicated
- [ ] Same config + same graph = identical output
- [ ] Table of contents generation supported

**Implementation Notes:**
```typescript
interface AssemblyConfig {
  rootBlockId: string;
  traversalProfile: TraversalProfile;
  format: 'markdown' | 'html';
  includeToc: boolean;
}

const result = compositor.assemble(config);
```

**Status:** COMPLETE

---

### E001-S07: Basic Graph UI

**Satisfies:** (Implementation support, no direct contract invariant)

**Description:**
Implement the React Flow-based graph visualization.

**Acceptance Criteria:**
- [ ] Blocks render as nodes in graph view
- [ ] Edges render as connections between nodes
- [ ] Double-click flips block to show metadata
- [ ] Drag-and-drop repositioning with physics
- [ ] Minimap and controls available

**Implementation Notes:**
- React Flow for graph rendering
- Custom node component for blocks
- Physics simulation for natural movement

**Status:** COMPLETE

---

### E001-S08: Persistence Layer

**Satisfies:** (Implementation support, no direct contract invariant)

**Description:**
Implement data persistence for blocks, edges, and configuration.

**Acceptance Criteria:**
- [ ] Blocks persist across sessions
- [ ] Edges persist across sessions
- [ ] Export/import functionality
- [ ] localStorage for MVP, Neo4j planned

**Implementation Notes:**
- Zustand store with persist middleware
- JSON export for data portability
- Migration path to Neo4j in Phase 3

**Status:** COMPLETE

---

## 4. Dependencies

### Upstream Dependencies
- None (this is the foundation)

### Downstream Dependents
- **E002 (Governance):** Requires blocks to have authority levels
- **E003 (Tethered Canvas):** Requires compositor and graph visualization
- **E004 (Agent Orchestration):** Requires chunks agents can read/write
- **E005 (KnowledgeOps):** Requires audit targets (blocks, edges)

---

## 5. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance at scale | High | Medium | Smart edge culling, virtualization (implemented) |
| Data migration complexity | Medium | High | Export format versioning, migration scripts |
| Type taxonomy too rigid | Medium | Low | Extension protocol in C001 allows amendments |

---

## 6. Implementation Summary

### Technology Stack Chosen

| Decision | Choice | WHY |
|----------|--------|-----|
| Frontend framework | Next.js + React | SSR capability, ecosystem, team familiarity |
| Graph visualization | React Flow | Best-in-class React graph library, physics support |
| State management | Zustand | Lightweight, persistent, TypeScript-native |
| Styling | Tailwind CSS | Utility-first, rapid iteration |
| Animation | Framer Motion | Declarative, performant |

**Reference:** [Architecture Decisions](../architecture/DECISIONS.md)

---

## 7. Delivery Summary

| Metric | Value |
|--------|-------|
| Stories | 8 total |
| Complete | 7 |
| Partial | 1 (similarity detection) |
| Blocked | 0 |

**Epic Status:** DELIVERED

---

*This epic established the foundation. All subsequent epics build upon these blocks, edges, and assemblies.*

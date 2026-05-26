# Knowledge Graph System

A block-based knowledge management app with interactive graph visualization, document assembly, and an authority-chain governance model. Built with Next.js, Zustand, and React Flow.

## What it is

Everything is a **Block** — the atomic unit of knowledge. Blocks have types (note, requirement, spec, implementation, test), tags, and an immutability level. Edges between blocks carry a relation type (structural or semantic). The app stores state in `localStorage` via Zustand persist.

The graph view is the primary interface. Document view, Brainstorm mode, and Folder view exist as navigation targets but show placeholder UI ("Coming soon") — the underlying `DocumentCompositor` and `Dashboard` components are implemented but not yet wired into the main page routing.

## Current state

| Surface | Status |
|---------|--------|
| Graph view (React Flow, physics, drill-down) | Working |
| Block CRUD with authority-chain enforcement | Working |
| Document compositor (depth-first traversal, markdown/HTML/JSON) | Implemented, not yet routed |
| Dashboard (drag-and-drop grid, block-list/stats/calendar widgets) | Implemented, not yet routed |
| Document view page | Placeholder ("Coming soon") |
| Brainstorm mode page | Placeholder ("Coming soon") |
| Folder view page | Placeholder ("Coming soon") |
| LLM chunking (`lib/llm/chunking.ts`) | First pass / unwired |
| Neo4j backend | Not started |

## Architecture

```
src/
  pages/          # Next.js pages (index.tsx = main shell)
  components/
    Block/        # Block card with flip animation and editor
    GraphView/    # React Flow canvas with physics simulation
    Dashboard/    # Draggable widget grid (react-grid-layout)
  lib/
    compositor/   # DocumentCompositor: graph traversal -> markdown/HTML/JSON
    llm/          # LLM chunking skeleton
    templates/    # Block templates
  stores/
    blockStore.ts # Central Zustand store (blocks, edges, tags, escalations)
  types/          # Full TypeScript type system
```

### Authority chain

Blocks carry an `ImmutabilityLevel` (MUTABLE / LOCKED / IMMUTABLE). Every write goes through `validateWrite()` which checks the caller's `AuthorityLevel`. Blocked writes emit an `EscalationEvent` logged to the store. Agent tiers (DRONE / ARCHITECT / JUDGE) map to authority levels via `getAgentClearanceFromTier()`.

### Data model

```typescript
Block  { id, type, title, content, tags, immutability, state, position, ... }
Edge   { id, fromBlockId, toBlockId, relationType, order? }
Tag    { id, label, group, inheritable, color }
```

Structural relations (`PARENT_OF`, `CONTAINS_ORDERED`) drive document traversal and tag inheritance. Semantic relations are stored but displayed on demand only.

## Quick start

```bash
# Prerequisites: Node.js 18+
npm install
cp .env.example .env.local
# Add GOOGLE_API_KEY to .env.local for LLM features (optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Double-click the canvas to create a block. Double-click a block to flip it and see metadata.

## Export / import

Use the toolbar Download/Upload buttons to export or import the full graph as JSON. The schema is versioned (`"version": "1.0.0"`).

## Development

```bash
npm run dev        # Development server
npm run build      # Production build
npm run typecheck  # TypeScript check
npm test           # Jest test suite
```

## Automation runner

`automation/agent_runner.py` is a rotating-agent script that schedules Gemini/Codex/Claude to develop features on a 30–35 minute cycle. This is a development utility, not part of the app runtime.

## Roadmap

- Wire Document, Brainstorm, and Folder views into the page router
- Neo4j adapter to replace `localStorage`
- Real LLM chunking integration (Gemini API key already scaffolded)
- Collaborative editing and version control

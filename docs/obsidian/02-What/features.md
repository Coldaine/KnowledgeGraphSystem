---
title: Implemented Features
tags: [#kg/what/features]
---

# Implemented Features (Phase 1 MVP) {#features}

> [!abstract] Stats  
> 30+ files, ~8k LOC, 100% TS, 15 components, 60FPS target met.

## Core
- ✅ Block types: 10 templates (Note, Req, Spec, Impl, Test, Manifest)
- ✅ Dual rels: 7 types
- ✅ Tags: 8 groups, inheritance
- ✅ Immutability: 3 levels
- ✅ Graph viz: React Flow, physics, minimap
- ✅ Doc assembly: Traverser + formatter
- ✅ LLM chunking: Gemini inference/rels/tags

## UI/UX
- ✅ Views: Graph, Doc, Brainstorm, Folder, Dashboards
- ✅ Interactions: Drag physics, double-click flip, shortcuts (gg/gd/gb/gf)
- ✅ Theme: Dark glassmorphism, animations

## Persistence
- ✅ localStorage auto-save
- ✅ JSON export/import
- ✅ Sample data loader

> [!missing] Phase 2+  
> Tree-sitter, Neo4j, Agents, PDF export.

```dataview
TABLE tags
FROM "obsidian/02-What"
WHERE contains(tags, "#kg/what")
```


---
title: Roadmap
tags: [#kg/future]
source: [[repos/KnowledgeGraphSystem/ROADMAP.md|Original]]
---

# Roadmap {#roadmap}

Phase 1 ✅ MVP: Blocks, graph, LLM chunking.

## Phases Table
| Phase | Q | Key Features | Timeline |
|-------|---|--------------|----------|
| 2 | Q1'25 | Graph algos, Tree-sitter, Ontology | 8-10w |
| 3 | Q2 | Neo4j, Auth, API | 10-12w |
| 4 | Q3 | Multi-LLM, GraphRAG, Agents | 12-14w |
| 5 | Q4 | Enterprise scale/security | 14-16w |
| 6 | '26 | Mobile/PWA | 16-20w |

> [!decisions] Key  
> See [[01-Why/decisions]]

```mermaid
gantt
    title Phases
    dateFormat  YYYY-MM
    section Phase 1
    MVP :done, p1, 2024-12, 1m
    section Phase 2
    Graph+Agents :p2, 2025-01, 2m
    section Phase 3
    Neo4j :p3, 2025-03, 3m
```

> [!todo] Metrics: 10k nodes, 99.9% uptime.


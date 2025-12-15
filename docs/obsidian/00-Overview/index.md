---
title: Knowledge Graph System - Map of Content
tags: [#kg/project, #kg/overview]
aliases: [MOC, Home]
---

# Knowledge Graph System Obsidian Vault {#moc}

A block-based knowledge management system with graph visualization & LLM integration. [[02-What/project-summary|Built]] & [[04-Future/roadmap|Planned]].

## Navigation

> [!column] Sections
> 
> **[[01-Why/decisions|🧠 Why]]**  
> Decisions & research
> 
> **[[02-What/architecture|🏗️ What]]**  
> Architecture & features
> 
> **[[03-How/usage|🔧 How]]**  
> Usage & deployment
> 
> **[[04-Future/roadmap|🔮 Future]]**  
> Roadmap
> 
> **[[06-Challenges/decay|⚠️ Challenges]]**  
> Decay & verification

## Quick Access

| Category | Key Files |
|----------|-----------|
| Start | [[03-How/quick-start|Quick Start]] |
| Data Model | [[02-What/data-model|Data Model]] |
| Decisions | [[01-Why/decisions|Decisions]] |
| Decay | [[06-Challenges/knowledge-decay|Knowledge Decay]] |

```mermaid
graph TB
    A[Docs] --> B[Why]
    A --> C[What]
    A --> D[How]
    A --> E[Future]
    B --> F[Decisions]
    C --> G[Arch]
    D --> H[Deploy]
    E --> I[Roadmap]
```

> [!how] Typical Workflow
> 1. [[03-How/quick-start|Quick Start]]
> 2. Load sample data
> 3. Visualize graph `file '../../src/lib/sampleData.ts'`
> 4. Assemble doc via compositor
> 5. Export MD/PDF


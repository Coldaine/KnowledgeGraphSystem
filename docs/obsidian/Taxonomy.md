---
title: Tag Taxonomy & Organization Rules
tags: [#kg/taxonomy]
---

# Tag Taxonomy & Organization Rules {#taxonomy}

## Folder Structure

| Folder | Purpose |
|--------|---------|
| `00-Overview` | High-level summaries, Map of Content (MOC) |
| `01-Why` | Decisions, research rationale, WHY choices |
| `02-What` | Implemented architecture, features, WHAT built |
| `03-How` | Usage guides, deployment, internals, HOW it works |
| `04-Future` | Roadmap, future plans |
| `05-Prompts` | LLM agent prompts |
| `06-Challenges` | Open issues like knowledge decay |
| `07-Index` | Dataview queries, vault overview |

## Tag Taxonomy {#tags}

### Hierarchical Tags
```
#kg/why
  └─ #kg/why/decision
  └─ #kg/why/research
#kg/what
  └─ #kg/what/arch
  └─ #kg/what/features
  └─ #kg/what/ui
#kg/how
  └─ #kg/how/usage
  └─ #kg/how/deploy
  └─ #kg/how/decay
#kg/future
  └─ #kg/future/phase[1-6]
#kg/impl
  └─ #kg/impl/tree-sitter
  └─ #kg/impl/neo4j
  └─ #kg/impl/agents
```

### Usage Rules {#rules}
1. **Frontmatter**: Every file MUST have `tags: [array]`
2. **Links**: Use `[[Folder/File#Heading]]` for internal, `file 'path'` for repo code
3. **Callouts**: 
   > [!why]- Decision  
   > Body with rationale
4. **Diagrams**: ```mermaid graph TD ...```
5. **Dataview**: Queries in 07-Index for dynamic lists
6. **Visuals**: Frequent tables, embeds, callouts for scannability
7. **Secrets**: Reference Bitwarden CLI (`bws secret get GEMINI_API_KEY`)

> [!abstract] Purpose  
> Knowledge persistence for solo dev + LLM agents. No user-facing, pure context + decisions.


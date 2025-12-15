---
title: Dataview Queries
tags: [#kg/index]
---

# Vault Queries {#dataview}

```dataview
TABLE file.tasks.text, file.tasks.state
FROM "obsidian"
FLATTEN file.tasks AS tasks
WHERE tasks.state != "x"

LIST
FROM "obsidian"
WHERE contains(tags, "#kg/why")
SORT file.ctime DESC
```

> [!todo] Add Excalidraw for diagrams.


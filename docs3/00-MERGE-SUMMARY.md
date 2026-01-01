# Vision Merge Summary

## What This Directory Contains

`docs3/` contains merge recommendations comparing:
- **Upstream (master)**: Constitution, Contracts, Epics, Knowledge Ops docs
- **Ours (docs2/)**: VISION.md, UI_PHILOSOPHY.md, types-additions.ts

---

## Quick Decision Matrix

| Area | Verdict | Rationale |
|------|---------|-----------|
| **Document Hierarchy** | ADOPT upstream | Constitution → Contracts → Epics is rigorous |
| **Constitution** | ADOPT upstream | 7 principles, "constitutional" framing |
| **Agent Model** | ADOPT upstream | 3-tier Senate > our flat AGENT |
| **Knowledge Decay** | ADOPT upstream | We completely missed this |
| **Authority Levels** | KEEP ours | 6-level enum for principal roles |
| **TypeScript Types** | KEEP ours | Upstream has prose, we have interfaces |
| **UI Philosophy** | KEEP ours | Specific implementation guidance |
| **Conflict Taxonomy** | KEEP ours | Richer than upstream's contradiction-only |
| **Escalation/Agentic Review** | MERGE | Same concept, adopt upstream naming |

---

## Files in This Directory

| File | Purpose |
|------|---------|
| [01-CONSTITUTION-merge.md](./01-CONSTITUTION-merge.md) | Adopt upstream's 7 principles |
| [02-CONTRACTS-merge.md](./02-CONTRACTS-merge.md) | Adopt + add our types to C002, C005 |
| [03-EPICS-merge.md](./03-EPICS-merge.md) | Adopt + add UI stories, type references |
| [04-KNOWLEDGE-OPS-merge.md](./04-KNOWLEDGE-OPS-merge.md) | Adopt upstream entirely (we missed this) |
| [05-TYPES-merge.md](./05-TYPES-merge.md) | Keep ours + add decay/agent tier types |

---

## The Big Picture

```
UPSTREAM PROVIDES                    WE PROVIDE
────────────────                    ───────────
Document hierarchy                   TypeScript interfaces
Constitutional framing               Implementation types
Agent Senate (3-tier)               AuthorityLevel (6-level)
Knowledge decay model               Conflict taxonomy
Verification agents                 UI implementation guidance
Tree-sitter integration             Cross-references to code
"Motion to Change" naming           Full interface definitions
```

**Together**: A complete governance system for human-AI knowledge collaboration.

---

## Next Steps

1. Apply type changes from `05-TYPES-merge.md` to `src/types/index.ts`
2. Add UI stories from `03-EPICS-merge.md` to E003
3. Reference decay docs from E005
4. Rename AgenticReview → MotionToChange
5. Delete docs2/ and docs3/ after merge is complete

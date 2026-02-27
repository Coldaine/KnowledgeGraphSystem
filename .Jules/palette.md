## 2026-01-18 - Accessible Graph Nodes
**Learning:** Custom React Flow nodes must explicitly handle keyboard interaction (`onKeyDown` with `Enter`/`Space`) and map it to selection logic, as `role="button"` on a `div` does not automatically trigger click handlers.
**Action:** When creating custom nodes, always wrap the interactive element with `tabIndex={0}`, `role="button"`, and a `onKeyDown` handler that calls `e.preventDefault()` and the selection callback.

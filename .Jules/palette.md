## 2024-05-23 - Graph Node Accessibility
**Learning:** `ReactFlow` nodes require manual accessibility implementation (tabIndex, role, onKeyDown) as the library doesn't handle keyboard interaction for custom nodes automatically. Mapping Enter/Space to interactions is crucial for screen reader users.
**Action:** Always add `tabIndex={0}`, `role="article"`, `aria-label`, and `onKeyDown` handlers to custom ReactFlow node components.

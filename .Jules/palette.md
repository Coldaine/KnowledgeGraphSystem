## 2024-05-23 - Graph Node Accessibility
**Learning:** Custom React Flow nodes (like `Block`) do not inherit keyboard accessibility by default. Adding `tabIndex={0}`, `role="article"`, and `onKeyDown` handlers is essential for enabling keyboard users to navigate and interact with graph nodes.
**Action:** When creating or modifying custom graph nodes, always implement standard keyboard event handlers (`Enter`, `Space`) and ensure focus visibility (`focus-visible:ring`) to support accessibility.

## 2024-05-23 - Event Bubbling in Interactive Cards
**Learning:** In complex card components with nested interactive elements (buttons inside a clickable card), event bubbling can cause unintended parent actions (like selection or flipping) when interacting with children.
**Action:** Always check `e.target === e.currentTarget` in container `onKeyDown` handlers and use `e.stopPropagation()` in child `onClick` handlers to isolate interactions.

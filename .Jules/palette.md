## 2024-05-22 - Accessible Graph Nodes
**Learning:** Custom interactive graph nodes (using `react-flow` or similar) require explicit `tabIndex={0}`, `role="button"`, and `onKeyDown` handlers for accessibility.
**Action:** When creating clickable cards or nodes, always add these attributes and ensure `focus-visible` styles are applied for keyboard users. Use `document.activeElement === e.currentTarget` in `onKeyDown` to prevent child interactive elements (buttons) from triggering the container's action.

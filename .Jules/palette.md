## 2024-05-22 - Accessibility of Custom Graph Nodes
**Learning:** Custom React Flow nodes do not inherit keyboard accessibility by default. They are rendered as standard divs and require explicit `tabIndex={0}`, `role="button"`, and `onKeyDown` handlers to support keyboard navigation and activation (Enter/Space).
**Action:** When creating or modifying custom graph nodes, always wrap the interactive container with accessibility attributes and ensure keyboard events trigger the same actions as click/double-click events.

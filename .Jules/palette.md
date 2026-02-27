## 2024-05-24 - Keyboard Navigation in Custom Graph Nodes
**Learning:** Custom nodes in react-flow-renderer do not inherit keyboard accessibility by default. Relying on `onClick` alone excludes keyboard users, making the graph impossible to navigate without a mouse.
**Action:** Always manually add `tabIndex={0}`, `role="button"`, `aria-label`, and `onKeyDown` handlers (listening for Enter/Space) to interactive custom nodes.

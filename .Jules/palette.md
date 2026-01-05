## 2024-05-23 - Graph Node Accessibility
**Learning:** Custom React Flow nodes are `div`s by default and completely invisible to keyboard users. Adding `tabIndex={0}`, `role`, and `onKeyDown` handlers manually is required to make them accessible.
**Action:** Always wrap custom node content in an interactive container with proper ARIA attributes and keyboard event handlers (Enter/Space to activate).

## 2024-05-23 - Graph Node Accessibility
**Learning:** React Flow nodes are not natively keyboard accessible for custom interactions (like flipping). Adding `tabIndex={0}`, `role="article"`, and `onKeyDown` handlers for `Enter`/`Space` is crucial for keyboard users to interact with node content beyond simple selection.
**Action:** When creating custom nodes in React Flow, always wrap the interactive content in a focusable container with appropriate ARIA roles and keyboard event listeners.

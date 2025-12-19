## 2025-12-19 - Keyboard Interactions for React Flow
**Learning:** React Flow nodes are just divs by default. To make them accessible, the custom node component itself must implement 'tabIndex', 'role', and 'onKeyDown'.
**Action:** When creating custom nodes, always wrap the content in a focusable container with keyboard event handlers for the primary action (e.g., flip or select).

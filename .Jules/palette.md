
## 2026-01-13 - Graph Node Keyboard Accessibility
**Learning:** Interactive graph nodes (like in React Flow) often lack native keyboard accessibility because they are essentially `div` elements. Users relying on keyboards cannot select or interact with them. Adding `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space is critical for basic accessibility.
**Action:** When creating custom node components for graph visualizations, always wrap the interactive part in a container with proper ARIA roles and keyboard event listeners to ensure they are accessible to keyboard and screen reader users.

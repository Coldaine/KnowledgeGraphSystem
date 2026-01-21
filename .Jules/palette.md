## 2026-01-21 - Graph Node Accessibility
**Learning:** Custom React Flow nodes (like `Block`) require explicit `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers to be accessible. They also need `focus-visible` styles for keyboard navigation visual feedback.
**Action:** When creating custom nodes, always wrap the interactive element in a container with these attributes and ensure keyboard events (Enter/Space) trigger the same action as click/double-click.

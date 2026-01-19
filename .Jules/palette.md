## 2026-01-19 - Graph Node Accessibility
**Learning:** Custom React Flow nodes (like `Block.tsx`) are just `div`s and lack native accessibility. They require manual `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space to be keyboard accessible.
**Action:** Always wrap custom node content in a semantic interactive element or apply full ARIA attributes and keyboard handlers to the container.

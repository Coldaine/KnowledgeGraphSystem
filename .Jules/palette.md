
## 2024-05-22 - Graph Node Accessibility
**Learning:** Custom React Flow nodes (like `Block.tsx`) are `div`s by default and completely inaccessible to keyboard users. They require manual addition of `tabIndex={0}`, `role="button"`, and `onKeyDown` handlers for Enter/Space to replicate click/double-click behavior.
**Action:** When creating any new custom node type for React Flow, immediately add the "accessibility trio": `tabIndex`, `role`, and `onKeyDown` wrapper.

## 2024-05-22 - React Flow Focus Styles
**Learning:** Default browser focus rings are often suppressed or invisible on canvas elements. Explicit `focus-visible:ring-2` (Tailwind) styles are essential for keyboard navigation visibility in the graph.
**Action:** Always add explicit focus styles to the interactive container of a custom node.

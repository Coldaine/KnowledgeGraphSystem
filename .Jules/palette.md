# Palette's Journal

## 2024-05-22 - TipTap Editor Accessibility
**Learning:** TipTap's default starter kit does not include ARIA labels for toolbar buttons, making the editor nearly unusable for screen reader users.
**Action:** Always wrap toolbar buttons in a component that enforces `aria-label` and `title` props.

## 2024-05-22 - Graph Node Focus
**Learning:** Default browser focus outlines are often suppressed by canvas-based libraries like `react-flow-renderer`.
**Action:** Manually add `focus-visible:ring-2` to interactive elements within custom nodes.

## 2024-05-22 - React Flow Keyboard Interaction
**Learning:** Custom nodes in React Flow require explicit `tabIndex={0}` and `onKeyDown` handlers to support keyboard interaction, as the library doesn't automatically delegate keyboard events to node content.
**Action:** Implement `onKeyDown` in all custom node components to handle `Enter` and `Space` for primary actions (like flipping or selecting).

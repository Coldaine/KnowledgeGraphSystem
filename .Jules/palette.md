# Palette's Journal 🎨

## 2024-05-23 - ReactFlow Node Accessibility
**Learning:** Custom ReactFlow nodes act as plain `div` elements and lack native keyboard support.
**Action:** When creating interactive nodes (like flip cards), explicit `tabIndex={0}`, `role="button"`, and `onKeyDown` handlers (mapping Enter/Space to click actions) are required. Use `focus-visible` ring styles to indicate focus state clearly within the canvas.

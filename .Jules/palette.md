# Palette's Journal 🎨

## 2024-05-22 - Graph Node Accessibility
**Learning:** React Flow custom nodes require explicit manual handling of keyboard events (`onKeyDown`) and focus management (`tabIndex`, `role`). React Flow's internal selection handling does not automatically trigger the external store update needed for the application state unless explicitly wired up via `onClick`.
**Action:** When creating custom interactive nodes, always wrap them in a container that handles `onClick` (for selection), `onKeyDown` (for keyboard activation/selection), and `tabIndex` (for focus).

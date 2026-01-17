# Palette's Journal

## 2024-05-22 - Initial Setup
**Learning:** Starting the accessibility journey for this repo.
**Action:** Always check for existing accessibility patterns before implementing new ones.

## 2024-05-22 - Graph Node Accessibility
**Learning:** Custom React Flow nodes must handle keyboard events manually. `role="button"`, `tabIndex={0}`, and `onKeyDown` (Enter/Space) are essential as the library doesn't provide them by default for custom nodes.
**Action:** When creating new graph nodes, always wrap interactive elements in a container with these attributes.

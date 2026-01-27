## 2024-05-23 - Graph Node Accessibility
**Learning:** Custom React Flow nodes are interactive elements but often lack native keyboard support. Wrapping them in semantic `role="button"` with `tabIndex={0}` and explicitly handling `onKeyDown` for 'Enter'/'Space' transforms them from "clickable divs" to fully accessible components without compromising the graph visualization.
**Action:** Always audit custom graph nodes for keyboard interactivity and ensure visual focus states (`focus-visible`) are present to guide keyboard users through the node network.

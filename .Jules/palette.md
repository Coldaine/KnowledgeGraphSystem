## 2024-05-22 - Graph View Verification Reliability
**Learning:** Headless browser verification of React Flow graph interactions is extremely flaky due to canvas rendering and potential overlays.
**Action:** For graph-based features, prioritize component-level unit tests (like `Block.test.tsx` or `BlockEditor.test.tsx`) over full E2E verification, or accept manual verification for complex graph interactions.

## 2024-05-22 - Icon Accessibility
**Learning:** Icon-only buttons often lack ARIA labels, making them invisible to screen readers.
**Action:** Always add `aria-label` to buttons that only contain an icon.

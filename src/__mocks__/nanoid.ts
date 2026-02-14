// Generate unique IDs for testing
let counter = 0;
export const nanoid = () => `test-id-${++counter}`;

// Reset counter for test isolation (can be called in beforeEach)
export const resetNanoid = () => {
  counter = 0;
};

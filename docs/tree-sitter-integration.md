# Tree-sitter Integration Plan

**DECISION: Parse code blocks to AST subnodes (functions/classes as Block children). Eases Phase 2.1 algos (centrality on calls).**

## Implementation
- Install tree-sitter grammars (npm)
- Block.code → parse → extract nodes → create sub-Blocks (e.g., FunctionBlock)
// etc from research


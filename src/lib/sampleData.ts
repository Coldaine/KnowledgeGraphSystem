/**
 * Sample Data for Knowledge Graph System
 *
 * Demonstrates the system's capabilities with a software project example
 */

import {
  Block,
  Edge,
  Tag,
  BlockType,
  BlockState,
  ImmutabilityLevel,
  StructuralRelation,
  SemanticRelation,
  TagGroup,
} from '@/types';

// Sample Tags
export const sampleTags: Tag[] = [
  {
    id: 'tag-project-alpha',
    label: 'Project Alpha',
    group: TagGroup.ORGANIZATIONAL,
    inheritable: true,
    system: false,
    color: '#3B82F6',
    description: 'Main project tag',
  },
  {
    id: 'tag-backend',
    label: 'Backend',
    group: TagGroup.DOMAIN,
    inheritable: true,
    system: false,
    color: '#8B5CF6',
    description: 'Backend development',
  },
  {
    id: 'tag-frontend',
    label: 'Frontend',
    group: TagGroup.DOMAIN,
    inheritable: true,
    system: false,
    color: '#EC4899',
    description: 'Frontend development',
  },
  {
    id: 'tag-high-priority',
    label: 'High Priority',
    group: TagGroup.PRIORITY,
    inheritable: false,
    system: false,
    color: '#EF4444',
    description: 'High priority items',
  },
  {
    id: 'tag-in-progress',
    label: 'In Progress',
    group: TagGroup.STATUS,
    inheritable: false,
    system: false,
    color: '#F59E0B',
    description: 'Currently being worked on',
  },
  {
    id: 'tag-completed',
    label: 'Completed',
    group: TagGroup.STATUS,
    inheritable: false,
    system: false,
    color: '#10B981',
    description: 'Completed items',
  },
  {
    id: 'tag-authentication',
    label: 'Authentication',
    group: TagGroup.DOMAIN,
    inheritable: true,
    system: false,
    color: '#6366F1',
    description: 'Authentication and authorization',
  },
  {
    id: 'tag-api',
    label: 'API',
    group: TagGroup.DOMAIN,
    inheritable: true,
    system: false,
    color: '#14B8A6',
    description: 'API development',
  },
];

// Sample Blocks
export const sampleBlocks: Block[] = [
  // Project Root Manifest
  {
    id: 'block-manifest',
    type: BlockType.MANIFEST,
    templateId: 'doc.manifest',
    title: 'Project Alpha - Knowledge Management System',
    content: `# Project Alpha

A next-generation knowledge management system built with graph visualization and AI-powered content processing.

## Vision
Create a flexible, block-based knowledge system that enables users to build, organize, and visualize complex information networks.

## Key Features
- Graph-based visualization
- AI-powered document chunking
- Dynamic document assembly
- User-composed dashboards`,
    tags: ['tag-project-alpha'],
    fields: {
      version: '1.0.0',
      author: 'Development Team',
      created: '2024-01-01',
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.LOCKED,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'system',
    updatedAt: new Date('2024-01-01'),
    version: 1,
    position: { x: 400, y: 100 },
  },

  // Requirements
  {
    id: 'block-req-1',
    type: BlockType.REQUIREMENT,
    templateId: 'requirement',
    title: 'User Authentication System',
    content: `Users must be able to securely authenticate and manage their accounts.

The system should support:
- Email/password authentication
- OAuth integration (Google, GitHub)
- Multi-factor authentication
- Password reset functionality`,
    tags: ['tag-authentication', 'tag-high-priority', 'tag-backend'],
    fields: {
      priority: 'high',
      acceptanceCriteria: [
        'Users can register with email/password',
        'Users can log in securely',
        'Session management is implemented',
        'OAuth providers work correctly',
      ],
      stakeholder: 'Product Owner',
      deadline: '2024-02-15',
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.LOCKED,
    createdBy: 'user',
    createdAt: new Date('2024-01-05'),
    updatedBy: 'user',
    updatedAt: new Date('2024-01-10'),
    version: 2,
    position: { x: 200, y: 250 },
  },

  {
    id: 'block-req-2',
    type: BlockType.REQUIREMENT,
    templateId: 'requirement',
    title: 'Graph Visualization',
    content: `The system must provide an interactive graph visualization for blocks and their relationships.

Requirements:
- Support for 1000+ nodes
- 60 FPS performance target
- Physics-based node positioning
- Smart edge rendering`,
    tags: ['tag-frontend', 'tag-high-priority'],
    fields: {
      priority: 'high',
      acceptanceCriteria: [
        'Graph renders smoothly with 1000 nodes',
        'Maintains 60 FPS during interactions',
        'Nodes have physics-based repulsion',
        'Edges are culled intelligently',
      ],
      stakeholder: 'Technical Lead',
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user',
    createdAt: new Date('2024-01-06'),
    updatedBy: 'user',
    updatedAt: new Date('2024-01-06'),
    version: 1,
    position: { x: 600, y: 250 },
  },

  // Specifications
  {
    id: 'block-spec-1',
    type: BlockType.SPEC,
    templateId: 'specification',
    title: 'Authentication API Specification',
    content: `## Authentication API

### Endpoints

#### POST /api/auth/register
- Body: { email, password, name }
- Response: { user, token }

#### POST /api/auth/login
- Body: { email, password }
- Response: { user, token }

#### POST /api/auth/logout
- Headers: Authorization: Bearer {token}
- Response: { success: true }

#### GET /api/auth/me
- Headers: Authorization: Bearer {token}
- Response: { user }`,
    tags: ['tag-api', 'tag-authentication', 'tag-backend'],
    fields: {
      interfaces: ['/api/auth/register', '/api/auth/login', '/api/auth/logout', '/api/auth/me'],
      constraints: [
        'JWT tokens expire after 24 hours',
        'Password minimum 8 characters',
        'Email must be verified',
      ],
      decisions: [
        'Use JWT for stateless authentication',
        'Store sessions in Redis',
        'Implement rate limiting',
      ],
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user',
    createdAt: new Date('2024-01-08'),
    updatedBy: 'user',
    updatedAt: new Date('2024-01-12'),
    version: 3,
    position: { x: 200, y: 400 },
  },

  {
    id: 'block-spec-2',
    type: BlockType.SPEC,
    templateId: 'specification',
    title: 'Graph Rendering Engine',
    content: `## Graph Rendering Specification

### Architecture
- React Flow for base graph rendering
- Custom node and edge components
- Physics simulation with spring forces
- Performance optimization with edge culling

### Data Flow
1. Blocks converted to React Flow nodes
2. Edges filtered based on visibility rules
3. Physics applied during drag operations
4. Render optimizations for 60 FPS`,
    tags: ['tag-frontend', 'tag-in-progress'],
    fields: {
      interfaces: ['GraphView', 'NodeComponent', 'EdgeComponent', 'PhysicsEngine'],
      constraints: [
        'Maximum 100 visible edges by default',
        'Node count up to 10,000',
        'Maintain 60 FPS',
      ],
      risks: [
        'Performance degradation with many edges',
        'Browser memory limitations',
      ],
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user',
    createdAt: new Date('2024-01-09'),
    updatedBy: 'user',
    updatedAt: new Date('2024-01-15'),
    version: 2,
    position: { x: 600, y: 400 },
  },

  // Implementations
  {
    id: 'block-impl-1',
    type: BlockType.IMPLEMENTATION,
    templateId: 'implementation',
    title: 'JWT Authentication Module',
    content: `## JWT Authentication Implementation

\`\`\`typescript
export class AuthService {
  generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token: string): DecodedToken {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
\`\`\`

Implemented using jsonwebtoken library with RS256 algorithm.`,
    tags: ['tag-authentication', 'tag-backend', 'tag-in-progress'],
    fields: {
      language: 'TypeScript',
      framework: 'Node.js/Express',
      codeReference: 'src/services/auth.service.ts',
      dependencies: ['jsonwebtoken', 'bcrypt', 'express'],
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'developer',
    createdAt: new Date('2024-01-14'),
    updatedBy: 'developer',
    updatedAt: new Date('2024-01-16'),
    version: 2,
    position: { x: 200, y: 550 },
  },

  {
    id: 'block-impl-2',
    type: BlockType.IMPLEMENTATION,
    templateId: 'implementation',
    title: 'React Flow Graph Component',
    content: `## Graph View Implementation

\`\`\`tsx
export const GraphView: React.FC = () => {
  const { blocks, edges } = useBlockStore();

  const nodes = useMemo(() =>
    convertBlocksToNodes(blocks),
    [blocks]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
\`\`\``,
    tags: ['tag-frontend', 'tag-completed'],
    fields: {
      language: 'TypeScript',
      framework: 'React/Next.js',
      codeReference: 'src/components/GraphView/GraphView.tsx',
      dependencies: ['react-flow-renderer', 'framer-motion'],
      performance: {
        renderTime: '16ms',
        fps: 60,
        memoryUsage: '45MB',
      },
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'developer',
    createdAt: new Date('2024-01-13'),
    updatedBy: 'developer',
    updatedAt: new Date('2024-01-18'),
    version: 4,
    position: { x: 600, y: 550 },
  },

  // Tests
  {
    id: 'block-test-1',
    type: BlockType.TEST,
    templateId: 'test',
    title: 'Authentication API Tests',
    content: `## Test Suite: Authentication API

### Test Cases
1. User registration with valid data
2. User registration with invalid email
3. Login with correct credentials
4. Login with incorrect password
5. Token verification
6. Token expiration handling`,
    tags: ['tag-authentication', 'tag-backend', 'tag-completed'],
    fields: {
      testType: 'integration',
      expectedResult: 'All authentication endpoints work correctly',
      actualResult: 'All tests passing',
      coverage: 92,
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'tester',
    createdAt: new Date('2024-01-17'),
    updatedBy: 'tester',
    updatedAt: new Date('2024-01-17'),
    version: 1,
    position: { x: 200, y: 700 },
  },

  {
    id: 'block-test-2',
    type: BlockType.TEST,
    templateId: 'test',
    title: 'Graph Performance Tests',
    content: `## Performance Test Suite

### Scenarios
1. Render 100 nodes - Target: <100ms
2. Render 1000 nodes - Target: <500ms
3. Drag operation - Target: 60 FPS
4. Zoom/pan - Target: 60 FPS`,
    tags: ['tag-frontend', 'tag-in-progress'],
    fields: {
      testType: 'performance',
      expectedResult: 'All performance targets met',
      actualResult: 'Pending',
      testData: {
        scenario1: { nodes: 100, renderTime: '82ms' },
        scenario2: { nodes: 1000, renderTime: '450ms' },
      },
    },
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'tester',
    createdAt: new Date('2024-01-18'),
    updatedBy: 'tester',
    updatedAt: new Date('2024-01-18'),
    version: 1,
    position: { x: 600, y: 700 },
  },

  // Note
  {
    id: 'block-note-1',
    type: BlockType.NOTE,
    templateId: 'default',
    title: 'Architecture Decision: Graph Library',
    content: `# Decision: Use React Flow for Graph Visualization

## Context
We needed a robust graph visualization library that could handle our requirements for performance and customization.

## Options Considered
1. **React Flow** - React-native, good DX, active community
2. **D3.js** - Maximum flexibility but more complex
3. **Cytoscape.js** - Good for analysis, less for interaction
4. **vis.js** - Older, less React-friendly

## Decision
We chose React Flow because:
- Native React integration
- Good performance up to 1000 nodes
- Extensive customization options
- Active maintenance and community
- Built-in features (minimap, controls, etc.)

## Consequences
- Positive: Fast implementation, good UX
- Negative: Some limitations for very large graphs (10k+ nodes)
- Mitigation: Implement edge culling and node virtualization`,
    tags: ['tag-frontend'],
    fields: {
      notes: 'Reviewed with team on 2024-01-10',
    },
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.IMMUTABLE,
    createdBy: 'architect',
    createdAt: new Date('2024-01-10'),
    updatedBy: 'architect',
    updatedAt: new Date('2024-01-10'),
    version: 1,
    position: { x: 400, y: 850 },
  },
];

// Sample Edges
export const sampleEdges: Edge[] = [
  // Manifest relationships
  {
    id: 'edge-1',
    fromBlockId: 'block-manifest',
    toBlockId: 'block-req-1',
    relationType: StructuralRelation.CONTAINS_ORDERED,
    order: 1,
    createdBy: 'system',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'edge-2',
    fromBlockId: 'block-manifest',
    toBlockId: 'block-req-2',
    relationType: StructuralRelation.CONTAINS_ORDERED,
    order: 2,
    createdBy: 'system',
    createdAt: new Date('2024-01-06'),
  },

  // Requirement to Spec relationships
  {
    id: 'edge-3',
    fromBlockId: 'block-req-1',
    toBlockId: 'block-spec-1',
    relationType: SemanticRelation.IMPLEMENTS,
    label: 'Specifies API',
    createdBy: 'user',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'edge-4',
    fromBlockId: 'block-req-2',
    toBlockId: 'block-spec-2',
    relationType: SemanticRelation.IMPLEMENTS,
    label: 'Specifies rendering',
    createdBy: 'user',
    createdAt: new Date('2024-01-09'),
  },

  // Spec to Implementation relationships
  {
    id: 'edge-5',
    fromBlockId: 'block-spec-1',
    toBlockId: 'block-impl-1',
    relationType: SemanticRelation.IMPLEMENTS,
    label: 'Implements auth',
    createdBy: 'developer',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: 'edge-6',
    fromBlockId: 'block-spec-2',
    toBlockId: 'block-impl-2',
    relationType: SemanticRelation.IMPLEMENTS,
    label: 'Implements graph',
    createdBy: 'developer',
    createdAt: new Date('2024-01-13'),
  },

  // Implementation to Test relationships
  {
    id: 'edge-7',
    fromBlockId: 'block-impl-1',
    toBlockId: 'block-test-1',
    relationType: SemanticRelation.VERIFIED_BY,
    label: 'Tested by',
    createdBy: 'tester',
    createdAt: new Date('2024-01-17'),
  },
  {
    id: 'edge-8',
    fromBlockId: 'block-impl-2',
    toBlockId: 'block-test-2',
    relationType: SemanticRelation.VERIFIED_BY,
    label: 'Performance tested',
    createdBy: 'tester',
    createdAt: new Date('2024-01-18'),
  },

  // Note reference
  {
    id: 'edge-9',
    fromBlockId: 'block-spec-2',
    toBlockId: 'block-note-1',
    relationType: SemanticRelation.REFERENCES,
    label: 'Decision rationale',
    createdBy: 'architect',
    createdAt: new Date('2024-01-10'),
  },

  // Dependencies
  {
    id: 'edge-10',
    fromBlockId: 'block-impl-2',
    toBlockId: 'block-impl-1',
    relationType: SemanticRelation.DEPENDS_ON,
    label: 'Requires auth',
    createdBy: 'developer',
    createdAt: new Date('2024-01-15'),
  },
];

/**
 * Load sample data into the store
 */
export function loadSampleData(store: any) {
  // Clear existing data
  store.clearAll();

  // Load tags
  sampleTags.forEach((tag) => {
    store.tags.set(tag.id, tag);
  });

  // Load blocks
  sampleBlocks.forEach((block) => {
    store.blocks.set(block.id, block);
  });

  // Load edges
  sampleEdges.forEach((edge) => {
    store.edges.set(edge.id, edge);
  });

  console.log('✅ Sample data loaded successfully');
  console.log(`   ${sampleBlocks.length} blocks`);
  console.log(`   ${sampleEdges.length} edges`);
  console.log(`   ${sampleTags.length} tags`);
}
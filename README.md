# Knowledge Graph System

A sophisticated block-based knowledge management system with graph visualization, intelligent document assembly, and LLM-powered content processing.

![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-25%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-15%25-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![React](https://img.shields.io/badge/React-18.2-61dafb)

---

## ⚠️ Project Status

**Current State:** Buildable Prototype (~30% of vision implemented)

| Aspect | Status | Details |
|--------|--------|---------|
| **Build** | ✅ Passing | `npm run build` succeeds, dev server starts |
| **Tests** | ✅ 25 passing | Core state management tested, ~15% coverage |
| **UI** | ✅ Functional | Graph view, block editor, visualization working |
| **LLM Integration** | ⚠️ Untested | Code exists but never tested with real API key |
| **Backend** | ❌ Not Built | No database, no API server, localStorage only |
| **Production Ready** | ❌ No | Prototype for development and testing |

**📊 For detailed status assessment, see:**
- [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) - Comprehensive gap between specs and implementation
- [HONEST_STATUS.md](./HONEST_STATUS.md) - Brutally honest assessment of what works
- [REMEDIATION_SUMMARY.md](./REMEDIATION_SUMMARY.md) - Recent fixes and improvements

---

## Documentation

This project follows **spec-based design** with immutable contracts. All decisions trace from principles to implementation.

### Quick Navigation

| Document | Description |
|----------|-------------|
| [Documentation Index](./docs/README.md) | Entry point to all documentation |
| [Constitution](./docs/CONSTITUTION.md) | Immutable foundational principles |
| [Vision](./docs/VISION.md) | Unified system vision |
| [Contracts](./docs/contracts/README.md) | Immutable specifications |
| [Epics](./docs/epics/README.md) | Strategic initiatives |
| [Architecture Decisions](./docs/architecture/DECISIONS.md) | Technical decisions with rationale |

### Document Hierarchy

```
CONSTITUTION → CONTRACTS → EPICS → STORIES → CODE
   (Why)        (What)     (What)   (How)    (How)
```

Every feature traces back to a Contract. Every Contract traces back to a Constitutional Principle. This ensures we build what we planned and can explain why anything exists.

---

## Features

### ✅ Implemented & Working

- **Block-Based Architecture**: Everything is a "Block" - the atomic unit of knowledge (16 tests)
- **Dual Relationship Model**: Structural + Semantic relationships (3 tests)
- **Graph Visualization**: React Flow-based interactive graph with physics simulation
- **Three-Tier Immutability**: Mutable, Locked, and Immutable protection levels
- **Tag System**: Organizational tagging with groups (3 tests)
- **State Management**: Zustand with localStorage persistence
- **Glassmorphism UI**: Modern dark theme with blur effects and depth
- **Document View**: Basic document assembly from blocks
- **Block Editor**: Rich text editing with Tiptap

### ⚠️ Implemented but Untested

- **LLM-Powered Chunking**: Intelligent document ingestion using Gemini 3 Flash API (never tested with real key)
- **Dynamic Document Assembly**: Compositor that traverses blocks (exists, needs integration testing)
- **Smart Edge Rendering**: Performance-optimized edge display (basic implementation)

### ❌ Specified but Not Built

- **User-Composed Dashboards**: Custom workspaces from widgets and filters
- **Backend Database**: Neo4j/PostgreSQL integration
- **Multi-user Support**: Authentication and collaboration
- **Real-time Sync**: WebSocket-based updates
- **Agent Orchestration**: AI-powered automation (skeleton only)
- **Knowledge Decay**: Tracking and verification (not implemented)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/knowledge-graph.git
cd knowledge-graph

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Gemini API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Data Model
```typescript
Block {
  id: string
  type: BlockType (note | requirement | spec | impl | test | manifest)
  templateId: string
  title: string
  content: string (Markdown/MDX)
  tags: TagId[]
  immutability: ImmutabilityLevel
  // ... metadata, audit fields
}

Edge {
  fromBlockId: BlockId
  toBlockId: BlockId
  relationType: StructuralRelation | SemanticRelation
  order?: number
  // ... metadata
}

Tag {
  label: string
  group: TagGroup
  inheritable: boolean
  color: string
}
```

### Technology Stack

**Implemented:**
- **Frontend**: Next.js 14.2, React 18.2, TypeScript 5.3
- **Styling**: Tailwind CSS with glassmorphism design system
- **State Management**: Zustand with Immer middleware and localStorage persistence
- **Graph Visualization**: React Flow v10.3 (react-flow-renderer)
- **LLM Integration**: Google Generative AI SDK (@google/genai v1.41) - Gemini 3 Flash Preview
- **Editor**: Tiptap for rich text editing
- **Testing**: Jest + React Testing Library (25 tests, 15% coverage)

**Not Yet Implemented:**
- **Animation**: Framer Motion (partially used)
- **Database**: Neo4j/PostgreSQL (localStorage only for now)
- **Backend**: No API server yet

## 📊 Views & Modes

### System Views
1. **Graph View**: Main visualization with React Flow
2. **Document View**: Assembled document from block traversal
3. **Brainstorm Mode**: Structured planning with lanes
4. **Folder View**: Repository-style hierarchical display

### User Dashboards
Build custom dashboards by composing:
- Block lists with filters
- Statistics widgets
- Calendar views
- Mini graph displays

## 🔄 Document Assembly

The compositor traverses blocks using configurable profiles:

```typescript
const config: AssemblyConfig = {
  rootBlockId: 'manifest-123',
  traversalProfile: {
    strategy: 'depth-first',
    followRelations: [PARENT_OF, CONTAINS_ORDERED],
    maxDepth: 3,
    respectOrder: true
  },
  format: 'markdown',
  includeToc: true
};

const result = await compositor.assemble(config);
```

## 🤖 LLM Integration

### Current Status: Code Exists, Untested ⚠️

The system uses **Gemini 3 Flash Preview** API with thinking level controls (MINIMAL/LOW/MEDIUM/HIGH):

```typescript
// src/lib/llm/chunking.ts - Implemented but never tested
const response = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: prompt,
  config: {
    thinkingConfig: { thinkingLevel: 'LOW' }
  }
});
```

**Implemented (but untested):**
- Intelligent document chunking
- Block type inference

**Not Yet Implemented:**
- Relationship extraction
- Tag suggestions
- Natural language queries
- Automated organization
- Conflict detection

**To Test:** Get a Gemini API key and add to `.env.local` (see [.env.example](./.env.example))

## 🎨 Design System

### Color Palette
- **Background**: #101520 (deep navy)
- **Primary**: #63B5FF (vibrant blue)
- **Accent**: #B5FF63 (energetic green)
- **Graph layers**: 6 depth levels

### Glassmorphism Effects
```css
backdrop-blur: 12px;
background: rgba(16, 21, 32, 0.7);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
```

### Animation Timing
- Feedback: ≤200ms
- Transitions: ≤400ms
- 60 FPS target for all interactions

## 🚧 Development

### Project Structure
```
src/
├── components/      # React components
│   ├── Block/      # Core block component
│   ├── GraphView/  # Graph visualization
│   └── Dashboard/  # Dashboard system
├── lib/            # Business logic
│   ├── compositor/ # Document assembly
│   ├── llm/        # LLM integration
│   └── templates/  # Block templates
├── stores/         # Zustand stores
├── types/          # TypeScript definitions
└── styles/         # Global styles
```

### Automation (Not Implemented)
The project includes planning scripts in `automation/` but they are **skeleton implementations** that create TODO files, not actual AI agent orchestration. True agent automation is part of [Epic E004](./docs/epics/E004-agent-orchestration.md) (not yet built).

## 📈 Performance Guidelines

### Rendering Optimization
- Smart edge culling (show structural, hide semantic)
- Maximum 100 visible edges by default
- Progressive disclosure based on context
- GPU-accelerated transforms

### Physics Simulation
- Spring-based node repulsion
- Bully radius: 32px
- Smooth momentum decay
- Collision detection

## 🗺️ Roadmap

**See [ROADMAP.md](./ROADMAP.md) for full details and [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) for reality check**

### Phase 1: Validate Prototype (Current - 1-2 weeks)
- [ ] Test LLM integration with real Gemini API key
- [ ] Add integration tests for document assembly
- [ ] Fix remaining UI bugs (keyboard shortcuts)
- [ ] Increase test coverage to 50%+
- [ ] Manual testing of all features

### Phase 2: Backend Foundation (2-4 weeks)
- [ ] Add Next.js API routes
- [ ] Implement database layer (Neo4j or PostgreSQL)
- [ ] Basic authentication
- [ ] Migrate from localStorage to backend

### Phase 3: Governance Minimal (4-6 weeks)
- [ ] Audit trail (C005)
- [ ] Basic authority chain (C002)
- [ ] Immutability enforcement
- [ ] Version tracking

### Phase 4: LLM Integration Verified (2-3 weeks)
- [ ] Test and fix document chunking
- [ ] Add relationship extraction
- [ ] Implement tag suggestions
- [ ] Verify accuracy with real documents

### Future Phases
- Phase 5: Graph algorithms and layouts
- Phase 6: Knowledge decay tracking
- Phase 7: Agent orchestration
- Phase 8: Multi-user and real-time sync

**Reality:** We have ~30% of the documented vision. This is a solid foundation, not a complete system.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Flow team for the excellent graph library
- Vercel for Next.js
- Google for Gemini API
- The open-source community

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using cutting-edge web technologies and AI assistance.
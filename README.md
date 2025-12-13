# Knowledge Graph System

A sophisticated block-based knowledge management system with graph visualization, intelligent document assembly, and LLM-powered content processing.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React](https://img.shields.io/badge/React-18.2-61dafb)

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

### Core Capabilities
- **Block-Based Architecture**: Everything is a "Block" - the atomic unit of knowledge
- **Dual Relationship Model**: Structural relationships for document assembly + Semantic relationships for knowledge graphs
- **Dynamic Document Assembly**: Compositor that traverses blocks to generate documents
- **LLM-Powered Chunking**: Intelligent document ingestion using Gemini API
- **Graph Visualization**: React Flow-based interactive graph with physics simulation
- **User-Composed Dashboards**: Build custom workspaces from widgets and filters
- **Three-Tier Immutability**: Mutable, Locked, and Immutable protection levels

### Key Interactions
- **Double-Click Flip**: Blocks flip to reveal metadata on the back
- **Smart Edge Rendering**: Performance-optimized edge display (structural by default, semantic on demand)
- **Tag Inheritance**: Organizational tags cascade down, technical tags don't
- **Glassmorphism UI**: Modern dark theme with blur effects and depth

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
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS with glassmorphism design system
- **State Management**: Zustand with persistence
- **Graph Visualization**: React Flow
- **Animation**: Framer Motion
- **LLM Integration**: Gemini API for document chunking
- **Editor**: Tiptap for rich text editing
- **Data Persistence**: localStorage (MVP), Neo4j (planned)

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

### Phase 1 (Current)
- Intelligent document chunking
- Block type inference
- Relationship extraction
- Tag suggestions

### Phase 2 (Planned)
- 75% of interactions via LLM
- Natural language queries
- Automated organization
- Conflict detection

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

### Automation
The project includes automation scripts that use rotating AI agents (Gemini, Codex, Claude) to continuously develop features every 30-35 minutes:

```bash
# Run once
python automation/agent_runner.py --once

# Run continuously
python automation/agent_runner.py
```

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

### Phase 1 (MVP) ✅
- [x] Core block system
- [x] Graph visualization
- [x] Document compositor
- [x] LLM chunking
- [x] Dashboard composition
- [x] Local storage persistence

### Phase 2 (Enhancement)
- [ ] Neo4j backend integration
- [ ] Advanced LLM features (75% automation)
- [ ] Collaborative editing
- [ ] Version control system
- [ ] Conflict resolution UI
- [ ] Export to PDF/DOCX

### Phase 3 (Scale)
- [ ] Multi-user support
- [ ] Real-time sync
- [ ] Plugin system
- [ ] API endpoints
- [ ] Mobile applications

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
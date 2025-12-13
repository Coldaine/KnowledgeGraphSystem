# Knowledge Decay Strategy: Critical Implementation Document

**Status**: CRITICAL GAP - Not currently implemented in data model or documentation

## The Problem (Evidence-Based)

Your own ZO_WAY distilled research found: **"Without validation, 30% of documents drift from schema within 6 months."** This is knowledge decay in action, and the current system has NO mechanisms to track, detect, or manage it.

## Current State: Temporal Tracking Exists (But Under-Documented)

### What IS Tracked
```typescript
// Block temporal metadata
createdAt: Date;      // When knowledge entered the system 
updatedAt: Date;      // Last modification
version: number;      // Update count

// Provenance (Phase 3+)
provenance?: {
  source?: string;    // URL or file path
  importId?: string;  // Import batch identifier
  originalId?: string; // Source system ID
};
```

### What's MISSING (The Critical Gap)
```typescript
// Knowledge decay tracking (NOT in current data model)
ttl?: number;                    // Time-to-live in days
decayRate?: 'fast'|'medium'|'slow'|'none';
lastVerified?: Date;            // Manual verification timestamp
verificationSource?: string;    // Who/what verified it
reviewCycle?: number;           // Days between mandatory reviews
staleAfter?: Date;              // Explicit expiration date
confidenceScore?: number;       // Degrades over time

// Decay categorization (NOT implemented)
knowledgeType?: 'api'|'pricing'|'library'|'architecture'|'math';
externalDependency?: string[];  // External dependencies affecting freshness
}
```

## Knowledge Decay Taxonomy

### Fast Decay (Review Cycle: 2-4 weeks)
- **API documentation** - Breaking changes, deprecation
- **Library versions** - Major version updates, security patches
- **Pricing data** - Market fluctuations, plan changes
- **Cloud provider features** - Rapid service evolution
- **Security advisories** - Threat landscape changes
- **Dependency versions** - Compatibility matrix shifts

**Example**: Stripe API v2024-12 → v2025-01 breaking change invalidates integration docs

### Medium Decay (Review Cycle: 3-6 months)
- **Framework best practices** - Community shifts, anti-patterns emerge
- **Tool recommendations** - New alternatives, performance changes
- **Performance benchmarks** - Hardware/software evolution
- **Integration patterns** - Ecosystem maturity
- **Deployment strategies** - Platform updates

**Example**: React 18 concurrent features change best practices for state management

### Slow Decay (Review Cycle: 1-2 years)
- **System architecture** - Fundamental patterns evolve slowly
- **Core algorithms** - Proven solutions persist
- **Database schemas** - Schema migrations are rare
- **Design principles** - Timeless patterns (SOLID, DRY)

**Example**: Microservices architecture patterns remain relevant for 3-5 years

### No Decay (Review Cycle: 5+ years)
- **Mathematical proofs** - Timeless correctness
- **Core CS theory** - Fundamentals don't change
- **Historical decisions** - Immutable project history
- **Legal/compliance** - Regulatory requirements (until changed)

**Example**: Big O notation analysis is valid for decades

## Implementation Strategy

### Phase 1: Data Model (Immediate)
Add to `Block` interface in `/src/types/index.ts`:

```typescript
export interface Block {
  // ... existing fields
  
  // Knowledge decay tracking (NEW)
  ttl?: number;                              // Days until stale
  decayCategory?: DecayCategory;            // Fast/Medium/Slow/None
  lastVerifiedAt?: Date;                     // Manual verification
  verificationSource?: string;               // URL, person, or system
  reviewCycleDays?: number;                  // Override default cycle
  isAutoVerified?: boolean;                  // Can AI verify this?
}

export enum DecayCategory {
  FAST = 30,      // Days
  MEDIUM = 180,   // 6 months  
  SLOW = 730,     // 2 years
  NONE = 36500,   // 100 years (effectively never)
}
```

### Phase 2: Automated Review System (Q2 2025)

```typescript
// In blockStore.ts augmentation
getStaleBlocks: (threshold = 0.3) => Block[] => {
  const now = Date.now();
  const blocks = Array.from(get().blocks.values());
  
  return blocks.filter(block => {
    const daysSinceUpdate = (now - block.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    const categoryDays = block.decayCategory || DecayCategory.MEDIUM;
    
    // Stale if past TTL or past category threshold
    return daysSinceUpdate > (block.ttl || categoryDays * threshold);
  });
}

// Background job (Phase 4 automation)
reviewQueue: (blockId: BlockId) => void => {
  set((state) => {
    const block = state.blocks.get(blockId);
    if (block) {
      // Add to review queue
      block.reviewStatus = 'pending';
      block.reviewAssignedTo = autoAssignReviewer();
      block.reviewDueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  });
}
```

### Phase 3: AI-Assisted Verification (Q3-4 2025)

```typescript
// For API docs, library versions, etc.
canAutoVerify = (block: Block) => {
  return [
    'api', 'library', 'pricing', 'security'
  ].includes(block.knowledgeType);
}

// Automated verification via MCP servers
autoVerifyBlock: async (blockId: BlockId) => {
  const block = get().blocks.get(blockId);
  if (!block || !block.canAutoVerify) return false;
  
  // Query source via MCP
  const currentSource = await queryMcpServer(block.provenance.source);
  const isCurrent = compareContent(block.content, currentSource);
  
  if (isCurrent) {
    block.lastVerifiedAt = new Date();
    block.isAutoVerified = true;
    block.confidenceScore = 1.0;
  }
  
  return isCurrent;
}
```

## Critical Policies

### 1. Ingestion-Time Classification
**Mandatory**: Every imported block MUST be assigned a decay category

```typescript
// During ingestion in blockStore.ts
createBlock: (params) => {
  // Auto-categorize based on content analysis
  const inferredCategory = params.decayCategory || 
    inferDecayCategory(params.content, params.provenance?.source);
  
  return {
    // ... existing fields
    decayCategory: inferredCategory,
    ttl: params.ttl || inferredCategory,
  };
}

// Helper function
inferDecayCategory(content: string, source?: string): DecayCategory {
  const fastPatterns = ['API', 'endpoint', 'version', 'pricing', 'security'];
  const mediumPatterns = ['framework', 'library', 'best practice', 'benchmark'];
  
  const lower = content.toLowerCase();
  
  if (fastPatterns.some(p => lower.includes(p))) return DecayCategory.FAST;
  if (mediumPatterns.some(p => lower.includes(p))) return DecayCategory.MEDIUM;
  if (source?.includes('github.com')) return DecayCategory.MEDIUM; // Code decays
  if (source?.includes('arxiv.org')) return DecayCategory.SLOW; // Research slow
  
  return DecayCategory.MEDIUM; // Default
}
```

### 2. Staleness Alerting
```typescript
// Dashboard warning component
const StalenessAlert = ({ block }) => {
  const daysStale = getDaysSinceStale(block);
  const severity = daysStale > 90 ? 'critical' : 
                   daysStale > 30 ? 'warning' : 'info';
  
  return (
    <Alert severity={severity}>
      <AlertTitle>Stale Knowledge Detected</AlertTitle>
      This block is {daysStale} days stale. 
      Last updated: {block.updatedAt.toLocaleDateString()}
      {block.knowledgeType === 'api' && 
        "⚠️ API documentation can become dangerously outdated!"}
    </Alert>
  );
};
```

### 3. Review Queue Integration
- **Daily**: Review queue shows blocks past 50% of TTL
- **Weekly**: Automated email summary with decay statistics
- **Monthly**: Dashboard showing knowledge health metrics

## Metrics & Reporting

### Knowledge Health Dashboard
```typescript
interface KnowledgeHealthMetrics {
  totalBlocks: number;
  staleBlocks: number;
  stalePercentage: number;
  byCategory: {
    fast: { stale: number, total: number };
    medium: { stale: number, total: number };
    slow: { stale: number, total: number };
  };
  byKnowledgeType: Record<string, { stale: number, total: number }>;
  avgDaysSinceUpdate: number;
  autoVerifiedPercentage: number;
  reviewQueueSize: number;
}
```

## ZO_WAY Integration

**Action Required**: Update distilled PDFs to include:

1. **Feasibility-LocalKG.pdf**: Add ingestion timestamp preservation
2. **AI-Agent-Frameworks.pdf**: Auto-Audit scheduling (quarterly reviews)
3. **AgenticCoding.pdf**: Code dependency decay tracking
4. **DocAwareAgents.pdf**: Document staleness detection via MCP queries

Update `ROADMAP.md`:
- **Phase 2.5**: Add "Knowledge decay categorization" to Ontology Management
- **Phase 4.2**: Add "Automated knowledge verification agents" 
- **Phase 5.2**: Add "Knowledge health monitoring" to metrics collection

This is as critical as authentication or backup—**knowledge without freshness tracking is a liability, not an asset**.

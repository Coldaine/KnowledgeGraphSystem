/**
 * Core type definitions for the Knowledge Graph System
 *
 * This file contains all the primary data structures used throughout the application.
 * The system is built around Blocks as the atomic unit, with Templates defining
 * their behavior and relationships connecting them.
 */

// ============================================================================
// Block System Types
// ============================================================================

export type BlockId = string;
export type TemplateId = string;
export type EdgeId = string;
export type TagId = string;

/**
 * Core block types in the system
 */
export enum BlockType {
  NOTE = 'note',
  REQUIREMENT = 'requirement',
  SPEC = 'spec',
  IMPLEMENTATION = 'impl',
  TEST = 'test',
  DATA_SOURCE = 'data.source',
  MANIFEST = 'doc.manifest',
  ASSEMBLER = 'view.assembler',
  DASHBOARD_BLOCK = 'dashboard.block',
  FILTER = 'filter.block',
}

/**
 * Immutability levels for blocks
 * Based on our three-tier system:
 * - Mutable: Normal editing allowed
 * - Locked: Changes require explicit unlock
 * - Immutable: Changes require elevated permission
 */
export enum ImmutabilityLevel {
  MUTABLE = 'mutable',
  LOCKED = 'locked',
  IMMUTABLE = 'immutable',
}

/**
 * Block state for tracking lifecycle
 */
export enum BlockState {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

/**
 * Core Block interface - the atomic unit of the system
 */
export interface Block {
  id: BlockId;
  type: BlockType;
  templateId: TemplateId;

  // Content
  title: string;
  content: string; // Markdown/MDX

  // Metadata
  fields: Record<string, any>; // Type-specific fields
  tags: TagId[];
  inheritedTags?: TagId[]; // Tags inherited from parent blocks

  // State
  state: BlockState;
  immutability: ImmutabilityLevel;

  // Audit
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  version: number;

  // Provenance
  provenance?: {
    source?: string; // URL or file path
    importId?: string;
    originalId?: string;
  };

  // Visual positioning (for graph view)
  position?: {
    x: number;
    y: number;
  };

  // Back face metadata (shown on flip)
  backFace?: {
    notes?: string;
    metadata?: Record<string, any>;
    relatedBlocks?: BlockId[];
  };
}

// ============================================================================
// Template System Types
// ============================================================================

/**
 * Template definition - defines the structure and behavior of blocks
 */
export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  category: string; // e.g., 'document', 'view', 'dashboard'

  // Structure
  requiredFields: FieldDefinition[];
  optionalFields: FieldDefinition[];

  // Relationships
  allowedRelations: {
    outgoing: RelationType[];
    incoming: RelationType[];
  };

  // Behavior
  defaultTags?: TagId[];
  inheritTags: boolean;

  // Visual
  icon?: string;
  color?: string;
  defaultView?: 'content' | 'card' | 'compact';

  // Validation
  validators?: ValidatorFunction[];
}

export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export type ValidatorFunction = (block: Block) => ValidationResult;

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

// ============================================================================
// Relationship System Types
// ============================================================================

/**
 * Structural relationships - used for document assembly
 */
export enum StructuralRelation {
  PARENT_OF = 'PARENT_OF',
  CONTAINS_ORDERED = 'CONTAINS_ORDERED',
  SECTION_OF = 'SECTION_OF',
  THREAD_OF = 'THREAD_OF',
  ATTACHED_TO = 'ATTACHED_TO',
}

/**
 * Semantic relationships - used for knowledge graph
 */
export enum SemanticRelation {
  IMPLEMENTS = 'IMPLEMENTS',
  VERIFIED_BY = 'VERIFIED_BY',
  DEPENDS_ON = 'DEPENDS_ON',
  REFERENCES = 'REFERENCES',
  LINKS = 'LINKS',
  CONTRADICTS = 'CONTRADICTS',
  ELABORATES = 'ELABORATES',
}

export type RelationType = StructuralRelation | SemanticRelation;

/**
 * Edge definition - connects two blocks
 */
export interface Edge {
  id: EdgeId;
  fromBlockId: BlockId;
  toBlockId: BlockId;
  relationType: RelationType;

  // Metadata
  label?: string;
  weight?: number;
  order?: number; // For ordered relationships

  // Audit
  createdBy: string;
  createdAt: Date;

  // Visual
  style?: 'solid' | 'dashed' | 'dotted' | 'animated';
  color?: string;
}

// ============================================================================
// Tag System Types
// ============================================================================

/**
 * Tag definition with inheritance and grouping
 */
export interface Tag {
  id: TagId;
  label: string;
  group: TagGroup;

  // Behavior
  inheritable: boolean;
  system: boolean; // System-defined vs user-defined

  // Visual
  color: string;
  icon?: string;

  // Metadata
  description?: string;
  aliases?: string[];
}

/**
 * Tag groups for organization
 */
export enum TagGroup {
  ORGANIZATIONAL = 'organizational', // Project, client, team
  DOMAIN = 'domain', // Technical domains
  STATUS = 'status', // Draft, review, approved
  PRIORITY = 'priority', // Low, medium, high, critical
  TYPE = 'type', // Bug, feature, documentation
  CUSTOM = 'custom', // User-defined
}

// ============================================================================
// View and Dashboard Types
// ============================================================================

/**
 * System-defined view configurations
 */
export interface View {
  id: string;
  name: string;
  type: 'graph' | 'document' | 'brainstorm' | 'folder' | 'timeline';

  // Configuration
  config: {
    traversalDepth?: number;
    relationFilter?: RelationType[];
    tagFilter?: TagId[];
    blockTypeFilter?: BlockType[];
    showMetadata?: boolean;
    layoutAlgorithm?: 'force' | 'hierarchical' | 'circular' | 'grid';
  };

  // State
  isActive: boolean;
  position?: { x: number; y: number; zoom: number };
}

/**
 * User-composed dashboard from blocks
 */
export interface Dashboard {
  id: string;
  name: string;
  description?: string;

  // Composition
  widgets: DashboardWidget[];
  layout: 'grid' | 'freeform' | 'responsive';

  // Filters
  globalFilters?: FilterConfig[];

  // Persistence
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'block-list' | 'graph-view' | 'stats' | 'calendar' | 'custom';
  position: { x: number; y: number; w: number; h: number };

  config: {
    title?: string;
    blockFilter?: FilterConfig;
    viewConfig?: Partial<View>;
    customComponent?: string;
  };
}

export interface FilterConfig {
  field: 'tags' | 'type' | 'state' | 'immutability' | 'custom';
  operator: 'equals' | 'contains' | 'not' | 'in' | 'notIn';
  value: any;
  combineWith?: 'AND' | 'OR';
}

// ============================================================================
// Document Assembly Types
// ============================================================================

/**
 * Configuration for assembling a document from blocks
 */
export interface AssemblyConfig {
  rootBlockId: BlockId;
  traversalProfile: TraversalProfile;

  // Output
  format: 'markdown' | 'html' | 'pdf' | 'json';
  includeMetadata: boolean;
  includeToc: boolean;

  // Filtering
  maxDepth?: number;
  relationWhitelist?: RelationType[];
  tagFilter?: TagId[];
}

export interface TraversalProfile {
  name: string;
  strategy: 'depth-first' | 'breadth-first';
  followRelations: RelationType[];
  maxDepth: number;
  includeSiblings: boolean;
  respectOrder: boolean;
}

// ============================================================================
// LLM Integration Types
// ============================================================================

/**
 * Configuration for LLM-powered ingestion
 */
export interface IngestionConfig {
  source: string | File;
  template?: TemplateId;

  // Chunking
  chunkingStrategy: 'semantic' | 'structural' | 'hybrid';
  targetChunkSize?: number;

  // Analysis
  extractTags: boolean;
  inferRelationships: boolean;
  generateSummary: boolean;

  // Review
  requireApproval: boolean;
  confidenceThreshold?: number;
}

export interface IngestionPlan {
  id: string;
  source: string;

  // Proposed structure
  manifest: Block;
  blocks: Block[];
  edges: Edge[];
  suggestedTags: Tag[];

  // Metadata
  confidence: number;
  reasoning: string[];
  warnings?: string[];

  // Status
  status: 'pending' | 'approved' | 'rejected' | 'partial';
  reviewedBy?: string;
  reviewedAt?: Date;
}

// ============================================================================
// Performance and Analytics Types
// ============================================================================

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  nodeCount: number;
  edgeCount: number;
  visibleNodes: number;
  visibleEdges: number;
  memoryUsage: number;
}

export interface UserAction {
  id: string;
  type: string;
  target?: BlockId | EdgeId;
  payload?: any;
  timestamp: Date;
  userId: string;
  sessionId: string;
}

// ============================================================================
// Export convenience types
// ============================================================================

export type BlockMap = Map<BlockId, Block>;
export type EdgeMap = Map<EdgeId, Edge>;
export type TemplateMap = Map<TemplateId, Template>;
export type TagMap = Map<TagId, Tag>;

// ============================================================================
// Authority Chain Types
// Cross-Reference: VISION.md Section I, Principle 4
// WHY: Immutability without authority levels is binary. With authority levels,
// we can express "immutable to junior agents but modifiable by senior architects."
// ============================================================================

/**
 * Authority levels in the system hierarchy
 *
 * The hierarchy enables graduated access control:
 * - SYSTEM: Reserved for system-defined constraints that even principals cannot override
 * - PRINCIPAL: Strategic decisions, architectural principles, legal requirements
 * - SENIOR: Reviewed and approved content, design decisions
 * - CONTRIBUTOR: Standard content creation and editing
 * - AGENT: AI agents operating autonomously
 * - VIEWER: Read-only access, no modification rights
 *
 * See: VISION.md#type-extensions-for-authority-chain
 */
export enum AuthorityLevel {
  SYSTEM = 'system',
  PRINCIPAL = 'principal',
  SENIOR = 'senior',
  CONTRIBUTOR = 'contributor',
  AGENT = 'agent',
  VIEWER = 'viewer',
}

/**
 * Extended authority tracking for blocks
 *
 * WHY: The base ImmutabilityLevel tells us IF content is protected.
 * BlockAuthority tells us WHO protected it, WHEN, WHY, and WHO can change it.
 * This enables the Chain of Authority described in VISION.md Section I.
 */
export interface BlockAuthority {
  immutability: ImmutabilityLevel;
  authorityLevel: AuthorityLevel;      // Required authority to modify
  markedBy: string;                     // Who set the immutability
  markedAt: Date;                       // When immutability was set
  justification?: string;               // Why this is immutable (required for IMMUTABLE level)
}

// ============================================================================
// Agent Escalation Types
// Cross-Reference: VISION.md Section II.C - Agent Escalation Protocol
// WHY: Agents will encounter situations where their tasking conflicts with
// immutable requirements. The escalation protocol provides structured handling.
// ============================================================================

/**
 * Error classification for escalation rubric
 *
 * Applied in order during escalation review:
 * 1. execution - Agent misunderstood or misapplied the task
 * 2. tooling - Wrong tool/method selected for the task
 * 3. design - Implementation approach is flawed
 * 4. constraint - Requirements are valid but overly restrictive
 * 5. requirement - Core requirements are fundamentally wrong
 *
 * See: VISION.md - Formal Evaluation Rubric
 */
export type EscalationErrorType =
  | 'execution'
  | 'tooling'
  | 'design'
  | 'constraint'
  | 'requirement';

/**
 * Escalation event status lifecycle
 */
export type EscalationStatus =
  | 'pending'           // Awaiting review
  | 'reviewed'          // Reviewed by higher-level agent
  | 'resolved'          // Resolution applied
  | 'escalated_to_human'; // Requires human intervention

/**
 * Escalation event when an agent encounters immutable constraint conflict
 *
 * WHY: Silent failures hide problems; complete halts block progress.
 * Escalation events provide a structured middle path that surfaces conflicts
 * while allowing work to continue where possible.
 *
 * See: VISION.md#c-agent-escalation-protocol
 */
export interface EscalationEvent {
  id: string;
  timestamp: Date;

  // Context - what was the agent trying to do?
  agentId: string;
  agentAuthorityLevel: AuthorityLevel;
  taskDescription: string;
  conflictingBlockId: BlockId;

  // Conflict details - what went wrong?
  expectedBehavior: string;
  actualConstraint: string;
  proposedResolution?: string;

  // Evaluation - how was it classified? (filled during review)
  errorType?: EscalationErrorType;
  evaluatedBy?: string;
  evaluatedAt?: Date;
  evaluationNotes?: string;

  // Resolution - what was decided?
  status: EscalationStatus;
  resolution?: string;
  resultingChanges?: BlockId[];  // Blocks modified as a result
}

// ============================================================================
// Immutable Change Review Types
// Cross-Reference: VISION.md Section II.D - Immutable Change Review Protocol
// WHY: Immutable content must sometimes change, but those changes must be
// deliberate, reviewed, and audited.
// ============================================================================

/**
 * Recommendation from agentic review
 */
export type ReviewRecommendation = 'approve' | 'reject' | 'escalate_to_human';

/**
 * Agentic review session for immutable change proposals
 *
 * WHY: When an agent proposes changing immutable content, a multi-perspective
 * review catches blind spots. The advocate/critic/neutral structure ensures
 * balanced evaluation.
 *
 * See: VISION.md#d-immutable-change-review-protocol
 */
export interface AgenticReview {
  id: string;
  triggeredBy: string;  // Agent or user who proposed the change
  triggeredAt: Date;

  // What's being changed?
  proposedChange: {
    blockId: BlockId;
    currentContent: string;
    proposedContent: string;
    justification: string;
  };

  // Review perspectives - the "agentic chat"
  advocateArguments: string[];   // Arguments FOR the change
  criticArguments: string[];     // Arguments AGAINST the change
  neutralAssessment: string;     // Balanced evaluation

  // Outcome
  recommendation: ReviewRecommendation;
  confidence: number;            // 0-1 confidence in recommendation
  riskAssessment?: string;       // What could go wrong if approved

  // Audit
  reviewedAt: Date;
  transcript: string;            // Full review conversation

  // Final decision (may differ from recommendation if human overrides)
  finalDecision?: ReviewRecommendation;
  decidedBy?: string;
  decidedAt?: Date;
}

// ============================================================================
// Conflict Detection Types
// Cross-Reference: VISION.md Section II.A - Automated Review & Inconsistency Detection
// WHY: Proactive detection catches problems before they compound.
// ============================================================================

/**
 * Types of detected inconsistencies
 */
export type ConflictType =
  | 'contradiction'  // Blocks with conflicting statements
  | 'redundancy'     // Semantically similar blocks that should merge
  | 'orphan'         // Blocks with no relationships
  | 'stale';         // Blocks not updated within staleness threshold

/**
 * Criticality levels for detected conflicts
 */
export type ConflictCriticality = 'critical' | 'high' | 'medium' | 'low';

/**
 * Conflict resolution status
 */
export type ConflictStatus =
  | 'unresolved'
  | 'in_review'
  | 'resolved'
  | 'dismissed';  // Determined to be false positive

/**
 * Detected inconsistency in the knowledge base
 *
 * WHY: Growing knowledge bases accumulate inconsistencies. This type enables
 * the system to track, prioritize, and resolve conflicts systematically.
 *
 * See: VISION.md#a-automated-review--inconsistency-detection
 */
export interface ConflictRecord {
  id: string;
  type: ConflictType;

  // Involved blocks
  blockIds: BlockId[];
  relationshipContext?: EdgeId[];  // Relationships that reveal the conflict

  // Detection
  detectedAt: Date;
  detectedBy: 'automated_review' | 'agent' | 'human';
  detectionReason: string;         // Why this was flagged

  // Classification
  criticality: ConflictCriticality;

  // Resolution
  status: ConflictStatus;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;

  // If dismissed, why?
  dismissalReason?: string;
}

// ============================================================================
// Enhanced Audit Types
// Cross-Reference: VISION.md Section I, Principle 6
// WHY: Knowledge systems operated by AI agents require comprehensive logging.
// ============================================================================

/**
 * Extended user action types for comprehensive audit trail
 */
export type AuditActionType =
  // Block operations
  | 'block.create'
  | 'block.update'
  | 'block.delete'
  | 'block.restore'
  // Immutability operations
  | 'immutability.set'
  | 'immutability.elevate'    // Mutable → Locked → Immutable
  | 'immutability.demote'     // Reverse direction (requires higher authority)
  // Authority operations
  | 'authority.grant'
  | 'authority.revoke'
  // Agent operations
  | 'agent.escalate'
  | 'agent.review.start'
  | 'agent.review.complete'
  // Conflict operations
  | 'conflict.detect'
  | 'conflict.resolve'
  | 'conflict.dismiss';

/**
 * Enhanced audit entry with full context
 */
export interface AuditEntry {
  id: string;
  action: AuditActionType;
  timestamp: Date;

  // Who
  actorId: string;
  actorType: 'human' | 'agent' | 'system';
  actorAuthorityLevel: AuthorityLevel;

  // What
  targetType: 'block' | 'edge' | 'tag' | 'escalation' | 'conflict';
  targetId: string;

  // Context
  previousState?: any;
  newState?: any;
  justification?: string;

  // Session tracking
  sessionId: string;
  correlationId?: string;  // Groups related actions
}

// ============================================================================
// Convenience type exports
// ============================================================================

export type EscalationEventMap = Map<string, EscalationEvent>;
export type ConflictRecordMap = Map<string, ConflictRecord>;
export type AgenticReviewMap = Map<string, AgenticReview>;
export type AuditEntryList = AuditEntry[];
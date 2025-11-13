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
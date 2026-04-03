/**
 * Block Store - Zustand store for managing blocks, edges, and tags
 *
 * This is the central state management for the knowledge graph system.
 * It handles all CRUD operations and maintains relationships.
 *
 * Authority Chain Enforcement (Contract C002):
 * - validateWrite() enforces INV-C002-03: principal.clearance >= chunk.authority
 * - Blocked writes trigger escalation events per INV-C002-05
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { announceToScreenReader } from '@/components/AriaLiveRegion';
import {
  Block,
  Edge,
  Tag,
  BlockId,
  EdgeId,
  TagId,
  BlockType,
  ImmutabilityLevel,
  AuthorityLevel,
  AgentTier,
  BlockState,
  RelationType,
  StructuralRelation,
  SemanticRelation,
  TagGroup,
  EscalationEvent,
  EscalationStatus,
  AgentIdentity,
} from '@/types';

// ============================================================================
// Authority Chain Enforcement (Contract C002)
// ============================================================================

/**
 * Maps ImmutabilityLevel to required AuthorityLevel for modification.
 * Per C002 Section 3.3, the three tiers map as:
 * - MUTABLE: Anyone with VIEWER clearance or higher may modify
 * - LOCKED: CONTRIBUTOR or higher required
 * - IMMUTABLE: SENIOR or higher required
 */
const IMMUTABILITY_TO_AUTHORITY: Record<ImmutabilityLevel, AuthorityLevel> = {
  [ImmutabilityLevel.MUTABLE]: AuthorityLevel.VIEWER,
  [ImmutabilityLevel.LOCKED]: AuthorityLevel.CONTRIBUTOR,
  [ImmutabilityLevel.IMMUTABLE]: AuthorityLevel.SENIOR,
};

/**
 * Authority level numeric values for comparison.
 * Higher number = more authority.
 */
const AUTHORITY_RANK: Record<AuthorityLevel, number> = {
  [AuthorityLevel.VIEWER]: 0,
  [AuthorityLevel.AGENT]: 1,
  [AuthorityLevel.CONTRIBUTOR]: 2,
  [AuthorityLevel.SENIOR]: 3,
  [AuthorityLevel.PRINCIPAL]: 4,
  [AuthorityLevel.SYSTEM]: 5,
};

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  escalationRequired?: boolean;
  blockedBy?: BlockId;
}

/**
 * Get the numeric clearance rank for an authority level.
 */
function getClearanceRank(authorityLevel: AuthorityLevel): number {
  return AUTHORITY_RANK[authorityLevel] ?? 0;
}

/**
 * Validate whether a principal may write to a block.
 * Implements INV-C002-03: principal.clearance >= chunk.authority
 *
 * @param principal - The actor attempting the write (user or agent)
 * @param block - The block being modified
 * @param newContent - (Optional) The proposed new content
 * @returns ValidationResult with allowed=true if permitted, or allowed=false with escalationRequired=true if blocked
 */
export function validateWrite(
  principal: { clearance: AuthorityLevel } | AgentIdentity,
  block: Block,
  _newContent?: string
): ValidationResult {
  // Determine principal clearance rank
  let principalClearance: AuthorityLevel;
  if ('clearance' in principal && typeof principal.clearance === 'string') {
    principalClearance = principal.clearance as AuthorityLevel;
  } else if ('tier' in principal) {
    principalClearance = getAgentClearanceFromTier(principal);
  } else {
    // Fallback - deny write if we can't determine clearance
    return {
      allowed: false,
      reason: 'Unable to determine principal clearance',
      escalationRequired: true,
      blockedBy: block.id,
    };
  }

  // Get required authority for the block's immutability level
  const requiredAuthority = IMMUTABILITY_TO_AUTHORITY[block.immutability];
  const requiredRank = getClearanceRank(requiredAuthority);
  const principalRank = getClearanceRank(principalClearance);

  // INV-C002-03: principal.clearance >= chunk.authority
  if (principalRank < requiredRank) {
    return {
      allowed: false,
      reason: `Principal clearance (${principalClearance}) is below required authority (${requiredAuthority}) for ${block.immutability} block`,
      escalationRequired: true,
      blockedBy: block.id,
    };
  }

  return { allowed: true };
}

/**
 * Convert AgentTier to clearance authority level.
 * Per C002 Section 6.1: Drone=0, Architect=1, Judge=3
 */
function getAgentClearanceFromTier(agent: AgentIdentity): AuthorityLevel {
  switch (agent.tier) {
    case AgentTier.DRONE:
      return AuthorityLevel.VIEWER;    // Tier 1 = clearance 0
    case AgentTier.ARCHITECT:
      return AuthorityLevel.CONTRIBUTOR; // Tier 2 = clearance 1
    case AgentTier.JUDGE:
      return AuthorityLevel.SENIOR;    // Tier 3 = clearance 3
    default:
      return AuthorityLevel.VIEWER;
  }
}

interface BlockStore {
  // Data
  blocks: Map<BlockId, Block>;
  edges: Map<EdgeId, Edge>;
  tags: Map<TagId, Tag>;

  // Authority Chain State
  escalationEvents: Map<string, EscalationEvent>;
  currentPrincipal: { clearance: AuthorityLevel } | AgentIdentity | null;

  // Selection and UI State
  selectedBlockId: BlockId | null;
  selectedEdgeId: BlockId | null;
  viewMode: 'graph' | 'document' | 'brainstorm' | 'folder';
  isLoading: boolean;

  // Performance
  visibleBlockIds: Set<BlockId>;
  visibleEdgeIds: Set<EdgeId>;

  // Authority Chain Actions
  setCurrentPrincipal: (principal: { clearance: AuthorityLevel } | AgentIdentity | null) => void;
  dispatchEscalation: (event: Omit<EscalationEvent, 'id' | 'timestamp' | 'status'>) => EscalationEvent;
  getEscalationsForBlock: (blockId: BlockId) => EscalationEvent[];

  // Actions - Blocks
  createBlock: (params: Partial<Block>) => Block;
  updateBlock: (block: Block, principal?: { clearance: AuthorityLevel } | AgentIdentity) => { success: boolean; reason?: string };
  deleteBlock: (blockId: BlockId, principal?: { clearance: AuthorityLevel } | AgentIdentity) => { success: boolean; reason?: string };
  duplicateBlock: (blockId: BlockId) => Block | null;
  setBlockImmutability: (blockId: BlockId, level: ImmutabilityLevel) => void;

  // Actions - Edges
  createEdge: (from: BlockId, to: BlockId, type: RelationType) => Edge;
  updateEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: EdgeId) => void;
  getBlockEdges: (blockId: BlockId) => { incoming: Edge[]; outgoing: Edge[] };

  // Actions - Tags
  createTag: (params: Partial<Tag>) => Tag;
  updateTag: (tag: Tag) => void;
  deleteTag: (tagId: TagId) => void;
  addTagToBlock: (blockId: BlockId, tagId: TagId) => void;
  removeTagFromBlock: (blockId: BlockId, tagId: TagId) => void;
  getInheritedTags: (blockId: BlockId) => TagId[];

  // Actions - Selection
  selectBlock: (blockId: BlockId | null) => void;
  selectEdge: (edgeId: EdgeId | null) => void;

  // Actions - View
  setViewMode: (mode: 'graph' | 'document' | 'brainstorm' | 'folder') => void;
  updateVisibleNodes: (blockIds: BlockId[], edgeIds: EdgeId[]) => void;

  // Actions - Traversal
  getChildren: (blockId: BlockId) => Block[];
  getParent: (blockId: BlockId) => Block | null;
  getDescendants: (blockId: BlockId, maxDepth?: number) => Block[];
  getSiblings: (blockId: BlockId) => Block[];

  // Actions - Export/Import
  exportData: () => string;
  importData: (jsonData: string) => void;
  clearAll: () => void;
}

export const useBlockStore = create<BlockStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        blocks: new Map(),
        edges: new Map(),
        tags: new Map(),
        escalationEvents: new Map(),
        currentPrincipal: null,
        selectedBlockId: null,
        selectedEdgeId: null,
        viewMode: 'graph',
        isLoading: false,
        visibleBlockIds: new Set(),
        visibleEdgeIds: new Set(),

        // Authority Chain Actions
        setCurrentPrincipal: (principal) => {
          set((state) => {
            state.currentPrincipal = principal;
          });
        },

        dispatchEscalation: (eventData) => {
          const event: EscalationEvent = {
            ...eventData,
            id: nanoid(),
            timestamp: new Date(),
            status: 'pending',
          };

          set((state) => {
            state.escalationEvents.set(event.id, event);
          });

          // Log to console for audit trail (in production, this would go to a proper audit system)
          console.warn('[ESCALATION]', {
            eventId: event.id,
            agentId: event.agentId,
            blockId: event.conflictingBlockId,
            reason: event.actualConstraint,
          });

          return event;
        },

        getEscalationsForBlock: (blockId) => {
          const events = Array.from(get().escalationEvents.values());
          return events.filter((e) => e.conflictingBlockId === blockId);
        },

        // Block Actions
        createBlock: (params) => {
          const block: Block = {
            id: params.id || nanoid(),
            type: params.type || BlockType.NOTE,
            templateId: params.templateId || 'default',
            title: params.title || 'Untitled Block',
            content: params.content || '',
            fields: params.fields || {},
            tags: params.tags || [],
            state: params.state || BlockState.DRAFT,
            immutability: params.immutability || ImmutabilityLevel.MUTABLE,
            createdBy: params.createdBy || 'user',
            createdAt: params.createdAt || new Date(),
            updatedBy: params.updatedBy || 'user',
            updatedAt: params.updatedAt || new Date(),
            version: params.version || 1,
            position: params.position,
            provenance: params.provenance,
            backFace: params.backFace,
          };

          set((state) => {
            state.blocks.set(block.id, block);
          });

          if (typeof window !== 'undefined') {
            announceToScreenReader(`Created block: ${block.title}`);
          }

          return block;
        },

        updateBlock: (block, principal) => {
          const effectivePrincipal = principal || get().currentPrincipal;
          if (!effectivePrincipal) {
            // No principal set - fail safe, deny the write
            console.error('[AUTHORITY] updateBlock denied: no principal set');
            return { success: false, reason: 'No principal set' };
          }

          const existing = get().blocks.get(block.id);
          if (!existing) {
            return { success: false, reason: 'Block not found' };
          }

          // Pre-write validation per INV-C002-03
          const validation = validateWrite(effectivePrincipal, existing);
          if (!validation.allowed) {
            // INV-C002-05: Blocked operations trigger escalation
            if (validation.escalationRequired && validation.blockedBy) {
              get().dispatchEscalation({
                agentId: 'id' in effectivePrincipal ? effectivePrincipal.id : 'unknown',
                agentTier: 'tier' in effectivePrincipal ? effectivePrincipal.tier : AgentTier.DRONE,
                taskDescription: `Attempted updateBlock on block ${block.id}`,
                conflictingBlockId: validation.blockedBy,
                expectedBehavior: 'Principal should be able to modify this block',
                actualConstraint: validation.reason || 'Insufficient clearance',
              });
            }
            return { success: false, reason: validation.reason };
          }

          set((state) => {
            if (existing.immutability !== ImmutabilityLevel.IMMUTABLE) {
              block.updatedAt = new Date();
              block.version = existing.version + 1;
              state.blocks.set(block.id, block);
            }
          });

          return { success: true };
        },

        deleteBlock: (blockId, principal) => {
          const effectivePrincipal = principal || get().currentPrincipal;
          if (!effectivePrincipal) {
            console.error('[AUTHORITY] deleteBlock denied: no principal set');
            return { success: false, reason: 'No principal set' };
          }

          const block = get().blocks.get(blockId);
          if (!block) {
            return { success: false, reason: 'Block not found' };
          }

          // Pre-write validation per INV-C002-03
          const validation = validateWrite(effectivePrincipal, block);
          if (!validation.allowed) {
            if (validation.escalationRequired && validation.blockedBy) {
              get().dispatchEscalation({
                agentId: 'id' in effectivePrincipal ? effectivePrincipal.id : 'unknown',
                agentTier: 'tier' in effectivePrincipal ? effectivePrincipal.tier : AgentTier.DRONE,
                taskDescription: `Attempted deleteBlock on block ${blockId}`,
                conflictingBlockId: validation.blockedBy,
                expectedBehavior: 'Principal should be able to delete this block',
                actualConstraint: validation.reason || 'Insufficient clearance',
              });
            }
            return { success: false, reason: validation.reason };
          }

          set((state) => {
            if (block.immutability === ImmutabilityLevel.MUTABLE) {
              // Delete block
              state.blocks.delete(blockId);

              // Delete associated edges
              state.edges.forEach((edge, edgeId) => {
                if (edge.fromBlockId === blockId || edge.toBlockId === blockId) {
                  state.edges.delete(edgeId);
                }
              });

              if (typeof window !== 'undefined') {
                announceToScreenReader(`Deleted block: ${block.title}`);
              }
            }
          });

          return { success: true };
        },

        duplicateBlock: (blockId) => {
          const original = get().blocks.get(blockId);
          if (!original) return null;

          const duplicate = get().createBlock({
            ...original,
            id: nanoid(),
            title: `${original.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
          });

          return duplicate;
        },

        setBlockImmutability: (blockId, level) => {
          set((state) => {
            const block = state.blocks.get(blockId);
            if (block) {
              block.immutability = level;
              block.updatedAt = new Date();
            }
          });
        },

        // Edge Actions
        createEdge: (from, to, type) => {
          const edge: Edge = {
            id: nanoid(),
            fromBlockId: from,
            toBlockId: to,
            relationType: type,
            createdBy: 'user',
            createdAt: new Date(),
          };

          set((state) => {
            state.edges.set(edge.id, edge);
          });

          return edge;
        },

        updateEdge: (edge) => {
          set((state) => {
            state.edges.set(edge.id, edge);
          });
        },

        deleteEdge: (edgeId) => {
          set((state) => {
            state.edges.delete(edgeId);
          });
        },

        getBlockEdges: (blockId) => {
          const edges = Array.from(get().edges.values());
          return {
            incoming: edges.filter((e) => e.toBlockId === blockId),
            outgoing: edges.filter((e) => e.fromBlockId === blockId),
          };
        },

        // Tag Actions
        createTag: (params) => {
          const tag: Tag = {
            id: params.id || nanoid(),
            label: params.label || 'New Tag',
            group: params.group || TagGroup.CUSTOM,
            inheritable: params.inheritable !== undefined ? params.inheritable : false,
            system: params.system || false,
            color: params.color || '#3B82F6',
            icon: params.icon,
            description: params.description,
            aliases: params.aliases,
          };

          set((state) => {
            state.tags.set(tag.id, tag);
          });

          return tag;
        },

        updateTag: (tag) => {
          set((state) => {
            state.tags.set(tag.id, tag);
          });
        },

        deleteTag: (tagId) => {
          set((state) => {
            // Remove tag from all blocks
            state.blocks.forEach((block) => {
              block.tags = block.tags.filter((t) => t !== tagId);
            });
            // Delete tag
            state.tags.delete(tagId);
          });
        },

        addTagToBlock: (blockId, tagId) => {
          set((state) => {
            const block = state.blocks.get(blockId);
            if (block && !block.tags.includes(tagId)) {
              block.tags.push(tagId);
              block.updatedAt = new Date();
            }
          });
        },

        removeTagFromBlock: (blockId, tagId) => {
          set((state) => {
            const block = state.blocks.get(blockId);
            if (block) {
              block.tags = block.tags.filter((t) => t !== tagId);
              block.updatedAt = new Date();
            }
          });
        },

        getInheritedTags: (blockId) => {
          const inheritedTags: TagId[] = [];
          const visited = new Set<BlockId>();

          const collectInheritedTags = (currentId: BlockId) => {
            if (visited.has(currentId)) return;
            visited.add(currentId);

            const parent = get().getParent(currentId);
            if (parent) {
              const parentTags = parent.tags.filter((tagId) => {
                const tag = get().tags.get(tagId);
                return tag && tag.inheritable;
              });
              inheritedTags.push(...parentTags);
              collectInheritedTags(parent.id);
            }
          };

          collectInheritedTags(blockId);
          return [...new Set(inheritedTags)]; // Remove duplicates
        },

        // Selection Actions
        selectBlock: (blockId) => {
          set((state) => {
            state.selectedBlockId = blockId;
            state.selectedEdgeId = null;
          });
          if (blockId && typeof window !== 'undefined') {
            const block = get().blocks.get(blockId);
            if (block) {
              announceToScreenReader(`Selected block: ${block.title}`);
            }
          }
        },

        selectEdge: (edgeId) => {
          set((state) => {
            state.selectedEdgeId = edgeId;
            state.selectedBlockId = null;
          });
        },

        // View Actions
        setViewMode: (mode) => {
          set((state) => {
            state.viewMode = mode;
          });
        },

        updateVisibleNodes: (blockIds, edgeIds) => {
          set((state) => {
            state.visibleBlockIds = new Set(blockIds);
            state.visibleEdgeIds = new Set(edgeIds);
          });
        },

        // Traversal Actions
        getChildren: (blockId) => {
          const edges = Array.from(get().edges.values());
          const childEdges = edges.filter(
            (e) =>
              e.fromBlockId === blockId &&
              (e.relationType === StructuralRelation.PARENT_OF ||
                e.relationType === StructuralRelation.CONTAINS_ORDERED)
          );

          return childEdges
            .map((e) => get().blocks.get(e.toBlockId))
            .filter((b): b is Block => b !== undefined)
            .sort((a, b) => {
              const edgeA = childEdges.find((e) => e.toBlockId === a.id);
              const edgeB = childEdges.find((e) => e.toBlockId === b.id);
              return (edgeA?.order || 0) - (edgeB?.order || 0);
            });
        },

        getParent: (blockId) => {
          const edges = Array.from(get().edges.values());
          const parentEdge = edges.find(
            (e) =>
              e.toBlockId === blockId &&
              (e.relationType === StructuralRelation.PARENT_OF ||
                e.relationType === StructuralRelation.CONTAINS_ORDERED)
          );

          return parentEdge ? get().blocks.get(parentEdge.fromBlockId) || null : null;
        },

        getDescendants: (blockId, maxDepth = Infinity) => {
          const descendants: Block[] = [];
          const visited = new Set<BlockId>();

          const traverse = (currentId: BlockId, depth: number) => {
            if (depth >= maxDepth || visited.has(currentId)) return;
            visited.add(currentId);

            const children = get().getChildren(currentId);
            descendants.push(...children);

            children.forEach((child) => {
              traverse(child.id, depth + 1);
            });
          };

          traverse(blockId, 0);
          return descendants;
        },

        getSiblings: (blockId) => {
          const parent = get().getParent(blockId);
          if (!parent) return [];

          return get()
            .getChildren(parent.id)
            .filter((b) => b.id !== blockId);
        },

        // Export/Import Actions
        exportData: () => {
          const data = {
            version: '1.0.0',
            blocks: Array.from(get().blocks.values()),
            edges: Array.from(get().edges.values()),
            tags: Array.from(get().tags.values()),
            timestamp: new Date().toISOString(),
          };
          return JSON.stringify(data, null, 2);
        },

        importData: (jsonData) => {
          try {
            const data = JSON.parse(jsonData);

            set((state) => {
              // Clear existing data
              state.blocks.clear();
              state.edges.clear();
              state.tags.clear();

              // Import new data
              data.blocks?.forEach((block: Block) => {
                state.blocks.set(block.id, block);
              });
              data.edges?.forEach((edge: Edge) => {
                state.edges.set(edge.id, edge);
              });
              data.tags?.forEach((tag: Tag) => {
                state.tags.set(tag.id, tag);
              });
            });
          } catch (error) {
            console.error('Failed to import data:', error);
          }
        },

        clearAll: () => {
          set((state) => {
            state.blocks.clear();
            state.edges.clear();
            state.tags.clear();
            state.selectedBlockId = null;
            state.selectedEdgeId = null;
          });
        },
      })),
      {
        name: 'knowledge-graph-storage',
        // Custom serialization for Maps
        serialize: (state) =>
          JSON.stringify({
            ...state,
            blocks: Array.from(state.blocks?.entries() || []),
            edges: Array.from(state.edges?.entries() || []),
            tags: Array.from(state.tags?.entries() || []),
            escalationEvents: Array.from(state.escalationEvents?.entries() || []),
            visibleBlockIds: Array.from(state.visibleBlockIds || []),
            visibleEdgeIds: Array.from(state.visibleEdgeIds || []),
          }),
        deserialize: (str) => {
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            blocks: new Map(parsed.blocks || []),
            edges: new Map(parsed.edges || []),
            tags: new Map(parsed.tags || []),
            escalationEvents: new Map(parsed.escalationEvents || []),
            visibleBlockIds: new Set(parsed.visibleBlockIds || []),
            visibleEdgeIds: new Set(parsed.visibleEdgeIds || []),
          };
        },
      }
    )
  )
);
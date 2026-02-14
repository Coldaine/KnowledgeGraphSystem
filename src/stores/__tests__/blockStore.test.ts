/**
 * Tests for blockStore - Zustand state management
 */

import { renderHook, act } from '@testing-library/react';
import { useBlockStore } from '../blockStore';
import { BlockType, ImmutabilityLevel, BlockState, StructuralRelation, SemanticRelation, TagGroup } from '@/types';
import { resetNanoid } from 'nanoid';

describe('blockStore', () => {
  beforeEach(() => {
    // Reset nanoid counter and clear store for test isolation
    resetNanoid();
    const { result } = renderHook(() => useBlockStore());
    act(() => {
      result.current.clearAll();
    });
  });

  describe('Block CRUD Operations', () => {
    it('should create a block with default values', () => {
      const { result } = renderHook(() => useBlockStore());

      let createdBlock;
      act(() => {
        createdBlock = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Test Note',
          content: 'Test content',
        });
      });

      expect(createdBlock).toBeDefined();
      expect(createdBlock.title).toBe('Test Note');
      expect(createdBlock.content).toBe('Test content');
      expect(createdBlock.type).toBe(BlockType.NOTE);
      expect(createdBlock.state).toBe(BlockState.DRAFT); // Default state is DRAFT
      expect(createdBlock.immutability).toBe(ImmutabilityLevel.MUTABLE);
      expect(result.current.blocks.size).toBe(1);
    });

    it('should create a block with custom immutability', () => {
      const { result } = renderHook(() => useBlockStore());

      let createdBlock;
      act(() => {
        createdBlock = result.current.createBlock({
          type: BlockType.REQUIREMENT,
          title: 'Important Requirement',
          content: 'Must not change',
          immutability: ImmutabilityLevel.IMMUTABLE,
        });
      });

      expect(createdBlock.immutability).toBe(ImmutabilityLevel.IMMUTABLE);
    });

    it('should update a block', () => {
      const { result } = renderHook(() => useBlockStore());

      let block;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Original Title',
          content: 'Original content',
        });
      });

      act(() => {
        result.current.updateBlock({
          ...block,
          title: 'Updated Title',
          content: 'Updated content',
        });
      });

      const updated = result.current.blocks.get(block.id);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.content).toBe('Updated content');
      expect(updated?.version).toBe(block.version + 1);
    });

    it('should delete a block', () => {
      const { result } = renderHook(() => useBlockStore());

      let block;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'To Delete',
          content: 'Will be deleted',
        });
      });

      expect(result.current.blocks.size).toBe(1);

      act(() => {
        result.current.deleteBlock(block.id);
      });

      expect(result.current.blocks.size).toBe(0);
    });

    it('should duplicate a block', () => {
      const { result } = renderHook(() => useBlockStore());

      let original;
      act(() => {
        original = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Original',
          content: 'Original content',
        });
      });

      let duplicate;
      act(() => {
        duplicate = result.current.duplicateBlock(original.id);
      });

      expect(duplicate).toBeDefined();
      expect(duplicate?.id).not.toBe(original.id);
      expect(duplicate?.title).toBe('Original (Copy)');
      expect(duplicate?.content).toBe(original.content);
      expect(result.current.blocks.size).toBe(2);
    });

    it('should set block immutability', () => {
      const { result } = renderHook(() => useBlockStore());

      let block;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Test',
          content: 'Content',
        });
      });

      act(() => {
        result.current.setBlockImmutability(block.id, ImmutabilityLevel.LOCKED);
      });

      const updated = result.current.blocks.get(block.id);
      expect(updated?.immutability).toBe(ImmutabilityLevel.LOCKED);
    });
  });

  describe('Edge CRUD Operations', () => {
    it('should create an edge between two blocks', () => {
      const { result } = renderHook(() => useBlockStore());

      let block1, block2, edge;
      act(() => {
        block1 = result.current.createBlock({
          type: BlockType.SPEC,
          title: 'Spec',
          content: 'Specification',
        });
        block2 = result.current.createBlock({
          type: BlockType.IMPLEMENTATION,
          title: 'Implementation',
          content: 'Code',
        });
        edge = result.current.createEdge(block1.id, block2.id, SemanticRelation.IMPLEMENTS);
      });

      expect(edge).toBeDefined();
      expect(edge.fromBlockId).toBe(block1.id);
      expect(edge.toBlockId).toBe(block2.id);
      expect(edge.relationType).toBe(SemanticRelation.IMPLEMENTS);
      expect(result.current.edges.size).toBe(1);
    });

    it('should delete an edge', () => {
      const { result } = renderHook(() => useBlockStore());

      let block1, block2, edge;
      act(() => {
        block1 = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Block 1',
          content: 'Content 1',
        });
        block2 = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Block 2',
          content: 'Content 2',
        });
        edge = result.current.createEdge(block1.id, block2.id, StructuralRelation.PARENT_OF);
      });

      expect(result.current.edges.size).toBe(1);

      act(() => {
        result.current.deleteEdge(edge.id);
      });

      expect(result.current.edges.size).toBe(0);
    });

    it('should delete edges when a block is deleted', () => {
      const { result } = renderHook(() => useBlockStore());

      let block1, block2;
      act(() => {
        block1 = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Block 1',
          content: 'Content 1',
        });
        block2 = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Block 2',
          content: 'Content 2',
        });
        result.current.createEdge(block1.id, block2.id, StructuralRelation.PARENT_OF);
      });

      expect(result.current.edges.size).toBe(1);

      act(() => {
        result.current.deleteBlock(block1.id);
      });

      // Edge should be deleted when block is deleted
      expect(result.current.edges.size).toBe(0);
    });
  });

  describe('Tag Operations', () => {
    it('should create a tag', () => {
      const { result } = renderHook(() => useBlockStore());

      let tag;
      act(() => {
        tag = result.current.createTag({
          label: 'Frontend',
          group: TagGroup.DOMAIN,
          color: '#3B82F6',
        });
      });

      expect(tag).toBeDefined();
      expect(tag.label).toBe('Frontend');
      expect(tag.group).toBe(TagGroup.DOMAIN);
      expect(result.current.tags.size).toBe(1);
    });

    it('should add a tag to a block', () => {
      const { result } = renderHook(() => useBlockStore());

      let block, tag;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Test',
          content: 'Content',
        });
        tag = result.current.createTag({
          label: 'Important',
          group: TagGroup.PRIORITY,
          color: '#EF4444',
        });
        result.current.addTagToBlock(block.id, tag.id);
      });

      const updated = result.current.blocks.get(block.id);
      expect(updated?.tags).toContain(tag.id);
    });

    it('should remove a tag from a block', () => {
      const { result } = renderHook(() => useBlockStore());

      let block, tag;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Test',
          content: 'Content',
        });
        tag = result.current.createTag({
          label: 'Important',
          group: TagGroup.PRIORITY,
          color: '#EF4444',
        });
        result.current.addTagToBlock(block.id, tag.id);
      });

      let updated = result.current.blocks.get(block.id);
      expect(updated?.tags).toContain(tag.id);

      act(() => {
        result.current.removeTagFromBlock(block.id, tag.id);
      });

      updated = result.current.blocks.get(block.id);
      expect(updated?.tags).not.toContain(tag.id);
    });
  });

  describe('Selection State', () => {
    it('should select a block', () => {
      const { result } = renderHook(() => useBlockStore());

      let block;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Test',
          content: 'Content',
        });
        result.current.selectBlock(block.id);
      });

      expect(result.current.selectedBlockId).toBe(block.id);
    });

    it('should deselect when selecting null', () => {
      const { result } = renderHook(() => useBlockStore());

      let block;
      act(() => {
        block = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Test',
          content: 'Content',
        });
        result.current.selectBlock(block.id);
      });

      expect(result.current.selectedBlockId).toBe(block.id);

      act(() => {
        result.current.selectBlock(null);
      });

      expect(result.current.selectedBlockId).toBeNull();
    });
  });

  describe('View Mode', () => {
    it('should change view mode', () => {
      const { result } = renderHook(() => useBlockStore());

      expect(result.current.viewMode).toBe('graph');

      act(() => {
        result.current.setViewMode('document');
      });

      expect(result.current.viewMode).toBe('document');
    });
  });

  describe('Clear All', () => {
    it('should clear all data', () => {
      const { result } = renderHook(() => useBlockStore());

      // First clear to ensure clean state
      act(() => {
        result.current.clearAll();
      });

      // Create test data
      let block1Id, block2Id;
      act(() => {
        const b1 = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Block 1',
          content: 'Content 1',
        });
        const b2 = result.current.createBlock({
          type: BlockType.NOTE,
          title: 'Block 2',
          content: 'Content 2',
        });
        block1Id = b1.id;
        block2Id = b2.id;
        result.current.createEdge(block1Id, block2Id, StructuralRelation.PARENT_OF);
        result.current.createTag({
          label: 'Test',
          group: TagGroup.CUSTOM,
          color: '#000000',
        });
      });

      // Verify data was created
      expect(result.current.blocks.size).toBeGreaterThanOrEqual(2);
      expect(result.current.edges.size).toBeGreaterThanOrEqual(1);
      expect(result.current.tags.size).toBeGreaterThanOrEqual(1);

      // Clear all
      act(() => {
        result.current.clearAll();
      });

      // Verify everything is cleared
      expect(result.current.blocks.size).toBe(0);
      expect(result.current.edges.size).toBe(0);
      expect(result.current.tags.size).toBe(0);
    });
  });
});

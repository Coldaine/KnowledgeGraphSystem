/**
 * Block Component
 *
 * The core atomic unit of the knowledge graph system.
 * Features double-click flip animation to reveal metadata on the back.
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Lock,
  Shield,
  Edit3,
  Trash2,
  Link2,
  Tag as TagIcon,
  ChevronRight
} from 'lucide-react';
import { Block as BlockType, ImmutabilityLevel, BlockType as BType } from '@/types';
import { cn } from '@/lib/utils';
import { useBlockStore } from '@/stores/blockStore';
import { TagBadge } from '../Tag/TagBadge';
import { BlockEditor } from './BlockEditor';

interface BlockProps {
  block: BlockType;
  isSelected?: boolean;
  isDragging?: boolean;
  onDoubleClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  className?: string;
  viewMode?: 'card' | 'compact' | 'minimal';
}

export const Block: React.FC<BlockProps> = ({
  block,
  isSelected = false,
  isDragging = false,
  onDoubleClick,
  onEdit,
  onDelete,
  onSelect,
  className,
  viewMode = 'card',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const { updateBlock, getInheritedTags } = useBlockStore();

  // Get all tags (explicit + inherited)
  const effectiveTags = useMemo(() => {
    const inherited = getInheritedTags(block.id);
    return [
      ...block.tags.map(t => ({ id: t, inherited: false })),
      ...inherited.map(t => ({ id: t, inherited: true })),
    ];
  }, [block, getInheritedTags]);

  // Handle double-click flip
  const handleDoubleClick = useCallback(() => {
    setIsFlipped(!isFlipped);
    onDoubleClick?.();
  }, [isFlipped, onDoubleClick]);

  // Get block type color
  const getTypeColor = useCallback(() => {
    switch (block.type) {
      case BType.NOTE:
        return 'border-l-text-300';
      case BType.REQUIREMENT:
        return 'border-l-warning';
      case BType.SPEC:
        return 'border-l-primary';
      case BType.IMPLEMENTATION:
        return 'border-l-success';
      case BType.TEST:
        return 'border-l-accent';
      default:
        return 'border-l-text-400';
    }
  }, [block.type]);

  // Get immutability indicator
  const getImmutabilityClass = useCallback(() => {
    switch (block.immutability) {
      case ImmutabilityLevel.LOCKED:
        return 'immutable-locked';
      case ImmutabilityLevel.IMMUTABLE:
        return 'immutable-immutable';
      default:
        return '';
    }
  }, [block.immutability]);

  // Render immutability icon
  const ImmutabilityIcon = useCallback(() => {
    if (block.immutability === ImmutabilityLevel.LOCKED) {
      return <Lock className="w-4 h-4 text-warning" />;
    }
    if (block.immutability === ImmutabilityLevel.IMMUTABLE) {
      return <Shield className="w-4 h-4 text-error" />;
    }
    return null;
  }, [block.immutability]);

  // Minimal mode rendering (for document assembly)
  if (viewMode === 'minimal') {
    return (
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: block.content }} />
      </div>
    );
  }

  // Compact mode rendering
  if (viewMode === 'compact') {
    return (
      <div
        className={cn(
          'glass-card p-2 cursor-pointer',
          getTypeColor(),
          isSelected && 'ring-2 ring-primary',
          className
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          <ImmutabilityIcon />
          <span className="text-sm font-medium truncate">{block.title}</span>
          {effectiveTags.length > 0 && (
            <div className="flex gap-1">
              {effectiveTags.slice(0, 2).map(tag => (
                <div
                  key={tag.id}
                  className={cn(
                    'w-2 h-2 rounded-full bg-primary/50',
                    tag.inherited && 'bg-primary/30'
                  )}
                />
              ))}
              {effectiveTags.length > 2 && (
                <span className="text-xs text-text-400">+{effectiveTags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full card rendering with flip animation
  return (
    <div className="block-3d-container w-80" ref={blockRef}>
      <motion.div
        className={cn(
          'block-flipper relative h-48 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg',
          isFlipped && 'flipped',
          isDragging && 'drag-preview'
        )}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => {
          // Ensure click selects the block but doesn't interfere with inner buttons
          if (onSelect && !(e.target as HTMLElement).closest('button')) {
            onSelect();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDoubleClick();
          }
        }}
        tabIndex={0}
        role="article"
        aria-label={`Knowledge block: ${block.title} (${block.type})`}
        whileHover={{ scale: isDragging ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Front Face */}
        <div
          className={cn(
            'block-front glass-card h-full',
            getTypeColor(),
            getImmutabilityClass(),
            isSelected && 'ring-2 ring-primary shadow-glow-md',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ImmutabilityIcon />
                <h3 className="font-semibold text-text-100 truncate">
                  {block.title}
                </h3>
              </div>
              <p className="text-xs text-text-300 mt-1">
                {block.type.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              disabled={block.immutability === ImmutabilityLevel.IMMUTABLE}
            >
              <MoreVertical className="w-4 h-4 text-text-300" />
            </button>
          </div>

          {/* Content Preview */}
          <div className="flex-1 overflow-hidden mb-2">
            <p className="text-sm text-text-200 line-clamp-3">
              {block.content}
            </p>
          </div>

          {/* Tags */}
          {effectiveTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {effectiveTags.slice(0, 3).map(tag => (
                <TagBadge
                  key={tag.id}
                  tagId={tag.id}
                  inherited={tag.inherited}
                  size="sm"
                />
              ))}
              {effectiveTags.length > 3 && (
                <span className="tag-badge text-xs">
                  +{effectiveTags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Back Face */}
        <div
          className={cn(
            'block-back glass-card h-full',
            'bg-gradient-to-br from-graph-700/90 to-graph-800/90',
            className
          )}
        >
          <div className="h-full flex flex-col">
            {/* Metadata Header */}
            <div className="border-b border-white/10 pb-2 mb-2">
              <h4 className="text-sm font-semibold text-text-100">Metadata</h4>
            </div>

            {/* Metadata Content */}
            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-400">ID:</span>
                  <p className="text-text-200 font-mono truncate">{block.id}</p>
                </div>
                <div>
                  <span className="text-text-400">Template:</span>
                  <p className="text-text-200">{block.templateId}</p>
                </div>
                <div>
                  <span className="text-text-400">Version:</span>
                  <p className="text-text-200">{block.version}</p>
                </div>
                <div>
                  <span className="text-text-400">State:</span>
                  <p className="text-text-200">{block.state}</p>
                </div>
              </div>

              {/* Custom Fields */}
              {Object.keys(block.fields).length > 0 && (
                <div>
                  <span className="text-text-400">Fields:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(block.fields).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-text-400">{key}:</span>
                        <span className="text-text-200 truncate ml-2">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Info */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-text-400">
                  Updated: {new Date(block.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-text-400">By: {block.updatedBy}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 glass-button text-xs py-1"
                disabled={block.immutability === ImmutabilityLevel.IMMUTABLE}
              >
                <Edit3 className="w-3 h-3 mr-1 inline" />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex-1 glass-button text-xs py-1"
                disabled={block.immutability !== ImmutabilityLevel.MUTABLE}
              >
                <Trash2 className="w-3 h-3 mr-1 inline" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <BlockEditor
            block={block}
            onSave={(updatedBlock) => {
              updateBlock(updatedBlock);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
/**
 * Block Editor Component
 *
 * Modal editor for editing block content and metadata
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Type,
  Tag,
  Lock,
  Shield,
  FileText,
  Code,
  TestTube,
  Database,
  Book,
} from 'lucide-react';
import { Block, BlockType, ImmutabilityLevel, BlockState } from '@/types';
import { cn } from '@/lib/utils';
import { useBlockStore } from '@/stores/blockStore';
import { TagBadge } from '../Tag/TagBadge';

interface BlockEditorProps {
  block: Block;
  onSave: (block: Block) => void;
  onCancel: () => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onSave,
  onCancel,
}) => {
  const { tags: allTags, addTagToBlock, removeTagFromBlock } = useBlockStore();
  const [editedBlock, setEditedBlock] = useState<Block>({ ...block });
  const [newTag, setNewTag] = useState('');

  // Handle field changes
  const handleChange = (field: keyof Block, value: any) => {
    setEditedBlock((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle custom field changes
  const handleFieldChange = (key: string, value: any) => {
    setEditedBlock((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: value,
      },
    }));
  };

  // Add tag
  const handleAddTag = useCallback(() => {
    if (newTag) {
      const existingTag = Array.from(allTags.values()).find(
        (t) => t.label.toLowerCase() === newTag.toLowerCase()
      );

      if (existingTag && !editedBlock.tags.includes(existingTag.id)) {
        setEditedBlock((prev) => ({
          ...prev,
          tags: [...prev.tags, existingTag.id],
        }));
      }
      setNewTag('');
    }
  }, [newTag, allTags, editedBlock.tags]);

  // Remove tag
  const handleRemoveTag = useCallback((tagId: string) => {
    setEditedBlock((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagId),
    }));
  }, []);

  // Get icon for block type
  const getTypeIcon = (type: BlockType) => {
    switch (type) {
      case BlockType.NOTE:
        return <FileText className="w-4 h-4" />;
      case BlockType.REQUIREMENT:
        return <Type className="w-4 h-4" />;
      case BlockType.SPEC:
        return <Code className="w-4 h-4" />;
      case BlockType.IMPLEMENTATION:
        return <Code className="w-4 h-4" />;
      case BlockType.TEST:
        return <TestTube className="w-4 h-4" />;
      case BlockType.DATA_SOURCE:
        return <Database className="w-4 h-4" />;
      case BlockType.MANIFEST:
        return <Book className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Handle save
  const handleSave = () => {
    onSave({
      ...editedBlock,
      updatedAt: new Date(),
      version: editedBlock.version + 1,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="glass-panel p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-100">Edit Block</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-300" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-200 mb-2">
            Title
          </label>
          <input
            type="text"
            value={editedBlock.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2 bg-graph-700 border border-white/10 rounded-lg text-text-100 placeholder-text-400 focus:outline-none focus:border-primary/50"
            placeholder="Enter block title..."
          />
        </div>

        {/* Type and State */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-200 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(BlockType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange('type', type)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
                    editedBlock.type === type
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-graph-700 border-white/10 text-text-300 hover:bg-white/5'
                  )}
                >
                  {getTypeIcon(type)}
                  <span className="text-sm capitalize">
                    {type.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-200 mb-2">
              State
            </label>
            <select
              value={editedBlock.state}
              onChange={(e) => handleChange('state', e.target.value as BlockState)}
              className="w-full px-4 py-2 bg-graph-700 border border-white/10 rounded-lg text-text-100 focus:outline-none focus:border-primary/50"
            >
              {Object.values(BlockState).map((state) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-text-200">
              Content (Markdown)
            </label>
            <span className="text-xs text-text-400">
              {editedBlock.content.length} chars •{' '}
              {editedBlock.content.trim().split(/\s+/).filter(Boolean).length}{' '}
              words
            </span>
          </div>
          <textarea
            value={editedBlock.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full h-48 px-4 py-2 bg-graph-700 border border-white/10 rounded-lg text-text-100 placeholder-text-400 focus:outline-none focus:border-primary/50 font-mono text-sm resize-none"
            placeholder="Enter block content in Markdown format..."
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-200 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {editedBlock.tags.map((tagId) => (
              <TagBadge
                key={tagId}
                tagId={tagId}
                size="sm"
                removable
                onRemove={() => handleRemoveTag(tagId)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 px-4 py-2 bg-graph-700 border border-white/10 rounded-lg text-text-100 placeholder-text-400 focus:outline-none focus:border-primary/50"
              placeholder="Add new tag..."
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
            >
              <Tag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Immutability */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-200 mb-2">
            Immutability Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleChange('immutability', ImmutabilityLevel.MUTABLE)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
                editedBlock.immutability === ImmutabilityLevel.MUTABLE
                  ? 'bg-success/20 border-success text-success'
                  : 'bg-graph-700 border-white/10 text-text-300 hover:bg-white/5'
              )}
            >
              <div className="w-4 h-4" />
              <span className="text-sm">Mutable</span>
            </button>
            <button
              onClick={() => handleChange('immutability', ImmutabilityLevel.LOCKED)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
                editedBlock.immutability === ImmutabilityLevel.LOCKED
                  ? 'bg-warning/20 border-warning text-warning'
                  : 'bg-graph-700 border-white/10 text-text-300 hover:bg-white/5'
              )}
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm">Locked</span>
            </button>
            <button
              onClick={() => handleChange('immutability', ImmutabilityLevel.IMMUTABLE)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
                editedBlock.immutability === ImmutabilityLevel.IMMUTABLE
                  ? 'bg-destructive/20 border-destructive text-destructive'
                  : 'bg-graph-700 border-white/10 text-text-300 hover:bg-white/5'
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Immutable</span>
            </button>
          </div>
        </div>

        {/* Custom Fields */}
        {Object.keys(editedBlock.fields).length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-200 mb-2">
              Custom Fields
            </label>
            <div className="space-y-2">
              {Object.entries(editedBlock.fields).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <input
                    type="text"
                    value={key}
                    disabled
                    className="w-1/3 px-3 py-2 bg-graph-800 border border-white/5 rounded-lg text-text-300"
                  />
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 bg-graph-700 border border-white/10 rounded-lg text-text-100 focus:outline-none focus:border-primary/50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-graph-700 text-text-300 rounded-lg hover:bg-graph-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
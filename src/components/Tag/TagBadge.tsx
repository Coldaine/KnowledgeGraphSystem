/**
 * Tag Badge Component
 *
 * Displays a tag with appropriate styling based on its properties
 */

import React from 'react';
import { X } from 'lucide-react';
import { useBlockStore } from '@/stores/blockStore';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tagId: string;
  inherited?: boolean;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tagId,
  inherited = false,
  size = 'md',
  removable = false,
  onRemove,
  className,
}) => {
  const { tags } = useBlockStore();
  const tag = tags.get(tagId);

  if (!tag) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const getGroupColor = () => {
    switch (tag.group) {
      case 'organizational':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'domain':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'status':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'priority':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'type':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div
      className={cn(
        'tag-badge inline-flex items-center gap-1',
        sizeClasses[size],
        getGroupColor(),
        inherited && 'tag-inheritable',
        className
      )}
      style={{
        backgroundColor: tag.color ? `${tag.color}20` : undefined,
        borderColor: tag.color ? `${tag.color}50` : undefined,
        color: tag.color ? tag.color : undefined,
      }}
      title={`${tag.label}${inherited ? ' (inherited)' : ''}${
        tag.description ? `\n${tag.description}` : ''
      }`}
    >
      {tag.icon && <span className="text-xs">{tag.icon}</span>}
      <span className={cn(inherited && 'opacity-70 italic')}>{tag.label}</span>
      {removable && !inherited && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:opacity-100 opacity-60 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
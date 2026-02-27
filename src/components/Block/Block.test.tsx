import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, onDoubleClick, ...props }: React.ComponentProps<'div'> & { onDoubleClick?: React.MouseEventHandler }) => (
      <div
        className={className}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        {...props}
      >
        {children}
      </div>
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
}));

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: jest.fn(),
    getInheritedTags: jest.fn().mockReturnValue([]),
  }),
}));

jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

describe('Block Component - Compact View', () => {
  const mockBlock = {
    id: 'test-block',
    type: BlockType.NOTE,
    templateId: 'default',
    title: 'Test Block',
    content: 'Test content',
    fields: {},
    tags: [],
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user',
    createdAt: new Date(),
    updatedBy: 'user',
    updatedAt: new Date(),
    version: 1,
  };

  it('should be accessible in compact view', () => {
    const onSelect = jest.fn();
    render(
      <Block
        block={mockBlock}
        viewMode="compact"
        onSelect={onSelect}
      />
    );

    const blockElement = screen.getByText('Test Block').closest('.glass-card');

    // Check accessibility attributes
    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', 'Select block: Test Block');

    // Check click interaction
    fireEvent.click(blockElement!);
    expect(onSelect).toHaveBeenCalledTimes(1);

    // Check keyboard interaction (Enter)
    fireEvent.keyDown(blockElement!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);

    // Check keyboard interaction (Space)
    fireEvent.keyDown(blockElement!, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(3);
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, onClick, onDoubleClick, onKeyDown, tabIndex, role, className, 'aria-label': ariaLabel }: any) => (
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        className={className}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useBlockStore
const mockUpdateBlock = jest.fn();
const mockGetInheritedTags = jest.fn().mockReturnValue([]);

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
  }),
}));

// Mock child components
jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

describe('Block Component Accessibility', () => {
  const mockBlock = {
    id: '1',
    title: 'Test Block',
    content: 'Test Content',
    type: BlockType.NOTE,
    state: BlockState.DRAFT,
    tags: [],
    fields: {},
    immutability: ImmutabilityLevel.MUTABLE,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: 'user',
    templateId: 'note',
    createdBy: 'user',
  };

  it('has correct accessibility attributes in card view', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const blockElement = screen.getByTestId('motion-div');

    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', `Knowledge block: ${mockBlock.title}`);
  });

  it('supports keyboard navigation for flipping/interaction', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const blockElement = screen.getByTestId('motion-div');

    // Test Enter key
    fireEvent.keyDown(blockElement, { key: 'Enter' });

    // Check if flipped class is applied (requires component state update)
    expect(blockElement).toHaveClass('flipped');

    // Toggle back
    fireEvent.keyDown(blockElement, { key: ' ' }); // Space key
    expect(blockElement).not.toHaveClass('flipped');
  });
});

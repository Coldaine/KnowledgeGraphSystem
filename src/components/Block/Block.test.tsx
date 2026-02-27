import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock dependencies
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(() => ({
    updateBlock: jest.fn(),
    getInheritedTags: jest.fn(() => []),
  })),
}));

jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, onDoubleClick, onKeyDown, role, tabIndex, 'aria-label': ariaLabel, onClick }: any) => (
      <div
        className={className}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        onClick={onClick}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Block Component Accessibility', () => {
  const mockBlock = {
    id: '1',
    type: BlockType.NOTE,
    title: 'Test Block',
    content: 'Test Content',
    tags: [],
    fields: {},
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user',
    updatedBy: 'user',
    templateId: 'default',
    provenance: {}, // Added to satisfy type requirements if strictly checked
    backFace: {},
  };

  it('renders with accessibility attributes in card view', () => {
    const onDoubleClick = jest.fn();
    render(
      <Block
        block={mockBlock}
        viewMode="card"
        onDoubleClick={onDoubleClick}
      />
    );

    const blockElement = screen.getByTestId('motion-div');

    // Check for accessibility attributes
    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', `Knowledge block: ${mockBlock.title}`);
  });

  it('handles keyboard navigation (Enter key)', () => {
    const onDoubleClick = jest.fn();
    render(
      <Block
        block={mockBlock}
        viewMode="card"
        onDoubleClick={onDoubleClick}
      />
    );

    const blockElement = screen.getByTestId('motion-div');

    // Simulate Enter key
    fireEvent.keyDown(blockElement, { key: 'Enter', code: 'Enter' });

    expect(onDoubleClick).toHaveBeenCalled();
  });

  it('handles keyboard navigation (Space key)', () => {
    const onDoubleClick = jest.fn();
    render(
      <Block
        block={mockBlock}
        viewMode="card"
        onDoubleClick={onDoubleClick}
      />
    );

    const blockElement = screen.getByTestId('motion-div');

    // Simulate Space key
    fireEvent.keyDown(blockElement, { key: ' ', code: 'Space' });

    expect(onDoubleClick).toHaveBeenCalled();
  });
});

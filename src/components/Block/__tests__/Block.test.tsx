import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from '../Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onDoubleClick, onClick, onKeyDown, tabIndex, role, ...props }: any) => (
      <div
        className={className}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  MoreVertical: () => <div data-testid="icon-more-vertical" />,
  Lock: () => <div data-testid="icon-lock" />,
  Shield: () => <div data-testid="icon-shield" />,
  Edit3: () => <div data-testid="icon-edit" />,
  Trash2: () => <div data-testid="icon-trash" />,
  Link2: () => <div data-testid="icon-link" />,
  Tag: () => <div data-testid="icon-tag" />,
  ChevronRight: () => <div data-testid="icon-chevron-right" />,
}));

// Mock dependencies
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

jest.mock('../../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

jest.mock('../BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

describe('Block Component Accessibility', () => {
  const mockBlock = {
    id: 'block-1',
    title: 'Test Block',
    content: 'This is a test block',
    type: BlockType.NOTE,
    tags: [],
    fields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user',
    updatedBy: 'user',
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: jest.fn(),
      getInheritedTags: jest.fn().mockReturnValue([]),
    });
    mockOnSelect.mockClear();
  });

  it('renders with accessibility attributes in card view', () => {
    render(<Block block={mockBlock} viewMode="card" onSelect={mockOnSelect} />);

    // Find the main container (motion.div mocked as div)
    // The query might need adjustment based on final structure, but looking for role="button" is key
    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });

    expect(blockElement).toBeInTheDocument();
    expect(blockElement).toHaveAttribute('tabIndex', '0');
  });

  it('handles keyboard selection in card view', () => {
    render(<Block block={mockBlock} viewMode="card" onSelect={mockOnSelect} />);

    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });

    // Test Enter key
    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(blockElement, { key: ' ' });
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });

  it('renders with accessibility attributes in compact view', () => {
     render(<Block block={mockBlock} viewMode="compact" onSelect={mockOnSelect} />);

     const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });
     expect(blockElement).toBeInTheDocument();
     expect(blockElement).toHaveAttribute('tabIndex', '0');
  });

  it('handles keyboard selection in compact view', () => {
    render(<Block block={mockBlock} viewMode="compact" onSelect={mockOnSelect} />);

    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });

    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });
});

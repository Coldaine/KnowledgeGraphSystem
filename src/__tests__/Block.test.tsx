import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from '@/components/Block/Block';
import { Block as BlockType, BlockType as BType, BlockState, ImmutabilityLevel } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onDoubleClick, onKeyDown, tabIndex, role, 'aria-label': ariaLabel, onClick, ...props }: any) => (
      <div
        className={className}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        onClick={onClick}
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
  MoreVertical: () => <div data-testid="icon-more" />,
  Lock: () => <div data-testid="icon-lock" />,
  Shield: () => <div data-testid="icon-shield" />,
  Edit3: () => <div data-testid="icon-edit" />,
  Trash2: () => <div data-testid="icon-trash" />,
  Link2: () => <div data-testid="icon-link" />,
  Tag: () => <div data-testid="icon-tag" />,
  ChevronRight: () => <div data-testid="icon-chevron" />,
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

const mockBlock: BlockType = {
  id: 'block-1',
  title: 'Test Block',
  content: 'This is a test block content.',
  type: BType.NOTE,
  tags: [],
  state: BlockState.DRAFT,
  version: 1,
  updatedAt: new Date(),
  updatedBy: 'user',
  createdAt: new Date(),
  createdBy: 'user',
  immutability: ImmutabilityLevel.MUTABLE,
  fields: {},
  templateId: 'default',
  position: { x: 0, y: 0 },
};

describe('Block Component Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct accessibility attributes in card mode', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Test Block'));
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('flip'));
  });

  it('handles keyboard interaction for flipping in card mode', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const card = screen.getByRole('article');

    // Simulate Enter key
    fireEvent.keyDown(card, { key: 'Enter' });

    // Check if flipped class is applied (mock implementation depends on state)
    // In our mock, the motion.div spreads props.
    // The Block component adds 'flipped' class when state isFlipped is true.
    expect(card).toHaveClass('flipped');
  });

  it('renders with correct accessibility attributes in compact mode', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Test Block'));
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('select'));
  });

  it('handles keyboard interaction for selection in compact mode', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

    const card = screen.getByRole('button');

    // Simulate Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();

    // Simulate Space key
    fireEvent.keyDown(card, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});

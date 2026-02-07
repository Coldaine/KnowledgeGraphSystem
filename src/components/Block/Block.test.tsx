import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock TagBadge to avoid store dependency inside it
jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />
}));

// Mock BlockEditor
jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />
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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, onClick, onDoubleClick, onKeyDown, tabIndex, role, 'aria-label': ariaLabel, ...props }: any) => (
      <div
        className={className}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </div>
    ),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock store
const mockUpdateBlock = jest.fn();
const mockGetInheritedTags = jest.fn().mockReturnValue([]);

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
  }),
}));

const mockBlock = {
  id: 'block-1',
  type: BlockType.NOTE,
  title: 'Test Block',
  content: 'Test content',
  fields: {},
  tags: [],
  state: BlockState.DRAFT,
  immutability: ImmutabilityLevel.MUTABLE,
  createdBy: 'user',
  createdAt: new Date(),
  updatedBy: 'user',
  updatedAt: new Date(),
  version: 1,
  templateId: 'default',
};

describe('Block Component Accessibility', () => {
  it('card view has accessibility attributes and handles interaction', () => {
    const onSelect = jest.fn();
    const { container } = render(<Block block={mockBlock} viewMode="card" onSelect={onSelect} />);

    // In card view, the motion.div has block-flipper class
    const flipper = container.querySelector('.block-flipper');
    expect(flipper).toBeInTheDocument();

    if (flipper) {
        expect(flipper).toHaveAttribute('tabIndex', '0');
        expect(flipper).toHaveAttribute('role', 'button');
        expect(flipper).toHaveAttribute('aria-label', expect.stringContaining('Test Block'));

        // Simulate click to check onSelect
        fireEvent.click(flipper);
        expect(onSelect).toHaveBeenCalled();
        onSelect.mockClear();

        // Simulate KeyDown Enter
        fireEvent.keyDown(flipper, { key: 'Enter', code: 'Enter' });
        expect(onSelect).toHaveBeenCalled();
    }
  });

  it('compact view has accessibility attributes and handles interaction', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

    const titleElement = screen.getByText('Test Block');
    const card = titleElement.closest('.glass-card');

    expect(card).toBeInTheDocument();

    if (card) {
        expect(card).toHaveAttribute('tabIndex', '0');
        expect(card).toHaveAttribute('role', 'button');
        expect(card).toHaveAttribute('aria-label', 'Block: Test Block');

        // onSelect is called on click
        fireEvent.click(card);
        expect(onSelect).toHaveBeenCalled();

        // Reset mock
        onSelect.mockClear();

        // Test keydown
        fireEvent.keyDown(card, { key: 'Enter' });
        expect(onSelect).toHaveBeenCalled();

        // Test Space key
        onSelect.mockClear();
        fireEvent.keyDown(card, { key: ' ' });
        expect(onSelect).toHaveBeenCalled();
    }
  });
});

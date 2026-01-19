import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, onClick, onDoubleClick, onKeyDown, tabIndex, role, 'aria-label': ariaLabel, className }: any) => (
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        className={className}
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
const mockGetInheritedTags = jest.fn(() => []);
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
  updatedAt: new Date(),
  createdAt: new Date(),
  createdBy: 'user',
  updatedBy: 'user',
  templateId: 'default',
};

describe('Block Component', () => {
  it('renders block title', () => {
    render(<Block block={mockBlock} />);
    expect(screen.getByText('Test Block')).toBeInTheDocument();
  });

  it('renders content preview', () => {
    render(<Block block={mockBlock} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('is accessible via keyboard in card mode', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} viewMode="card" />);

    // In card mode, we expect the main container to be accessible
    const blockElement = screen.getByRole('button', { name: /Test Block/i });
    expect(blockElement).toBeInTheDocument();
    expect(blockElement).toHaveAttribute('tabIndex', '0');

    // Check click
    fireEvent.click(blockElement);
    expect(onSelect).toHaveBeenCalled();

    // Check keyboard interaction
    onSelect.mockClear();
    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();

    onSelect.mockClear();
    fireEvent.keyDown(blockElement, { key: ' ' });
    expect(onSelect).toHaveBeenCalled();
  });

  it('prevents event bubbling from interactive children', () => {
    const onSelect = jest.fn();
    const onEdit = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} onEdit={onEdit} viewMode="card" />);

    // We'll search for the edit button. Since we didn't mock Lucide icons, they might render as SVGs.
    // However, we can find buttons in the component.
    // The main container is a button now.
    // The edit button (MoreVertical) is another button inside it.

    // Get all buttons
    const allButtons = screen.getAllByRole('button');
    // Filter out the main container (which has title as label)
    const innerButtons = allButtons.filter(b => !b.getAttribute('aria-label')?.includes('Test Block'));

    // Assuming the first inner button is the edit button (or delete, or any interactive child)
    // The structure has an edit button in the header.
    const editButton = innerButtons[0];

    if (editButton) {
        fireEvent.click(editButton);
        // onEdit should be called if we passed it and it's wired up
        // But more importantly, onSelect (the parent handler) should NOT be called if bubbling is stopped.
        expect(onSelect).not.toHaveBeenCalled();
    }
  });
});

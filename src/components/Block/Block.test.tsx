import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock dependencies
jest.mock('@/stores/blockStore');
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));
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
jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));
jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

const mockBlock = {
  id: 'block-1',
  type: BlockType.NOTE,
  templateId: 'tpl-1',
  title: 'Test Block',
  content: 'Test Content',
  fields: {},
  tags: [],
  state: BlockState.ACTIVE,
  immutability: ImmutabilityLevel.MUTABLE,
  createdBy: 'user-1',
  createdAt: new Date(),
  updatedBy: 'user-1',
  updatedAt: new Date(),
  version: 1,
};

describe('Block Component', () => {
  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
    mockOnSelect.mockClear();
  });

  it('renders correctly in compact mode with accessibility attributes', () => {
    render(
      <Block
        block={mockBlock}
        viewMode="compact"
        onSelect={mockOnSelect}
      />
    );

    const blockElement = screen.getByText('Test Block').closest('div.glass-card');
    expect(blockElement).toBeInTheDocument();

    // Accessibility checks
    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', `Knowledge block: ${mockBlock.title}`);
  });

  it('triggers onSelect on Enter/Space in compact mode', () => {
    render(
      <Block
        block={mockBlock}
        viewMode="compact"
        onSelect={mockOnSelect}
      />
    );

    const blockElement = screen.getByText('Test Block').closest('div.glass-card')!;

    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(blockElement, { key: ' ' });
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });

  it('renders correctly in card mode with accessibility attributes', () => {
    render(
      <Block
        block={mockBlock}
        viewMode="card"
        onSelect={mockOnSelect}
      />
    );

    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });
    expect(blockElement).toBeInTheDocument();
    expect(blockElement).toHaveClass('block-flipper');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
  });

  it('flips on Enter/Space in card mode', () => {
     render(
      <Block
        block={mockBlock}
        viewMode="card"
        onSelect={mockOnSelect}
      />
    );

    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });

    // Initial state: not flipped
    expect(blockElement).not.toHaveClass('flipped');

    // Press Enter
    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(blockElement).toHaveClass('flipped');

    // Press Space
    fireEvent.keyDown(blockElement, { key: ' ' });
    expect(blockElement).not.toHaveClass('flipped'); // Should toggle back
  });
});

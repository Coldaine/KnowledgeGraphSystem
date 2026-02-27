
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover: _, whileTap: __, ...props }: { children: React.ReactNode; whileHover?: unknown; whileTap?: unknown }) => {
      // Filter out framer-motion specific props to avoid DOM warnings
      return <div {...props}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock store
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

// Mock lucide-react icons
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

// Mock BlockEditor
jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor">Block Editor</div>,
}));

describe('Block Component', () => {
  const mockBlock = {
    id: 'block-1',
    title: 'Test Block',
    content: 'This is a test block content.',
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
    templateId: 'tpl-1',
  };

  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
    jest.clearAllMocks();
  });

  it('renders correctly in card mode', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    // Check title and content
    expect(screen.getByText('Test Block')).toBeInTheDocument();
    expect(screen.getByText('note')).toBeInTheDocument(); // Type label
    expect(screen.getByText('This is a test block content.')).toBeInTheDocument();
  });

  it('has accessibility attributes', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const card = screen.getByRole('button', { name: 'Knowledge block: Test Block' });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={handleSelect} />);

    const card = screen.getByRole('button', { name: 'Knowledge block: Test Block' });
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard activation (Enter)', () => {
    const handleSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={handleSelect} />);

    const card = screen.getByRole('button', { name: 'Knowledge block: Test Block' });

    // Press Enter
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

    expect(handleSelect).toHaveBeenCalledTimes(1);
    // Flipping logic is internal state, harder to test without checking classes or presence of back-face content
    // But we know handleDoubleClick is called, which flips it.
  });

  it('handles keyboard activation (Space)', () => {
    const handleSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={handleSelect} />);

    const card = screen.getByRole('button', { name: 'Knowledge block: Test Block' });

    // Press Space
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('does not trigger parent select when clicking "More" button', () => {
    const handleSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={handleSelect} />);

    const moreButton = screen.getByLabelText('Edit block');
    fireEvent.click(moreButton);

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('opens editor when "More" button is clicked and onEdit is undefined', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const moreButton = screen.getByLabelText('Edit block');
    fireEvent.click(moreButton);

    expect(screen.getByTestId('block-editor')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useBlockStore
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

// Mock TagBadge
jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

// Mock BlockEditor
jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

describe('Block Component', () => {
  const mockBlock = {
    id: 'block-1',
    title: 'Test Block',
    content: 'Test content',
    type: BlockType.NOTE,
    state: BlockState.DRAFT,
    tags: [],
    fields: {},
    immutability: ImmutabilityLevel.MUTABLE,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user',
    updatedBy: 'user',
    templateId: 'template-1',
    provenance: { source: 'source-1' },
  };

  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
  });

  it('renders correctly in compact mode', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

    expect(screen.getByText('Test Block')).toBeInTheDocument();
  });

  it('renders correctly in card mode', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    expect(screen.getByText('Test Block')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('has accessibility attributes in compact mode', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

    // In compact mode, the component returns a div with glass-card class
    const blockElement = screen.getByText('Test Block').closest('.glass-card');

    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', `Select block: ${mockBlock.title}`);
  });

  it('supports keyboard navigation in compact mode', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

    const blockElement = screen.getByText('Test Block').closest('.glass-card');
    if (!blockElement) throw new Error('Block element not found');

    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
  });

  it('has accessibility attributes in card mode', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const flipper = document.querySelector('.block-flipper');
    expect(flipper).toBeInTheDocument();

    expect(flipper).toHaveAttribute('role', 'button');
    expect(flipper).toHaveAttribute('tabIndex', '0');
    expect(flipper).toHaveAttribute('aria-label');
  });

  it('supports keyboard navigation in card mode (flip)', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    const flipper = document.querySelector('.block-flipper');
    if (!flipper) throw new Error('Flipper not found');

    expect(flipper).not.toHaveClass('flipped');

    // Press Enter to flip
    fireEvent.keyDown(flipper, { key: 'Enter' });

    expect(flipper).toHaveClass('flipped');
  });
});

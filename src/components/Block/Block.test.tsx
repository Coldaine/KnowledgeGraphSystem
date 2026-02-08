
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { Block as BlockType, BlockType as BType, ImmutabilityLevel, BlockState } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock useBlockStore
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => <div {...props}>{children}</div>,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockBlock: BlockType = {
  id: 'test-block',
  type: BType.NOTE,
  templateId: 'default',
  title: 'Test Block',
  content: 'This is a test block.',
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

describe('Block Component', () => {
  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
  });

  it('renders with accessibility attributes in card view', () => {
    render(<Block block={mockBlock} viewMode="card" />);
    // This will fail initially because role="button" is missing on the main container
    // or if present on children, we need to target the container
    const blockElement = screen.getByText('Test Block').closest('.block-flipper');

    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', mockBlock.title);
  });

  it('flips on Space key press', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={onSelect} />);
    const blockElement = screen.getByText('Test Block').closest('.block-flipper');

    // Initial state: front face visible
    expect(blockElement).not.toHaveClass('flipped');

    // Press Space
    if (blockElement) {
      fireEvent.keyDown(blockElement, { key: ' ' });
    }

    // Check if flipped
    expect(blockElement).toHaveClass('flipped');
    expect(onSelect).toHaveBeenCalled();
  });

  it('selects on Enter key press', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={onSelect} />);
    const blockElement = screen.getByText('Test Block').closest('.block-flipper');

    if (blockElement) {
      fireEvent.keyDown(blockElement, { key: 'Enter' });
    }

    expect(onSelect).toHaveBeenCalled();
  });
});

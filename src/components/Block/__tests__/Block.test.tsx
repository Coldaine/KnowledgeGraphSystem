import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from '../Block';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock framer-motion to test accessibility props on motion components
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      whileHover: _whileHover,
      whileTap: _whileTap,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      ...props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: { children: React.ReactNode; [key: string]: any }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the store
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

describe('Block Component Accessibility', () => {
  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);

  const mockBlock = {
    id: '1',
    type: BlockType.NOTE,
    title: 'Test Block',
    content: 'This is a test block content',
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
  };

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with accessibility attributes', () => {
    render(<Block block={mockBlock} />);

    const blockButton = screen.getByRole('button', { name: `Block: ${mockBlock.title}` });

    expect(blockButton).toBeInTheDocument();
    expect(blockButton).toHaveAttribute('tabIndex', '0');
  });

  it('triggers onSelect when Enter or Space is pressed', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} />);

    const blockButton = screen.getByRole('button', { name: `Block: ${mockBlock.title}` });

    fireEvent.keyDown(blockButton, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(blockButton, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('does not trigger onSelect for other keys', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} />);

    const blockButton = screen.getByRole('button', { name: `Block: ${mockBlock.title}` });

    fireEvent.keyDown(blockButton, { key: 'A' });
    expect(onSelect).not.toHaveBeenCalled();
  });
});

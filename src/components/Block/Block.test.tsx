import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, ...props }: any, ref) => (
      <div ref={ref as any} {...props}>
        {children}
      </div>
    )),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useBlockStore
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

// Mock lucide-react icons to avoid rendering issues
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

const mockBlock = {
  id: 'test-block-1',
  type: BlockType.NOTE,
  title: 'Test Block',
  content: 'This is a test block content.',
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

describe('Block Component Accessibility', () => {
  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in compact view with accessibility attributes', () => {
    const onSelect = jest.fn();
    render(
      <Block
        block={mockBlock}
        viewMode="compact"
        onSelect={onSelect}
      />
    );

    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });
    expect(blockElement).toBeInTheDocument();
    expect(blockElement).toHaveAttribute('tabIndex', '0');

    // Test keyboard interaction
    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(blockElement, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('renders correctly in card view with accessibility attributes', () => {
    render(
      <Block
        block={mockBlock}
        viewMode="card"
      />
    );

    // In card view, the motion.div wrapper should be the button
    const blockElement = screen.getByRole('button', { name: `Knowledge block: ${mockBlock.title}` });
    expect(blockElement).toBeInTheDocument();
    expect(blockElement).toHaveAttribute('tabIndex', '0');

    // Test keyboard interaction (Enter should toggle 'flipped' class)
    fireEvent.keyDown(blockElement, { key: 'Enter' });
    expect(blockElement).toHaveClass('flipped');

    // Toggle back
    fireEvent.keyDown(blockElement, { key: ' ' });
    expect(blockElement).not.toHaveClass('flipped');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock framer-motion
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
    }: any) => {
      // Filter out animation props that might cause issues or valid props that are passed
      const { ...validProps } = props;
      return <div {...validProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock store
const mockUpdateBlock = jest.fn();
const mockGetInheritedTags = jest.fn(() => []);
const mockTags = new Map();

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
    tags: mockTags,
  }),
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

describe('Block Component', () => {
  const mockBlock = {
    id: '1',
    type: BlockType.NOTE,
    title: 'Test Block',
    content: 'Test content',
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

  it('should be keyboard accessible for flipping', () => {
    render(<Block block={mockBlock} />);

    // Attempt to find the interactive element by role button and label
    const flipper = screen.getByRole('button', { name: `Block: ${mockBlock.title}` });

    // Check accessibility attributes
    expect(flipper).toHaveAttribute('tabIndex', '0');
    expect(flipper).toHaveAttribute('aria-label', `Block: ${mockBlock.title}`);

    // Check flip interaction
    expect(flipper).not.toHaveClass('flipped');
    fireEvent.keyDown(flipper, { key: 'Enter', code: 'Enter' });
    expect(flipper).toHaveClass('flipped');
  });
});

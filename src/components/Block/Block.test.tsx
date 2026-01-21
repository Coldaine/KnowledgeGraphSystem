import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block as BlockComponent } from './Block';
import { Block, BlockType, BlockState, ImmutabilityLevel } from '@/types';

// Mock dependencies
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: jest.fn(),
    getInheritedTags: jest.fn().mockReturnValue([]),
  }),
}));

jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge">Tag</div>,
}));

jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor">Editor</div>,
}));

// Mock framer-motion to render div instead of motion.div
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => {
      return <div {...props}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Block Component', () => {
  const mockBlock: Block = {
    id: 'test-block',
    type: BlockType.NOTE,
    templateId: 'default',
    title: 'Test Block',
    content: 'Test content',
    fields: {},
    tags: [],
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'test-user',
    createdAt: new Date(),
    updatedBy: 'test-user',
    updatedAt: new Date(),
    version: 1,
  };

  it('renders correctly in card view', () => {
    render(<BlockComponent block={mockBlock} viewMode="card" />);
    expect(screen.getByText('Test Block')).toBeInTheDocument();
  });

  it('is accessible via keyboard', () => {
    const onSelect = jest.fn();
    render(<BlockComponent block={mockBlock} viewMode="card" onSelect={onSelect} />);

    // Find the main container (flipper)
    // We expect it to be a button or have button role
    const blockButton = screen.getByRole('button', { name: /Test Block/i });

    expect(blockButton).toBeInTheDocument();
    expect(blockButton).toHaveAttribute('tabIndex', '0');

    // Simulate Enter key
    fireEvent.keyDown(blockButton, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();

    // Simulate Space key
    fireEvent.keyDown(blockButton, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('has visual focus state', () => {
     render(<BlockComponent block={mockBlock} viewMode="card" />);
     const blockButton = screen.getByRole('button', { name: /Test Block/i });
     expect(blockButton.className).toContain('focus-visible:ring-2');
  });
});

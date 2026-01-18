import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => {
      // Pass through the interactive props we care about testing
      return (
        <div
          {...props}
          // Ensure we don't pass undefined props that React might complain about
          // but allow our tested props through
        >
          {children}
        </div>
      );
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock BlockEditor
jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor">Editor</div>,
}));

// Mock useBlockStore
const mockUpdateBlock = jest.fn();
const mockGetInheritedTags = jest.fn().mockReturnValue([]);

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
  }),
}));

const mockBlock = {
  id: '1',
  title: 'Test Block',
  content: 'Test content',
  type: BlockType.NOTE,
  tags: [],
  fields: {},
  immutability: ImmutabilityLevel.MUTABLE,
  version: 1,
  state: BlockState.DRAFT,
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: 'user',
  templateId: 'default',
  createdBy: 'user',
};

describe('Block Component Accessibility', () => {
  it('renders with correct accessibility attributes in card mode', () => {
    render(<Block block={mockBlock} viewMode="card" />);

    // Check for interactive role
    const blockElement = screen.getByRole('button', { name: /Knowledge block: Test Block/i });
    expect(blockElement).toBeInTheDocument();

    // Check for tabIndex
    expect(blockElement).toHaveAttribute('tabIndex', '0');
  });

  it('triggers selection on Enter key', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={onSelect} />);

    const blockElement = screen.getByRole('button', { name: /Knowledge block: Test Block/i });
    fireEvent.keyDown(blockElement, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalled();
  });

  it('triggers selection on Space key', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={onSelect} />);

    const blockElement = screen.getByRole('button', { name: /Knowledge block: Test Block/i });
    fireEvent.keyDown(blockElement, { key: ' ' });

    expect(onSelect).toHaveBeenCalled();
  });

  it('does not trigger selection on other keys', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} viewMode="card" onSelect={onSelect} />);

    const blockElement = screen.getByRole('button', { name: /Knowledge block: Test Block/i });
    fireEvent.keyDown(blockElement, { key: 'a' });

    expect(onSelect).not.toHaveBeenCalled();
  });
});

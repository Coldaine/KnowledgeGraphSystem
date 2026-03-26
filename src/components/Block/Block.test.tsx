import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock store
const mockUpdateBlock = jest.fn();
const mockGetInheritedTags = jest.fn().mockReturnValue([]);

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
  }),
}));

const mockBlock = {
  id: 'test-block-1',
  type: BlockType.NOTE,
  templateId: 'default',
  title: 'Test Block',
  content: 'This is a test block',
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

describe('Block Component Accessibility', () => {
  it('renders block in card mode with accessibility attributes', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} viewMode="card" />);

    // Find the main container (mocked motion.div)
    // The text 'Test Block' is inside the block
    const blockElement = screen.getByText('Test Block').closest('.block-flipper');

    expect(blockElement).toBeInTheDocument();

    // Assert PRESENT attributes
    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', 'Block card: Test Block');

    // Assert WORKING keyboard interaction
    if (blockElement) {
        // Mock e.target === e.currentTarget behavior
        // In testing-library, fireEvent targets the element directly, so target and currentTarget are usually the same unless bubble is involved.
        fireEvent.keyDown(blockElement, { key: 'Enter', code: 'Enter' });
        expect(onSelect).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(blockElement, { key: ' ', code: 'Space' });
        expect(onSelect).toHaveBeenCalledTimes(2);
    }
  });

  it('renders block in compact mode with accessibility attributes', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} viewMode="compact" />);

    // Find the main container
    const blockElement = screen.getByText('Test Block').closest('.glass-card');

    expect(blockElement).toBeInTheDocument();

    // Assert PRESENT attributes
    expect(blockElement).toHaveAttribute('role', 'button');
    expect(blockElement).toHaveAttribute('tabIndex', '0');
    expect(blockElement).toHaveAttribute('aria-label', 'Select block: Test Block');

    // Assert WORKING keyboard interaction
    if (blockElement) {
        fireEvent.keyDown(blockElement, { key: 'Enter', code: 'Enter' });
        expect(onSelect).toHaveBeenCalledTimes(1);
    }
  });
});

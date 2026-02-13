import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from '../components/Block/Block';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';
import '@testing-library/jest-dom';

// Mock the store
const mockUpdateBlock = jest.fn();
const mockGetInheritedTags = jest.fn(() => []);

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
  }),
}));

// Mock framer-motion to render children immediately
jest.mock('framer-motion', () => ({
  motion: {
    // Destructure animation props to avoid React warnings in tests
    div: ({
      children,
      className,
      onDoubleClick,
      onKeyDown,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      whileHover,
      whileTap,
      initial,
      animate,
      exit,
      ...props
    }: any) => (
      <div
        className={className}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Block Component', () => {
  const mockBlock = {
    id: 'block-1',
    type: BlockType.NOTE,
    templateId: 'default',
    title: 'Test Block',
    content: 'This is a test block content',
    fields: {},
    tags: [],
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user',
    createdAt: new Date(),
    updatedBy: 'user',
    updatedAt: new Date(),
    version: 1,
  };

  it('renders block title', () => {
    render(<Block block={mockBlock} />);
    expect(screen.getByText('Test Block')).toBeInTheDocument();
  });

  it('flips on double click', () => {
    const { container } = render(<Block block={mockBlock} />);
    const flipper = container.querySelector('.block-flipper');

    expect(flipper).not.toHaveClass('flipped');
    fireEvent.doubleClick(flipper!);
    expect(flipper).toHaveClass('flipped');
  });

  it('flips on Enter key press', () => {
    const { container } = render(<Block block={mockBlock} />);
    const flipper = container.querySelector('.block-flipper');

    expect(flipper).not.toHaveClass('flipped');

    fireEvent.keyDown(flipper!, { key: 'Enter', code: 'Enter' });

    expect(flipper).toHaveClass('flipped');
  });

  it('flips on Space key press', () => {
    const { container } = render(<Block block={mockBlock} />);
    const flipper = container.querySelector('.block-flipper');

    expect(flipper).not.toHaveClass('flipped');

    fireEvent.keyDown(flipper!, { key: ' ', code: 'Space' });

    expect(flipper).toHaveClass('flipped');
  });

  it('has correct accessibility attributes', () => {
    const { container } = render(<Block block={mockBlock} />);
    const flipper = container.querySelector('.block-flipper');

    expect(flipper).toHaveAttribute('tabIndex', '0');
    expect(flipper).toHaveAttribute('role', 'button');
    expect(flipper).toHaveAttribute('aria-label', expect.stringContaining('Test Block'));
    expect(flipper).toHaveAttribute('aria-label', expect.stringContaining('flip'));
  });
});

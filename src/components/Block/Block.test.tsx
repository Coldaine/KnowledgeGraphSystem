import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock useBlockStore
const mockGetInheritedTags = jest.fn(() => []);
const mockUpdateBlock = jest.fn();

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    getInheritedTags: mockGetInheritedTags,
    updateBlock: mockUpdateBlock,
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: React.ComponentProps<'div'> & Record<string, any>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { whileHover, whileTap, initial, animate, exit, ...validProps } = props;
      return <div {...validProps} data-testid="motion-div">{children}</div>;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock TagBadge since it might be used
jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

// Mock BlockEditor
jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

const mockBlock = {
  id: 'block-1',
  type: BlockType.NOTE,
  templateId: 'default',
  title: 'Test Block',
  content: 'Test Content',
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

describe('Block Component Accessibility', () => {
  it('renders correctly', () => {
    render(<Block block={mockBlock} />);
    expect(screen.getByText('Test Block')).toBeInTheDocument();
  });

  it('has accessibility attributes and keyboard support', () => {
    render(<Block block={mockBlock} />);

    const flipper = screen.getByTestId('motion-div');

    // Check for accessibility attributes
    expect(flipper).toHaveAttribute('role', 'button');
    expect(flipper).toHaveAttribute('tabIndex', '0');
    expect(flipper).toHaveAttribute('aria-label', `Block: ${mockBlock.title}`);

    // Check for keyboard event handler
    fireEvent.keyDown(flipper, { key: 'Enter', code: 'Enter' });
    expect(flipper).toHaveClass('flipped');

    // Reset (toggle back)
    fireEvent.keyDown(flipper, { key: 'Enter', code: 'Enter' });
    expect(flipper).not.toHaveClass('flipped');

    // Test Space key
    fireEvent.keyDown(flipper, { key: ' ', code: 'Space' });
    expect(flipper).toHaveClass('flipped');
  });
});

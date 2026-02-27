import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock dependencies
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge" />,
}));

jest.mock('./BlockEditor', () => ({
  BlockEditor: () => <div data-testid="block-editor" />,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onClick,
      onDoubleClick,
      onKeyDown,
      tabIndex,
      role,
      className,
      whileHover: _whileHover,
      whileTap: _whileTap,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      ...props
    }: React.ComponentProps<'div'> & { [key: string]: unknown }) => (
      <div
        className={className}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        {...props}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Block Component', () => {
  const mockBlock = {
    id: 'block-1',
    type: BlockType.NOTE,
    templateId: 'tpl-1',
    title: 'Test Block',
    content: 'This is a test block content',
    fields: {},
    tags: [],
    state: BlockState.ACTIVE,
    immutability: ImmutabilityLevel.MUTABLE,
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedBy: 'user-1',
    updatedAt: new Date(),
    version: 1,
  };

  const mockSelectBlock = jest.fn();
  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn(() => []);

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      selectBlock: mockSelectBlock,
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
    jest.clearAllMocks();
  });

  it('renders block content correctly', () => {
    render(<Block block={mockBlock} />);
    expect(screen.getByText('Test Block')).toBeInTheDocument();
    expect(screen.getByText('note')).toBeInTheDocument();
  });

  it('has correct accessibility attributes for graph interaction', () => {
    render(<Block block={mockBlock} onSelect={mockSelectBlock} />);
    const container = screen.getByTestId('motion-div');

    expect(container).toHaveAttribute('role', 'button');
    expect(container).toHaveAttribute('tabIndex', '0');
    expect(container).toHaveAttribute('aria-label', `Knowledge block: ${mockBlock.title}`);
  });

  it('triggers onSelect when Enter key is pressed', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} />);
    const container = screen.getByTestId('motion-div');

    fireEvent.keyDown(container, { key: 'Enter', code: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
  });

  it('triggers onSelect when Space key is pressed', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} />);
    const container = screen.getByTestId('motion-div');

    fireEvent.keyDown(container, { key: ' ', code: 'Space' });
    expect(onSelect).toHaveBeenCalled();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  MoreVertical: () => <div data-testid="icon-more-vertical" />,
  Lock: () => <div data-testid="icon-lock" />,
  Shield: () => <div data-testid="icon-shield" />,
  Edit3: () => <div data-testid="icon-edit" />,
  Trash2: () => <div data-testid="icon-trash" />,
  Link2: () => <div data-testid="icon-link" />,
  Tag: () => <div data-testid="icon-tag" />,
  ChevronRight: () => <div data-testid="icon-chevron-right" />,
  Save: () => <div data-testid="icon-save" />,
  X: () => <div data-testid="icon-x" />,
  Type: () => <div data-testid="icon-type" />,
  Code: () => <div data-testid="icon-code" />,
  FileText: () => <div data-testid="icon-file-text" />,
  TestTube: () => <div data-testid="icon-test-tube" />,
  Database: () => <div data-testid="icon-database" />,
  Notebook: () => <div data-testid="icon-notebook" />,
}));

// Mock framer-motion to render div instead of motion.div
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({
      children,
      className,
      onClick,
      onDoubleClick,
      onKeyDown,
      role,
      tabIndex,
      'aria-label': ariaLabel,
      // Filter out animation props
      whileHover,
      whileTap,
      initial,
      animate,
      exit,
      ...props
    }: any, ref: any) => (
      <div
        ref={ref}
        className={className}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </div>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useBlockStore
const mockTags = new Map();
const mockGetInheritedTags = jest.fn().mockReturnValue([]);
const mockUpdateBlock = jest.fn();
const mockAddTagToBlock = jest.fn();
const mockRemoveTagFromBlock = jest.fn();

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    tags: mockTags,
    updateBlock: mockUpdateBlock,
    getInheritedTags: mockGetInheritedTags,
    addTagToBlock: mockAddTagToBlock,
    removeTagFromBlock: mockRemoveTagFromBlock,
  }),
}));

describe('Block Component', () => {
  const mockBlock = {
    id: '1',
    type: BlockType.NOTE,
    title: 'Test Block',
    content: 'Test Content',
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
    provenance: undefined,
    // @ts-ignore - backFace is optional and type definition might be slightly different in test context but this is safe
    backFace: undefined,
    position: { x: 0, y: 0 },
  };

  it('renders with accessibility attributes', () => {
    render(<Block block={mockBlock} />);

    const blockElement = screen.getByRole('button', { name: /knowledge block: test block/i });
    expect(blockElement).toBeInTheDocument();
    expect(blockElement).toHaveAttribute('tabIndex', '0');
  });

  it('calls onSelect when Enter is pressed', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} />);

    const blockElement = screen.getByRole('button', { name: /knowledge block: test block/i });
    fireEvent.keyDown(blockElement, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalled();
  });

  it('calls onSelect when Space is pressed', () => {
    const onSelect = jest.fn();
    render(<Block block={mockBlock} onSelect={onSelect} />);

    const blockElement = screen.getByRole('button', { name: /knowledge block: test block/i });
    fireEvent.keyDown(blockElement, { key: ' ' });

    expect(onSelect).toHaveBeenCalled();
  });
});

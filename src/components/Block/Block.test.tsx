import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Block } from './Block';
import { useBlockStore } from '@/stores/blockStore';
import { BlockType, ImmutabilityLevel, BlockState } from '@/types';

// Mock the store
jest.mock('@/stores/blockStore', () => ({
  useBlockStore: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, onDoubleClick, onKeyDown, className, tabIndex, role, 'aria-label': ariaLabel }: { children: React.ReactNode, onClick?: () => void, onDoubleClick?: () => void, onKeyDown?: (e: React.KeyboardEvent) => void, className?: string, tabIndex?: number, role?: string, 'aria-label'?: string }) => (
      <div
        className={className}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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
}));

const mockBlock = {
  id: 'test-block',
  type: BlockType.NOTE,
  templateId: 'default',
  title: 'Test Block',
  content: 'Test content',
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
  const mockUpdateBlock = jest.fn();
  const mockGetInheritedTags = jest.fn().mockReturnValue([]);

  beforeEach(() => {
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      updateBlock: mockUpdateBlock,
      getInheritedTags: mockGetInheritedTags,
    });
    jest.clearAllMocks();
  });

  describe('Compact View', () => {
    it('should have accessibility attributes', () => {
      const onSelect = jest.fn();
      render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

      const blockElement = screen.getByText('Test Block').closest('div')?.parentElement;
      expect(blockElement).toBeInTheDocument();

      // These assertions are expected to fail before the fix
      expect(blockElement).toHaveAttribute('role', 'button');
      expect(blockElement).toHaveAttribute('tabIndex', '0');
      expect(blockElement).toHaveAttribute('aria-label', `Block: ${mockBlock.title}`);
    });

    it('should trigger onSelect when pressing Enter', () => {
      const onSelect = jest.fn();
      render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

      const blockElement = screen.getByText('Test Block').closest('div')?.parentElement;
      if (!blockElement) throw new Error('Block element not found');

      fireEvent.keyDown(blockElement, { key: 'Enter', code: 'Enter' });
      expect(onSelect).toHaveBeenCalled();
    });

    it('should trigger onSelect when pressing Space', () => {
      const onSelect = jest.fn();
      render(<Block block={mockBlock} viewMode="compact" onSelect={onSelect} />);

      const blockElement = screen.getByText('Test Block').closest('div')?.parentElement;
      if (!blockElement) throw new Error('Block element not found');

      fireEvent.keyDown(blockElement, { key: ' ', code: 'Space' });
      expect(onSelect).toHaveBeenCalled();
    });
  });

  describe('Card View', () => {
    it('should have accessibility attributes on the flipper', () => {
      render(<Block block={mockBlock} viewMode="card" />);

      // In our mock, motion.div renders a div.
      // The flipper is the container of the front face.
      const titleElement = screen.getByText('Test Block');
      // The structure is:
      // <div className="block-3d-container">
      //   <motion.div className="block-flipper"> (This is what we want)
      //     <div className="block-front">
      //       ...title...

      const frontFace = titleElement.closest('.block-front');
      const flipper = frontFace?.parentElement;

      expect(flipper).toBeInTheDocument();
      expect(flipper).toHaveClass('block-flipper');

      // These assertions are expected to fail before the fix
      expect(flipper).toHaveAttribute('role', 'button');
      expect(flipper).toHaveAttribute('tabIndex', '0');
      expect(flipper).toHaveAttribute('aria-label', `Block: ${mockBlock.title}`);
    });

    // Note: Testing the flip on Enter/Space might require mocking handleDoubleClick
    // or verifying state change if we can access it, but Block manages its own state.
    // We can't easily spy on internal state with functional components.
    // However, if we pass onDoubleClick prop, the component calls it.
    // The component calls internal setIsFlipped AND props.onDoubleClick.

    it('should trigger onDoubleClick when pressing Enter', () => {
      const onDoubleClick = jest.fn();
      render(<Block block={mockBlock} viewMode="card" onDoubleClick={onDoubleClick} />);

      const titleElement = screen.getByText('Test Block');
      const frontFace = titleElement.closest('.block-front');
      const flipper = frontFace?.parentElement;

      if (!flipper) throw new Error('Flipper element not found');

      flipper.focus();
      fireEvent.keyDown(flipper, { key: 'Enter', code: 'Enter' });
      expect(onDoubleClick).toHaveBeenCalled();
    });
  });
});

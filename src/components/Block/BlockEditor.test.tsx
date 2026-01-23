import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockEditor } from './BlockEditor';
import { BlockType, BlockState, ImmutabilityLevel } from '@/types';
import { useBlockStore } from '@/stores/blockStore';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock useBlockStore
jest.mock('@/stores/blockStore');

// Mock TagBadge to avoid rendering complex child components
jest.mock('../Tag/TagBadge', () => ({
  TagBadge: () => <div data-testid="tag-badge">Tag</div>,
}));

describe('BlockEditor', () => {
  const mockBlock = {
    id: '1',
    type: BlockType.NOTE,
    title: 'Test Block',
    content: 'Hello World',
    tags: [],
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    fields: {},
    createdBy: 'user',
    updatedBy: 'user',
    templateId: 'default',
  };

  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useBlockStore as unknown as jest.Mock).mockReturnValue({
      tags: new Map(),
      addTagToBlock: jest.fn(),
      removeTagFromBlock: jest.fn(),
    });
  });

  it('renders correctly', () => {
    render(
      <BlockEditor
        block={mockBlock}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Block')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Block')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument();
  });

  it('displays word and character count', () => {
    render(
      <BlockEditor
        block={mockBlock}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Initial count (Hello World = 11 chars, 2 words)
    expect(screen.getByText(/11 characters/)).toBeInTheDocument();
    expect(screen.getByText(/2 words/)).toBeInTheDocument();

    // Update content
    const textarea = screen.getByPlaceholderText(
      'Enter block content in Markdown format...'
    );
    fireEvent.change(textarea, { target: { value: 'Hello World Updated' } });

    // Updated count (Hello World Updated = 19 chars, 3 words)
    expect(screen.getByText(/19 characters/)).toBeInTheDocument();
    expect(screen.getByText(/3 words/)).toBeInTheDocument();
  });

  it('has accessible buttons', () => {
    render(
      <BlockEditor
        block={mockBlock}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Close editor')).toBeInTheDocument();
    expect(screen.getByLabelText('Add tag')).toBeInTheDocument();
  });
});

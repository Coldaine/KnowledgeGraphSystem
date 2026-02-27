import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockEditor } from './BlockEditor';
import { Block, BlockType, BlockState, ImmutabilityLevel } from '@/types';

// Mock framer-motion to avoid animation issues
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onClick,
      className,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      className?: string;
    }) => (
      <div onClick={onClick} className={className}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock the store
const mockTags = new Map([
  ['tag1', { id: 'tag1', label: 'Tag 1', color: '#ff0000', group: 'custom' }],
]);

jest.mock('@/stores/blockStore', () => ({
  useBlockStore: () => ({
    tags: mockTags,
    addTagToBlock: jest.fn(),
    removeTagFromBlock: jest.fn(),
  }),
}));

describe('BlockEditor', () => {
  const mockBlock: Block = {
    id: 'block1',
    type: BlockType.NOTE,
    title: 'Test Block',
    content: 'Initial content',
    tags: [],
    state: BlockState.DRAFT,
    immutability: ImmutabilityLevel.MUTABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user',
    updatedBy: 'user',
    version: 1,
    fields: {},
    templateId: 'default',
  };

  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial data', () => {
    render(
      <BlockEditor
        block={mockBlock}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('Test Block')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument();
  });

  it('displays correct word and character count', () => {
    render(
      <BlockEditor
        block={mockBlock}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Initial content: "Initial content" -> 15 chars, 2 words
    expect(screen.getByText(/15 characters/)).toBeInTheDocument();
    expect(screen.getByText(/2 words/)).toBeInTheDocument();

    // Change content
    const textarea = screen.getByPlaceholderText(
      'Enter block content in Markdown format...'
    );
    fireEvent.change(textarea, { target: { value: 'Hello world test' } });

    // "Hello world test" -> 16 chars, 3 words
    expect(screen.getByText(/16 characters/)).toBeInTheDocument();
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

  it('calls onCancel when close button is clicked', () => {
    render(
      <BlockEditor
        block={mockBlock}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByLabelText('Close editor'));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});

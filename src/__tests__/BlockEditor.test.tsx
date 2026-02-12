
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockEditor } from '../components/Block/BlockEditor';
import { Block, BlockType, ImmutabilityLevel, BlockState } from '../types';

// Mock dependencies
jest.mock('lucide-react', () => ({
  Save: () => <span>SaveIcon</span>,
  X: () => <span>XIcon</span>,
  Type: () => <span>TypeIcon</span>,
  Tag: () => <span>TagIcon</span>,
  Lock: () => <span>LockIcon</span>,
  Shield: () => <span>ShieldIcon</span>,
  FileText: () => <span>FileTextIcon</span>,
  Code: () => <span>CodeIcon</span>,
  TestTube: () => <span>TestTubeIcon</span>,
  Database: () => <span>DatabaseIcon</span>,
  Notebook: () => <span>NotebookIcon</span>,
}));

jest.mock('../components/Tag/TagBadge', () => ({
  TagBadge: ({ tagId, onRemove }: any) => (
    <div data-testid={`tag-${tagId}`}>
      Tag:{tagId}
      {onRemove && <button onClick={onRemove}>Remove</button>}
    </div>
  ),
}));

jest.mock('../stores/blockStore', () => ({
  useBlockStore: () => ({
    tags: new Map(),
    addTagToBlock: jest.fn(),
    removeTagFromBlock: jest.fn(),
  }),
}));

const mockBlock: Block = {
  id: '1',
  title: 'Test Block',
  content: 'Hello world',
  type: BlockType.NOTE,
  tags: [],
  fields: {},
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  immutability: ImmutabilityLevel.MUTABLE,
  state: BlockState.DRAFT,
  templateId: 'default',
  createdBy: 'user',
  updatedBy: 'user',
  position: { x: 0, y: 0 },
};

describe('BlockEditor', () => {
  it('displays word and character count', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(
      <BlockEditor
        block={mockBlock}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    // Initial check ("Hello world" -> 2 words, 11 chars)
    // Note: The count display is what we want to add, so this test fails until we implement it.
    // For TDD, I will look for the text.
    expect(screen.getByText(/2 words/i)).toBeInTheDocument();
    expect(screen.getByText(/11 chars/i)).toBeInTheDocument();

    // Change text
    const textarea = screen.getByPlaceholderText('Enter block content in Markdown format...');
    fireEvent.change(textarea, { target: { value: 'New content here' } });

    // "New content here" -> 3 words, 16 chars
    expect(screen.getByText(/3 words/i)).toBeInTheDocument();
    expect(screen.getByText(/16 chars/i)).toBeInTheDocument();
  });

  it('has accessible labels for buttons', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(
      <BlockEditor
        block={mockBlock}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole('button', { name: /Close editor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add tag/i })).toBeInTheDocument();
  });
});

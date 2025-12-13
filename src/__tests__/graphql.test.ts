import { server } from '../pages/api/graphql';
import { getDb } from '../lib/server/db';
import { Block, Edge, Tag, BlockType, ImmutabilityLevel, BlockState, SemanticRelation, TagGroup } from '../types';

// Mock the db module
jest.mock('../lib/server/db', () => ({
  getDb: jest.fn(),
}));

const mockBlock1: Block = {
  id: 'block-1',
  type: BlockType.NOTE,
  templateId: 'default',
  title: 'Test Block 1',
  content: 'Content 1',
  tags: ['tag-1'],
  immutability: ImmutabilityLevel.MUTABLE,
  state: BlockState.DRAFT,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  version: 1,
  createdBy: 'test',
  updatedBy: 'test',
  fields: {},
};

const mockEdge1: Edge = {
  id: 'edge-1',
  fromBlockId: 'block-1',
  toBlockId: 'block-2',
  relationType: SemanticRelation.REFERENCES,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  createdBy: 'test',
};

const mockTag1: Tag = {
  id: 'tag-1',
  label: 'Test Tag 1',
  group: TagGroup.CUSTOM,
  inheritable: false,
  color: '#ffffff',
  system: false,
};


const mockDb = {
  blocks: new Map([['block-1', mockBlock1]]),
  edges: new Map([['edge-1', mockEdge1]]),
  tags: new Map([['tag-1', mockTag1]]),
};

describe('GraphQL API', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (getDb as jest.Mock).mockReturnValue(mockDb);
  });

  it('fetches all blocks', async () => {
    const response = await server.executeOperation({
      query: 'query { blocks { id title } }',
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.blocks).toEqual([{ id: 'block-1', title: 'Test Block 1' }]);
    }
  });

  it('fetches a single block by ID', async () => {
    const response = await server.executeOperation({
      query: 'query($id: ID!) { block(id: $id) { id title content } }',
      variables: { id: 'block-1' },
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.block).toEqual({ id: 'block-1', title: 'Test Block 1', content: 'Content 1' });
    }
  });

  it('fetches all edges', async () => {
    const response = await server.executeOperation({
      query: 'query { edges { id fromBlockId toBlockId } }',
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.edges).toEqual([{ id: 'edge-1', fromBlockId: 'block-1', toBlockId: 'block-2' }]);
    }
  });

  it('fetches a single edge by ID', async () => {
    const response = await server.executeOperation({
      query: 'query($id: ID!) { edge(id: $id) { id relationType } }',
      variables: { id: 'edge-1' },
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.edge).toEqual({ id: 'edge-1', relationType: 'REFERENCES' });
    }
  });

  it('fetches all tags', async () => {
    const response = await server.executeOperation({
      query: 'query { tags { id label } }',
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.tags).toEqual([{ id: 'tag-1', label: 'Test Tag 1' }]);
    }
  });

  it('fetches a single tag by ID', async () => {
    const response = await server.executeOperation({
      query: 'query($id: ID!) { tag(id: $id) { id label group } }',
      variables: { id: 'tag-1' },
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.tag).toEqual({ id: 'tag-1', label: 'Test Tag 1', group: 'CUSTOM' });
    }
  });

  it('returns null for a non-existent block', async () => {
    const response = await server.executeOperation({
      query: 'query($id: ID!) { block(id: $id) { id } }',
      variables: { id: 'non-existent-block' },
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.block).toBeNull();
    }
  });

  it('fetches nested tags for a block', async () => {
    const response = await server.executeOperation({
      query: 'query($id: ID!) { block(id: $id) { id tags { id label } } }',
      variables: { id: 'block-1' },
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        expect(response.body.singleResult.errors).toBeUndefined();
        const data = response.body.singleResult.data;
        expect(data?.block).toEqual({
          id: 'block-1',
          tags: [{ id: 'tag-1', label: 'Test Tag 1' }],
        });
    }
  });
});

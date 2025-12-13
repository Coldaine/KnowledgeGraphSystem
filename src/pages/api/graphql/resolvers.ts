import { getDb } from '@/lib/server/db';
import { Block, Tag } from '@/types';
import { GraphQLScalarType } from 'graphql';
import { DateResolver } from 'graphql-scalars';

export const resolvers = {
  Date: DateResolver,
  Query: {
    blocks: () => Array.from(getDb().blocks.values()),
    edges: () => Array.from(getDb().edges.values()),
    tags: () => Array.from(getDb().tags.values()),
    block: (_: any, { id }: { id: string }) => getDb().blocks.get(id),
    edge: (_: any, { id }: { id: string }) => getDb().edges.get(id),
    tag: (_: any, { id }: { id: string }) => getDb().tags.get(id),
  },
  Block: {
    tags: (block: Block): Tag[] => {
      const allTags = getDb().tags;
      return block.tags.map(tagId => allTags.get(tagId)).filter((tag): tag is Tag => tag !== undefined);
    },
  },
  Tag: {
    group: (tag: Tag) => tag.group.toUpperCase(),
  },
};

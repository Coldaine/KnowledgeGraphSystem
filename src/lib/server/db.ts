import fs from 'fs';
import path from 'path';
import { Block, Edge, Tag } from '@/types';

interface DbData {
  blocks: Map<string, Block>;
  edges: Map<string, Edge>;
  tags: Map<string, Tag>;
}

let db: DbData | null = null;

export const getDb = (): DbData => {
  if (db) {
    return db;
  }

  const filePath = path.join(process.cwd(), 'data', 'db.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const parsedData = JSON.parse(jsonData);

  db = {
    blocks: new Map(parsedData.blocks),
    edges: new Map(parsedData.edges),
    tags: new Map(parsedData.tags),
  };

  return db;
};

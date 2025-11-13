/**
 * Document Compositor
 *
 * Assembles documents from blocks by traversing the graph structure.
 * Supports multiple traversal strategies and filtering options.
 */

import {
  Block,
  BlockId,
  Edge,
  AssemblyConfig,
  TraversalProfile,
  RelationType,
  StructuralRelation,
  TagId,
} from '@/types';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';

// Configure marked for GitHub Flavored Markdown
marked.use(gfmHeadingId());

export interface CompositorResult {
  content: string;
  blocks: Block[];
  toc: TocEntry[];
  metadata: {
    blockCount: number;
    wordCount: number;
    traversalDepth: number;
    assemblyTime: number;
  };
}

export interface TocEntry {
  id: string;
  title: string;
  level: number;
  blockId: BlockId;
}

export class DocumentCompositor {
  private blocks: Map<BlockId, Block>;
  private edges: Map<string, Edge>;
  private visitedBlocks: Set<BlockId>;
  private assembledBlocks: Block[];
  private toc: TocEntry[];
  private startTime: number;

  constructor(blocks: Map<BlockId, Block>, edges: Map<string, Edge>) {
    this.blocks = blocks;
    this.edges = edges;
    this.visitedBlocks = new Set();
    this.assembledBlocks = [];
    this.toc = [];
    this.startTime = 0;
  }

  /**
   * Assemble a document from a root block
   */
  public async assemble(config: AssemblyConfig): Promise<CompositorResult> {
    this.startTime = performance.now();
    this.visitedBlocks.clear();
    this.assembledBlocks = [];
    this.toc = [];

    const rootBlock = this.blocks.get(config.rootBlockId);
    if (!rootBlock) {
      throw new Error(`Root block ${config.rootBlockId} not found`);
    }

    // Start traversal from root
    await this.traverseBlock(
      rootBlock,
      config.traversalProfile,
      config.tagFilter,
      0,
      config.maxDepth || Infinity
    );

    // Generate content based on format
    let content = '';
    switch (config.format) {
      case 'markdown':
        content = this.generateMarkdown(config.includeToc, config.includeMetadata);
        break;
      case 'html':
        content = await this.generateHTML(config.includeToc, config.includeMetadata);
        break;
      case 'json':
        content = this.generateJSON();
        break;
      default:
        content = this.generateMarkdown(config.includeToc, config.includeMetadata);
    }

    const assemblyTime = performance.now() - this.startTime;

    return {
      content,
      blocks: this.assembledBlocks,
      toc: this.toc,
      metadata: {
        blockCount: this.assembledBlocks.length,
        wordCount: this.countWords(content),
        traversalDepth: this.getMaxDepth(),
        assemblyTime,
      },
    };
  }

  /**
   * Traverse blocks according to the profile
   */
  private async traverseBlock(
    block: Block,
    profile: TraversalProfile,
    tagFilter?: TagId[],
    currentDepth: number = 0,
    maxDepth: number = Infinity
  ): Promise<void> {
    // Check if already visited (avoid cycles)
    if (this.visitedBlocks.has(block.id)) {
      return;
    }

    // Check depth limit
    if (currentDepth >= maxDepth) {
      return;
    }

    // Apply tag filter
    if (tagFilter && tagFilter.length > 0) {
      const hasRequiredTag = tagFilter.some((tag) => block.tags.includes(tag));
      if (!hasRequiredTag) {
        return;
      }
    }

    // Mark as visited
    this.visitedBlocks.add(block.id);
    this.assembledBlocks.push(block);

    // Add to TOC if it's a structural parent
    if (this.isStructuralParent(block)) {
      this.toc.push({
        id: `block-${block.id}`,
        title: block.title,
        level: currentDepth,
        blockId: block.id,
      });
    }

    // Get related blocks based on profile
    const relatedBlocks = this.getRelatedBlocks(block, profile);

    // Sort if needed
    if (profile.respectOrder) {
      relatedBlocks.sort(this.compareBlockOrder);
    }

    // Traverse related blocks
    for (const relatedBlock of relatedBlocks) {
      if (profile.strategy === 'depth-first') {
        await this.traverseBlock(
          relatedBlock,
          profile,
          tagFilter,
          currentDepth + 1,
          maxDepth
        );
      } else {
        // Breadth-first: add to queue
        // For simplicity, we're using depth-first here
        // Real BFS would require a queue
        await this.traverseBlock(
          relatedBlock,
          profile,
          tagFilter,
          currentDepth + 1,
          maxDepth
        );
      }
    }

    // Include siblings if requested
    if (profile.includeSiblings && currentDepth > 0) {
      const siblings = this.getSiblings(block);
      for (const sibling of siblings) {
        if (!this.visitedBlocks.has(sibling.id)) {
          await this.traverseBlock(
            sibling,
            profile,
            tagFilter,
            currentDepth,
            maxDepth
          );
        }
      }
    }
  }

  /**
   * Get blocks related to the current block based on relationship types
   */
  private getRelatedBlocks(block: Block, profile: TraversalProfile): Block[] {
    const relatedBlocks: Block[] = [];

    Array.from(this.edges.values()).forEach((edge) => {
      // Check if this edge originates from our block
      if (edge.fromBlockId !== block.id) {
        return;
      }

      // Check if the relationship type is in our whitelist
      if (!profile.followRelations.includes(edge.relationType)) {
        return;
      }

      // Get the target block
      const targetBlock = this.blocks.get(edge.toBlockId);
      if (targetBlock) {
        relatedBlocks.push(targetBlock);
      }
    });

    return relatedBlocks;
  }

  /**
   * Get sibling blocks (same parent)
   */
  private getSiblings(block: Block): Block[] {
    const siblings: Block[] = [];

    // Find parent edge
    const parentEdge = Array.from(this.edges.values()).find(
      (edge) =>
        edge.toBlockId === block.id &&
        (edge.relationType === StructuralRelation.PARENT_OF ||
          edge.relationType === StructuralRelation.CONTAINS_ORDERED)
    );

    if (!parentEdge) {
      return siblings;
    }

    // Find all children of the parent
    Array.from(this.edges.values()).forEach((edge) => {
      if (
        edge.fromBlockId === parentEdge.fromBlockId &&
        edge.toBlockId !== block.id &&
        (edge.relationType === StructuralRelation.PARENT_OF ||
          edge.relationType === StructuralRelation.CONTAINS_ORDERED)
      ) {
        const siblingBlock = this.blocks.get(edge.toBlockId);
        if (siblingBlock) {
          siblings.push(siblingBlock);
        }
      }
    });

    return siblings;
  }

  /**
   * Check if a block is a structural parent
   */
  private isStructuralParent(block: Block): boolean {
    return Array.from(this.edges.values()).some(
      (edge) =>
        edge.fromBlockId === block.id &&
        (edge.relationType === StructuralRelation.PARENT_OF ||
          edge.relationType === StructuralRelation.CONTAINS_ORDERED)
    );
  }

  /**
   * Compare blocks for ordering
   */
  private compareBlockOrder = (a: Block, b: Block): number => {
    // Find edges that define order
    const edgeA = Array.from(this.edges.values()).find(
      (edge) => edge.toBlockId === a.id
    );
    const edgeB = Array.from(this.edges.values()).find(
      (edge) => edge.toBlockId === b.id
    );

    const orderA = edgeA?.order || 0;
    const orderB = edgeB?.order || 0;

    return orderA - orderB;
  };

  /**
   * Generate Markdown output
   */
  private generateMarkdown(includeToc: boolean, includeMetadata: boolean): string {
    let markdown = '';

    // Add metadata header if requested
    if (includeMetadata) {
      markdown += '---\\n';
      markdown += `title: ${this.assembledBlocks[0]?.title || 'Document'}\\n`;
      markdown += `generated: ${new Date().toISOString()}\\n`;
      markdown += `blocks: ${this.assembledBlocks.length}\\n`;
      markdown += '---\\n\\n';
    }

    // Add TOC if requested
    if (includeToc && this.toc.length > 0) {
      markdown += '## Table of Contents\\n\\n';
      this.toc.forEach((entry) => {
        const indent = '  '.repeat(entry.level);
        markdown += `${indent}- [${entry.title}](#${entry.id})\\n`;
      });
      markdown += '\\n';
    }

    // Add block content
    this.assembledBlocks.forEach((block, index) => {
      // Add heading for structural parents
      if (this.isStructuralParent(block)) {
        const level = Math.min(this.getBlockDepth(block) + 1, 6);
        markdown += `${'#'.repeat(level)} ${block.title}\\n\\n`;
      }

      // Add content
      markdown += block.content;

      // Add spacing between blocks
      if (index < this.assembledBlocks.length - 1) {
        markdown += '\\n\\n';
      }
    });

    return markdown;
  }

  /**
   * Generate HTML output
   */
  private async generateHTML(
    includeToc: boolean,
    includeMetadata: boolean
  ): Promise<string> {
    const markdown = this.generateMarkdown(includeToc, includeMetadata);
    const html = await marked(markdown);

    // Wrap in a proper HTML document
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.assembledBlocks[0]?.title || 'Document'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
    }
    code {
      background-color: #f6f8fa;
      padding: 2px 4px;
      border-radius: 3px;
    }
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 16px;
      color: #666;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `.trim();
  }

  /**
   * Generate JSON output
   */
  private generateJSON(): string {
    return JSON.stringify(
      {
        blocks: this.assembledBlocks.map((block) => ({
          id: block.id,
          title: block.title,
          type: block.type,
          content: block.content,
          tags: block.tags,
          metadata: block.fields,
        })),
        toc: this.toc,
        metadata: {
          blockCount: this.assembledBlocks.length,
          assemblyTime: performance.now() - this.startTime,
        },
      },
      null,
      2
    );
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    // Remove HTML tags if present
    const text = content.replace(/<[^>]*>/g, '');
    // Count words
    const words = text.trim().split(/\\s+/);
    return words.filter((word) => word.length > 0).length;
  }

  /**
   * Get the maximum depth reached during traversal
   */
  private getMaxDepth(): number {
    let maxDepth = 0;

    this.assembledBlocks.forEach((block) => {
      const depth = this.getBlockDepth(block);
      maxDepth = Math.max(maxDepth, depth);
    });

    return maxDepth;
  }

  /**
   * Get the depth of a block in the hierarchy
   */
  private getBlockDepth(block: Block): number {
    let depth = 0;
    let currentBlock = block;

    while (currentBlock) {
      const parentEdge = Array.from(this.edges.values()).find(
        (edge) =>
          edge.toBlockId === currentBlock.id &&
          (edge.relationType === StructuralRelation.PARENT_OF ||
            edge.relationType === StructuralRelation.CONTAINS_ORDERED)
      );

      if (parentEdge) {
        const parent = this.blocks.get(parentEdge.fromBlockId);
        if (parent) {
          depth++;
          currentBlock = parent;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return depth;
  }
}
/**
 * LLM-Powered Document Chunking
 *
 * Uses Gemini 3 Flash Preview API to intelligently chunk documents into typed blocks
 * with semantic understanding and relationship extraction.
 *
 * Updated for Gemini 3 Flash Preview (2026) with thinking level control.
 */

import { GoogleGenAI } from '@google/genai';
import {
  Block,
  BlockType,
  Edge,
  IngestionConfig,
  IngestionPlan,
  RelationType,
  StructuralRelation,
  SemanticRelation,
  BlockState,
  ImmutabilityLevel,
  ThinkingLevel,
} from '@/types';
import { nanoid } from 'nanoid';

export interface ChunkingResult {
  plan: IngestionPlan;
  errors?: string[];
}

export class LLMChunker {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Ingest and chunk a document using LLM
   */
  public async ingestDocument(
    source: string | File,
    config: IngestionConfig
  ): Promise<ChunkingResult> {
    try {
      // Get document content
      const content = typeof source === 'string' ? source : await this.readFile(source);

      // Create system prompt for chunking
      const systemPrompt = this.createChunkingPrompt(config);

      // Map ThinkingLevel enum to API string values (uppercase for API)
      const thinkingLevelMap: Record<ThinkingLevel, 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH'> = {
        [ThinkingLevel.MINIMAL]: 'MINIMAL',
        [ThinkingLevel.LOW]: 'LOW',
        [ThinkingLevel.MEDIUM]: 'MEDIUM',
        [ThinkingLevel.HIGH]: 'HIGH',
      };

      // Determine thinking level (default to LOW for document chunking - fast and cheap)
      const thinkingLevel = thinkingLevelMap[config.thinkingLevel || ThinkingLevel.LOW];

      // Call Gemini 3 Flash Preview with thinking level control
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${systemPrompt}\n\nDocument to analyze:\n\n${content}`,
        config: {
          thinkingConfig: {
            thinkingLevel: thinkingLevel as any, // API expects enum type
          },
        },
      });

      const text = response.text || '';

      // Parse LLM response
      const plan = this.parseChunkingResponse(text, content, config);

      return {
        plan,
        errors: plan.warnings,
      };
    } catch (error) {
      console.error('Chunking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        plan: this.createFallbackPlan(source, config),
        errors: [`LLM chunking failed: ${errorMessage}`],
      };
    }
  }

  /**
   * Create the chunking prompt for the LLM
   */
  private createChunkingPrompt(config: IngestionConfig): string {
    return `You are an expert at analyzing documents and breaking them into semantic chunks for a knowledge graph system.

BLOCK TYPES:
- note: General information, context, overviews
- requirement: What must/should be done, prerequisites
- spec: What something is, how it's designed, features
- impl: How to do something, code, instructions
- test: Verification, validation, testing
- data.source: Reference data, platforms, models

RELATIONSHIP TYPES:
Structural (for document assembly):
- PARENT_OF: Hierarchical containment
- CONTAINS_ORDERED: Ordered sequence
- SECTION_OF: Part of a section

Semantic (for knowledge graph):
- IMPLEMENTS: Spec → Implementation
- VERIFIED_BY: Spec → Test
- DEPENDS_ON: General dependency
- REFERENCES: References another block
- LINKS: General connection

YOUR TASK:
1. Read the document carefully
2. Identify logical chunks based on semantic meaning, not just headings
3. Assign appropriate block types to each chunk
4. Identify relationships between chunks
5. Suggest relevant tags
6. Maintain document structure for reassembly

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "manifest": {
    "title": "Document title",
    "summary": "Brief summary",
    "tags": ["tag1", "tag2"]
  },
  "blocks": [
    {
      "id": "unique-id",
      "title": "Block title",
      "type": "block-type",
      "content": "Block content",
      "tags": ["tag1", "tag2"],
      "reasoning": "Why this type was chosen"
    }
  ],
  "edges": [
    {
      "from": "block-id-1",
      "to": "block-id-2",
      "type": "relationship-type",
      "reasoning": "Why this relationship exists"
    }
  ],
  "suggestedTags": [
    {
      "name": "tag-name",
      "description": "What this tag represents",
      "inheritable": true/false
    }
  ]
}

Strategy: ${config.chunkingStrategy}
${config.targetChunkSize ? `Target chunk size: ~${config.targetChunkSize} words` : ''}
${config.extractTags ? 'Extract and suggest tags' : ''}
${config.inferRelationships ? 'Infer semantic relationships' : ''}
${config.generateSummary ? 'Generate summaries for each chunk' : ''}`;
  }

  /**
   * Parse the LLM response into an ingestion plan
   */
  private parseChunkingResponse(
    llmResponse: string,
    originalContent: string,
    config: IngestionConfig
  ): IngestionPlan {
    try {
      // Extract JSON from response (handling markdown code blocks)
      const jsonMatch = llmResponse.match(/```json\\n([\\s\\S]*?)\\n```/) ||
                       llmResponse.match(/{[\\s\\S]*}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in LLM response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // Create manifest block
      const manifestBlock: Block = {
        id: nanoid(),
        type: BlockType.MANIFEST,
        templateId: 'doc.manifest',
        title: parsed.manifest?.title || 'Untitled Document',
        content: parsed.manifest?.summary || '',
        tags: [],
        fields: {
          originalSource: typeof config.source === 'string' ? config.source : 'file',
          ingestionDate: new Date().toISOString(),
        },
        state: BlockState.DRAFT,
        immutability: ImmutabilityLevel.MUTABLE,
        createdBy: 'llm-chunker',
        createdAt: new Date(),
        updatedBy: 'llm-chunker',
        updatedAt: new Date(),
        version: 1,
      };

      // Create blocks from chunks
      const blocks: Block[] = [manifestBlock];
      const blockIdMap = new Map<string, string>();
      blockIdMap.set('manifest', manifestBlock.id);

      parsed.blocks?.forEach((chunk: any, index: number) => {
        const blockId = nanoid();
        blockIdMap.set(chunk.id, blockId);

        const block: Block = {
          id: blockId,
          type: this.mapBlockType(chunk.type),
          templateId: this.getTemplateForType(chunk.type),
          title: chunk.title || `Chunk ${index + 1}`,
          content: chunk.content || '',
          tags: [],
          fields: {
            reasoning: chunk.reasoning,
            originalIndex: index,
          },
          state: BlockState.DRAFT,
          immutability: ImmutabilityLevel.MUTABLE,
          createdBy: 'llm-chunker',
          createdAt: new Date(),
          updatedBy: 'llm-chunker',
          updatedAt: new Date(),
          version: 1,
        };

        blocks.push(block);
      });

      // Create edges
      const edges: Edge[] = [];

      // Add structural edges (manifest → chunks)
      blocks.slice(1).forEach((block, index) => {
        edges.push({
          id: nanoid(),
          fromBlockId: manifestBlock.id,
          toBlockId: block.id,
          relationType: StructuralRelation.CONTAINS_ORDERED,
          order: index,
          createdBy: 'llm-chunker',
          createdAt: new Date(),
        });
      });

      // Add semantic edges from LLM
      parsed.edges?.forEach((edge: any) => {
        const fromId = blockIdMap.get(edge.from);
        const toId = blockIdMap.get(edge.to);

        if (fromId && toId) {
          edges.push({
            id: nanoid(),
            fromBlockId: fromId,
            toBlockId: toId,
            relationType: this.mapRelationType(edge.type),
            label: edge.reasoning,
            createdBy: 'llm-chunker',
            createdAt: new Date(),
          });
        }
      });

      // Create ingestion plan
      const plan: IngestionPlan = {
        id: nanoid(),
        source: originalContent.substring(0, 100),
        manifest: manifestBlock,
        blocks,
        edges,
        suggestedTags: parsed.suggestedTags || [],
        confidence: this.calculateConfidence(parsed),
        reasoning: this.extractReasoningPoints(parsed),
        warnings: this.validatePlan(blocks, edges),
        status: 'pending',
      };

      return plan;
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      return this.createFallbackPlan(originalContent, config);
    }
  }

  /**
   * Map string block type to enum
   */
  private mapBlockType(type: string): BlockType {
    const typeMap: Record<string, BlockType> = {
      'note': BlockType.NOTE,
      'requirement': BlockType.REQUIREMENT,
      'spec': BlockType.SPEC,
      'impl': BlockType.IMPLEMENTATION,
      'implementation': BlockType.IMPLEMENTATION,
      'test': BlockType.TEST,
      'data': BlockType.DATA_SOURCE,
      'data.source': BlockType.DATA_SOURCE,
      'manifest': BlockType.MANIFEST,
    };

    return typeMap[type.toLowerCase()] || BlockType.NOTE;
  }

  /**
   * Get template ID for block type
   */
  private getTemplateForType(type: string): string {
    const templateMap: Record<string, string> = {
      'note': 'default',
      'requirement': 'requirement',
      'spec': 'specification',
      'impl': 'implementation',
      'test': 'test',
      'data.source': 'data-source',
      'manifest': 'doc.manifest',
    };

    return templateMap[type.toLowerCase()] || 'default';
  }

  /**
   * Map string relation type to enum
   */
  private mapRelationType(type: string): RelationType {
    const typeMap: Record<string, RelationType> = {
      'PARENT_OF': StructuralRelation.PARENT_OF,
      'CONTAINS_ORDERED': StructuralRelation.CONTAINS_ORDERED,
      'SECTION_OF': StructuralRelation.SECTION_OF,
      'IMPLEMENTS': SemanticRelation.IMPLEMENTS,
      'VERIFIED_BY': SemanticRelation.VERIFIED_BY,
      'DEPENDS_ON': SemanticRelation.DEPENDS_ON,
      'REFERENCES': SemanticRelation.REFERENCES,
      'LINKS': SemanticRelation.LINKS,
    };

    return typeMap[type.toUpperCase()] || SemanticRelation.LINKS;
  }

  /**
   * Calculate confidence score for the plan
   */
  private calculateConfidence(parsed: any): number {
    let score = 0;
    let factors = 0;

    // Check if blocks were created
    if (parsed.blocks && parsed.blocks.length > 0) {
      score += 0.3;
      factors++;
    }

    // Check if relationships were identified
    if (parsed.edges && parsed.edges.length > 0) {
      score += 0.2;
      factors++;
    }

    // Check if reasoning was provided
    const hasReasoning = parsed.blocks?.some((b: any) => b.reasoning);
    if (hasReasoning) {
      score += 0.2;
      factors++;
    }

    // Check if tags were suggested
    if (parsed.suggestedTags && parsed.suggestedTags.length > 0) {
      score += 0.1;
      factors++;
    }

    // Check block type diversity
    const types = new Set(parsed.blocks?.map((b: any) => b.type));
    if (types.size > 1) {
      score += 0.2;
      factors++;
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Extract reasoning points from the parsed response
   */
  private extractReasoningPoints(parsed: any): string[] {
    const points: string[] = [];

    // Add block reasoning
    parsed.blocks?.forEach((block: any) => {
      if (block.reasoning) {
        points.push(`${block.title}: ${block.reasoning}`);
      }
    });

    // Add edge reasoning
    parsed.edges?.forEach((edge: any) => {
      if (edge.reasoning) {
        points.push(`Relationship: ${edge.reasoning}`);
      }
    });

    return points;
  }

  /**
   * Validate the ingestion plan
   */
  private validatePlan(blocks: Block[], edges: Edge[]): string[] {
    const warnings: string[] = [];

    // Check for orphaned blocks
    const connectedBlocks = new Set<string>();
    edges.forEach((edge) => {
      connectedBlocks.add(edge.fromBlockId);
      connectedBlocks.add(edge.toBlockId);
    });

    blocks.forEach((block) => {
      if (block.type !== BlockType.MANIFEST && !connectedBlocks.has(block.id)) {
        warnings.push(`Block "${block.title}" has no relationships`);
      }
    });

    // Check for very small or very large blocks
    blocks.forEach((block) => {
      const wordCount = block.content.split(/\\s+/).length;
      if (wordCount < 10 && block.type !== BlockType.MANIFEST) {
        warnings.push(`Block "${block.title}" is very short (${wordCount} words)`);
      }
      if (wordCount > 1000) {
        warnings.push(`Block "${block.title}" is very long (${wordCount} words)`);
      }
    });

    return warnings;
  }

  /**
   * Create a fallback plan using simple heuristics
   */
  private createFallbackPlan(
    source: string | File,
    config: IngestionConfig
  ): IngestionPlan {
    const content = typeof source === 'string' ? source : '';

    // Simple paragraph-based chunking
    const paragraphs = content.split(/\\n\\n+/);

    const manifestBlock: Block = {
      id: nanoid(),
      type: BlockType.MANIFEST,
      templateId: 'doc.manifest',
      title: 'Imported Document',
      content: 'Document imported using fallback chunking',
      tags: [],
      fields: {},
      state: BlockState.DRAFT,
      immutability: ImmutabilityLevel.MUTABLE,
      createdBy: 'fallback-chunker',
      createdAt: new Date(),
      updatedBy: 'fallback-chunker',
      updatedAt: new Date(),
      version: 1,
    };

    const blocks: Block[] = [manifestBlock];
    const edges: Edge[] = [];

    paragraphs.forEach((para, index) => {
      if (para.trim().length > 0) {
        const block: Block = {
          id: nanoid(),
          type: BlockType.NOTE,
          templateId: 'default',
          title: `Paragraph ${index + 1}`,
          content: para.trim(),
          tags: [],
          fields: {},
          state: BlockState.DRAFT,
          immutability: ImmutabilityLevel.MUTABLE,
          createdBy: 'fallback-chunker',
          createdAt: new Date(),
          updatedBy: 'fallback-chunker',
          updatedAt: new Date(),
          version: 1,
        };

        blocks.push(block);

        edges.push({
          id: nanoid(),
          fromBlockId: manifestBlock.id,
          toBlockId: block.id,
          relationType: StructuralRelation.CONTAINS_ORDERED,
          order: index,
          createdBy: 'fallback-chunker',
          createdAt: new Date(),
        });
      }
    });

    return {
      id: nanoid(),
      source: content.substring(0, 100),
      manifest: manifestBlock,
      blocks,
      edges,
      suggestedTags: [],
      confidence: 0.3,
      reasoning: ['Used fallback paragraph-based chunking'],
      warnings: ['LLM chunking unavailable, used simple fallback'],
      status: 'pending',
    };
  }

  /**
   * Read file content
   */
  private async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}
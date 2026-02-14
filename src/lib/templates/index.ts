/**
 * Template System
 *
 * Defines templates for different block types with their required fields
 * and default configurations.
 */

import { Template, BlockType, StructuralRelation, SemanticRelation } from '@/types';

// Default templates for each block type
export const defaultTemplates = new Map<string, Template>([
  [
    'default',
    {
      id: 'default',
      name: 'Default Block',
      description: 'Basic block template with minimal structure',
      category: 'general',
      requiredFields: [],
      optionalFields: [
        {
          name: 'notes',
          type: 'string',
          label: 'Notes',
          description: 'Additional notes or comments',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [...Object.values(StructuralRelation), ...Object.values(SemanticRelation)],
        incoming: [...Object.values(StructuralRelation), ...Object.values(SemanticRelation)],
      },
      inheritTags: true,
      defaultView: 'card',
      icon: '📄',
      color: '#6B7280',
      validators: [],
    },
  ],

  [
    'requirement',
    {
      id: 'requirement',
      name: 'Requirement',
      description: 'Template for project requirements and specifications',
      category: 'planning',
      requiredFields: [
        {
          name: 'priority',
          type: 'string',
          label: 'Priority',
          description: 'Requirement priority level',
          required: true,
          validation: {
            enum: ['low', 'medium', 'high', 'critical'],
          },
        },
        {
          name: 'acceptanceCriteria',
          type: 'array',
          label: 'Acceptance Criteria',
          description: 'Criteria for requirement completion',
          required: true,
        },
      ],
      optionalFields: [
        {
          name: 'stakeholder',
          type: 'string',
          label: 'Stakeholder',
          description: 'Primary stakeholder for this requirement',
          required: false,
        },
        {
          name: 'deadline',
          type: 'date',
          label: 'Deadline',
          description: 'Target completion date',
          required: false,
        },
        {
          name: 'rationale',
          type: 'string',
          label: 'Rationale',
          description: 'Why this requirement exists',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [
          SemanticRelation.IMPLEMENTS,
          SemanticRelation.DEPENDS_ON,
          StructuralRelation.PARENT_OF,
        ],
        incoming: [
          SemanticRelation.IMPLEMENTS,
          SemanticRelation.VERIFIED_BY,
          StructuralRelation.PARENT_OF,
        ],
      },
      inheritTags: true,
      defaultView: 'card',
      icon: '📋',
      color: '#FFA500',
      validators: [
        (block) => {
          const priority = block.fields.priority;
          if (!priority || !['low', 'medium', 'high', 'critical'].includes(priority)) {
            return {
              valid: false,
              errors: ['Priority must be one of: low, medium, high, critical'],
            };
          }
          return { valid: true };
        },
      ],
    },
  ],

  [
    'specification',
    {
      id: 'specification',
      name: 'Specification',
      description: 'Technical specification template',
      category: 'technical',
      requiredFields: [
        {
          name: 'interfaces',
          type: 'array',
          label: 'Interfaces',
          description: 'API or interface definitions',
          required: true,
        },
        {
          name: 'constraints',
          type: 'array',
          label: 'Constraints',
          description: 'Technical constraints and limitations',
          required: true,
        },
      ],
      optionalFields: [
        {
          name: 'decisions',
          type: 'array',
          label: 'Design Decisions',
          description: 'Key design decisions made',
          required: false,
        },
        {
          name: 'alternatives',
          type: 'array',
          label: 'Alternatives Considered',
          description: 'Alternative approaches that were considered',
          required: false,
        },
        {
          name: 'risks',
          type: 'array',
          label: 'Risks',
          description: 'Identified risks and mitigation strategies',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [
          SemanticRelation.IMPLEMENTS,
          SemanticRelation.DEPENDS_ON,
          StructuralRelation.PARENT_OF,
        ],
        incoming: [
          SemanticRelation.IMPLEMENTS,
          SemanticRelation.VERIFIED_BY,
          SemanticRelation.REFERENCES,
        ],
      },
      inheritTags: true,
      defaultView: 'card',
      icon: '📐',
      color: '#3B82F6',
      validators: [],
    },
  ],

  [
    'implementation',
    {
      id: 'implementation',
      name: 'Implementation',
      description: 'Code implementation template',
      category: 'technical',
      requiredFields: [
        {
          name: 'language',
          type: 'string',
          label: 'Language',
          description: 'Programming language',
          required: true,
        },
        {
          name: 'framework',
          type: 'string',
          label: 'Framework',
          description: 'Framework or library used',
          required: true,
        },
      ],
      optionalFields: [
        {
          name: 'codeReference',
          type: 'string',
          label: 'Code Reference',
          description: 'Link or reference to code',
          required: false,
        },
        {
          name: 'dependencies',
          type: 'array',
          label: 'Dependencies',
          description: 'External dependencies',
          required: false,
        },
        {
          name: 'performance',
          type: 'object',
          label: 'Performance Metrics',
          description: 'Performance characteristics',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [
          SemanticRelation.DEPENDS_ON,
          SemanticRelation.REFERENCES,
          StructuralRelation.PARENT_OF,
        ],
        incoming: [
          SemanticRelation.VERIFIED_BY,
          SemanticRelation.DEPENDS_ON,
          StructuralRelation.PARENT_OF,
        ],
      },
      inheritTags: true,
      defaultView: 'card',
      icon: '💻',
      color: '#10B981',
      validators: [],
    },
  ],

  [
    'test',
    {
      id: 'test',
      name: 'Test',
      description: 'Test case template',
      category: 'quality',
      requiredFields: [
        {
          name: 'testType',
          type: 'string',
          label: 'Test Type',
          description: 'Type of test',
          required: true,
          validation: {
            enum: ['unit', 'integration', 'e2e', 'performance', 'security'],
          },
        },
        {
          name: 'expectedResult',
          type: 'string',
          label: 'Expected Result',
          description: 'Expected test outcome',
          required: true,
        },
      ],
      optionalFields: [
        {
          name: 'actualResult',
          type: 'string',
          label: 'Actual Result',
          description: 'Actual test outcome',
          required: false,
        },
        {
          name: 'testData',
          type: 'object',
          label: 'Test Data',
          description: 'Test data and fixtures',
          required: false,
        },
        {
          name: 'coverage',
          type: 'number',
          label: 'Coverage',
          description: 'Code coverage percentage',
          required: false,
          validation: {
            min: 0,
            max: 100,
          },
        },
      ],
      allowedRelations: {
        outgoing: [SemanticRelation.VERIFIED_BY, StructuralRelation.PARENT_OF],
        incoming: [SemanticRelation.DEPENDS_ON, StructuralRelation.PARENT_OF],
      },
      inheritTags: true,
      defaultView: 'card',
      icon: '🧪',
      color: '#B5FF63',
      validators: [],
    },
  ],

  [
    'doc.manifest',
    {
      id: 'doc.manifest',
      name: 'Document Manifest',
      description: 'Root block for document assembly',
      category: 'document',
      requiredFields: [],
      optionalFields: [
        {
          name: 'summary',
          type: 'string',
          label: 'Summary',
          description: 'Document summary',
          required: false,
        },
        {
          name: 'author',
          type: 'string',
          label: 'Author',
          description: 'Document author',
          required: false,
        },
        {
          name: 'version',
          type: 'string',
          label: 'Version',
          description: 'Document version',
          required: false,
        },
        {
          name: 'assemblyRules',
          type: 'object',
          label: 'Assembly Rules',
          description: 'Rules for document assembly',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [StructuralRelation.CONTAINS_ORDERED, StructuralRelation.PARENT_OF],
        incoming: [SemanticRelation.REFERENCES],
      },
      inheritTags: true,
      defaultView: 'card',
      icon: '📚',
      color: '#8B5CF6',
      validators: [],
    },
  ],

  [
    'view.assembler',
    {
      id: 'view.assembler',
      name: 'View Assembler',
      description: 'Template for dynamic view assembly',
      category: 'view',
      requiredFields: [
        {
          name: 'traversalProfile',
          type: 'object',
          label: 'Traversal Profile',
          description: 'How to traverse the graph',
          required: true,
        },
      ],
      optionalFields: [
        {
          name: 'filters',
          type: 'array',
          label: 'Filters',
          description: 'Filters to apply',
          required: false,
        },
        {
          name: 'sortOrder',
          type: 'string',
          label: 'Sort Order',
          description: 'How to sort results',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [StructuralRelation.PARENT_OF, SemanticRelation.REFERENCES],
        incoming: [SemanticRelation.REFERENCES],
      },
      inheritTags: false,
      defaultView: 'compact',
      icon: '🔄',
      color: '#F59E0B',
      validators: [],
    },
  ],

  [
    'dashboard.block',
    {
      id: 'dashboard.block',
      name: 'Dashboard Block',
      description: 'Widget block for dashboards',
      category: 'dashboard',
      requiredFields: [
        {
          name: 'widgetType',
          type: 'string',
          label: 'Widget Type',
          description: 'Type of dashboard widget',
          required: true,
        },
      ],
      optionalFields: [
        {
          name: 'config',
          type: 'object',
          label: 'Configuration',
          description: 'Widget configuration',
          required: false,
        },
        {
          name: 'refreshInterval',
          type: 'number',
          label: 'Refresh Interval',
          description: 'Auto-refresh interval in seconds',
          required: false,
        },
      ],
      allowedRelations: {
        outgoing: [SemanticRelation.REFERENCES],
        incoming: [SemanticRelation.REFERENCES],
      },
      inheritTags: false,
      defaultView: 'compact',
      icon: '📊',
      color: '#EC4899',
      validators: [],
    },
  ],
]);

// Template factory
export class TemplateFactory {
  private templates: Map<string, Template>;

  constructor() {
    this.templates = new Map(defaultTemplates);
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  /**
   * Get template for a block type
   */
  getTemplateForType(type: BlockType): Template {
    const templateMap: Record<BlockType, string> = {
      [BlockType.NOTE]: 'default',
      [BlockType.REQUIREMENT]: 'requirement',
      [BlockType.SPEC]: 'specification',
      [BlockType.IMPLEMENTATION]: 'implementation',
      [BlockType.TEST]: 'test',
      [BlockType.DATA_SOURCE]: 'default',
      [BlockType.MANIFEST]: 'doc.manifest',
      [BlockType.ASSEMBLER]: 'view.assembler',
      [BlockType.DASHBOARD_BLOCK]: 'dashboard.block',
      [BlockType.FILTER]: 'default',
    };

    const templateId = templateMap[type] || 'default';
    return this.templates.get(templateId) || this.templates.get('default')!;
  }

  /**
   * Register a custom template
   */
  registerTemplate(template: Template): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): Template[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category);
  }

  /**
   * Validate a block against its template
   */
  validateBlock(block: any, templateId: string): { valid: boolean; errors: string[] } {
    const template = this.templates.get(templateId);
    if (!template) {
      return { valid: false, errors: ['Template not found'] };
    }

    const errors: string[] = [];

    // Check required fields
    template.requiredFields.forEach((field) => {
      if (!(field.name in block.fields) || block.fields[field.name] === undefined) {
        errors.push(`Required field '${field.label}' is missing`);
      }
    });

    // Run custom validators
    template.validators?.forEach((validator) => {
      const result = validator(block);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const templateFactory = new TemplateFactory();
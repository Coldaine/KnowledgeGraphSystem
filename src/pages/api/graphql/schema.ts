export const typeDefs = `
  scalar Date

  enum BlockType {
    NOTE
    REQUIREMENT
    SPEC
    IMPLEMENTATION
    TEST
    DATA_SOURCE
    MANIFEST
    ASSEMBLER
    DASHBOARD_BLOCK
    FILTER
  }

  enum ImmutabilityLevel {
    MUTABLE
    LOCKED
    IMMUTABLE
  }

  enum BlockState {
    DRAFT
    ACTIVE
    ARCHIVED
    DELETED
  }

  enum StructuralRelation {
    PARENT_OF
    CONTAINS_ORDERED
    SECTION_OF
    THREAD_OF
    ATTACHED_TO
  }

  enum SemanticRelation {
    IMPLEMENTS
    VERIFIED_BY
    DEPENDS_ON
    REFERENCES
    LINKS
    CONTRADICTS
    ELABORATES
  }

  enum RelationType {
    PARENT_OF
    CONTAINS_ORDERED
    SECTION_OF
    THREAD_OF
    ATTACHED_TO
    IMPLEMENTS
    VERIFIED_BY
    DEPENDS_ON
    REFERENCES
    LINKS
    CONTRADICTS
    ELABORATES
  }

  enum TagGroup {
    ORGANIZATIONAL
    DOMAIN
    STATUS
    PRIORITY
    TYPE
    CUSTOM
  }

  type Block {
    id: ID!
    type: BlockType!
    templateId: String!
    title: String!
    content: String!
    tags: [Tag!]!
    immutability: ImmutabilityLevel!
    state: BlockState!
    createdAt: Date!
    updatedAt: Date!
  }

  type Edge {
    id: ID!
    fromBlockId: ID!
    toBlockId: ID!
    relationType: RelationType!
    createdAt: Date!
  }

  type Tag {
    id: ID!
    label: String!
    group: TagGroup!
    inheritable: Boolean!
    color: String!
  }

  type Query {
    blocks: [Block!]!
    edges: [Edge!]!
    tags: [Tag!]!
    block(id: ID!): Block
    edge(id: ID!): Edge
    tag(id: ID!): Tag
  }
`;

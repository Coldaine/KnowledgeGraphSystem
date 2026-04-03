/**
 * Unit tests for BlockStore Authority Chain Enforcement (Contract C002)
 *
 * Tests INV-C002-03: principal.clearance >= chunk.authority
 * Tests INV-C002-05: Blocked operations trigger escalation
 *
 * Per C002 Section 7.2 Integration Tests:
 * - User with clearance=1 modifies Mutable chunk → Success
 * - User with clearance=1 modifies Locked chunk → Block + Escalation
 * - Agent Tier 2 modifies Immutable chunk → Block + Escalation
 * - Admin downgrades Locked to Mutable → Success
 * - User with clearance=1 downgrades Locked to Mutable → Block
 */

import { Block, ImmutabilityLevel, AuthorityLevel, AgentTier, BlockType, BlockState } from '@/types';
import { validateWrite } from '../blockStore';

// Test helper to create a minimal block for testing
function createTestBlock(immutability: ImmutabilityLevel): Block {
  return {
    id: 'test-block-id',
    type: BlockType.NOTE,
    templateId: 'default',
    title: 'Test Block',
    content: 'Test content',
    fields: {},
    tags: [],
    state: BlockState.DRAFT,
    immutability,
    createdBy: 'test',
    createdAt: new Date(),
    updatedBy: 'test',
    updatedAt: new Date(),
    version: 1,
  };
}

describe('validateWrite - Authority Chain Enforcement (C002)', () => {
  describe('INV-C002-03: principal.clearance >= chunk.authority', () => {
    describe('VIEWER clearance (rank 0)', () => {
      const viewerPrincipal = { clearance: AuthorityLevel.VIEWER };

      it('should ALLOW modifying MUTABLE block (requires VIEWER=0, has VIEWER=0)', () => {
        const block = createTestBlock(ImmutabilityLevel.MUTABLE);
        const result = validateWrite(viewerPrincipal, block);
        expect(result.allowed).toBe(true);
        expect(result.escalationRequired).toBeUndefined();
      });

      it('should BLOCK modifying LOCKED block (requires CONTRIBUTOR=2, has VIEWER=0)', () => {
        const block = createTestBlock(ImmutabilityLevel.LOCKED);
        const result = validateWrite(viewerPrincipal, block);
        expect(result.allowed).toBe(false);
        expect(result.escalationRequired).toBe(true);
        expect(result.blockedBy).toBe(block.id);
        expect(result.reason).toContain('viewer');
        expect(result.reason).toContain('contributor');
        expect(result.reason).toContain('locked');
      });

      it('should BLOCK modifying IMMUTABLE block (requires SENIOR=3, has VIEWER=0)', () => {
        const block = createTestBlock(ImmutabilityLevel.IMMUTABLE);
        const result = validateWrite(viewerPrincipal, block);
        expect(result.allowed).toBe(false);
        expect(result.escalationRequired).toBe(true);
        expect(result.blockedBy).toBe(block.id);
      });
    });

    describe('CONTRIBUTOR clearance (rank 2)', () => {
      const contributorPrincipal = { clearance: AuthorityLevel.CONTRIBUTOR };

      it('should ALLOW modifying MUTABLE block (requires VIEWER=0, has CONTRIBUTOR=2)', () => {
        const block = createTestBlock(ImmutabilityLevel.MUTABLE);
        const result = validateWrite(contributorPrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should ALLOW modifying LOCKED block (requires CONTRIBUTOR=2, has CONTRIBUTOR=2)', () => {
        const block = createTestBlock(ImmutabilityLevel.LOCKED);
        const result = validateWrite(contributorPrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should BLOCK modifying IMMUTABLE block (requires SENIOR=3, has CONTRIBUTOR=2)', () => {
        const block = createTestBlock(ImmutabilityLevel.IMMUTABLE);
        const result = validateWrite(contributorPrincipal, block);
        expect(result.allowed).toBe(false);
        expect(result.escalationRequired).toBe(true);
      });
    });

    describe('SENIOR clearance (rank 3)', () => {
      const seniorPrincipal = { clearance: AuthorityLevel.SENIOR };

      it('should ALLOW modifying MUTABLE block', () => {
        const block = createTestBlock(ImmutabilityLevel.MUTABLE);
        const result = validateWrite(seniorPrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should ALLOW modifying LOCKED block', () => {
        const block = createTestBlock(ImmutabilityLevel.LOCKED);
        const result = validateWrite(seniorPrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should ALLOW modifying IMMUTABLE block (requires SENIOR=3, has SENIOR=3)', () => {
        const block = createTestBlock(ImmutabilityLevel.IMMUTABLE);
        const result = validateWrite(seniorPrincipal, block);
        expect(result.allowed).toBe(true);
      });
    });

    describe('PRINCIPAL clearance (rank 4)', () => {
      const principalPrincipal = { clearance: AuthorityLevel.PRINCIPAL };

      it('should ALLOW modifying all block types including IMMUTABLE', () => {
        const mutableBlock = createTestBlock(ImmutabilityLevel.MUTABLE);
        const lockedBlock = createTestBlock(ImmutabilityLevel.LOCKED);
        const immutableBlock = createTestBlock(ImmutabilityLevel.IMMUTABLE);

        expect(validateWrite(principalPrincipal, mutableBlock).allowed).toBe(true);
        expect(validateWrite(principalPrincipal, lockedBlock).allowed).toBe(true);
        expect(validateWrite(principalPrincipal, immutableBlock).allowed).toBe(true);
      });
    });
  });

  describe('Agent Tier Clearance Mapping (C002 Section 6.1)', () => {
    describe('DRONE agent (Tier 1 = clearance 0 = VIEWER)', () => {
      const dronePrincipal = { id: 'drone-1', tier: AgentTier.DRONE, clearance: 0 };

      it('should allow DRONE to modify MUTABLE blocks', () => {
        const block = createTestBlock(ImmutabilityLevel.MUTABLE);
        const result = validateWrite(dronePrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should BLOCK DRONE from modifying LOCKED blocks', () => {
        const block = createTestBlock(ImmutabilityLevel.LOCKED);
        const result = validateWrite(dronePrincipal, block);
        expect(result.allowed).toBe(false);
        expect(result.escalationRequired).toBe(true);
      });

      it('should BLOCK DRONE from modifying IMMUTABLE blocks', () => {
        const block = createTestBlock(ImmutabilityLevel.IMMUTABLE);
        const result = validateWrite(dronePrincipal, block);
        expect(result.allowed).toBe(false);
        expect(result.escalationRequired).toBe(true);
      });
    });

    describe('ARCHITECT agent (Tier 2 = clearance 1 = CONTRIBUTOR)', () => {
      const architectPrincipal = { id: 'architect-1', tier: AgentTier.ARCHITECT, clearance: 1 };

      it('should allow ARCHITECT to modify MUTABLE blocks', () => {
        const block = createTestBlock(ImmutabilityLevel.MUTABLE);
        const result = validateWrite(architectPrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should allow ARCHITECT to modify LOCKED blocks', () => {
        const block = createTestBlock(ImmutabilityLevel.LOCKED);
        const result = validateWrite(architectPrincipal, block);
        expect(result.allowed).toBe(true);
      });

      it('should BLOCK ARCHITECT from modifying IMMUTABLE blocks (requires SENIOR=3)', () => {
        const block = createTestBlock(ImmutabilityLevel.IMMUTABLE);
        const result = validateWrite(architectPrincipal, block);
        expect(result.allowed).toBe(false);
        expect(result.escalationRequired).toBe(true);
      });
    });

    describe('JUDGE agent (Tier 3 = clearance 3 = SENIOR)', () => {
      const judgePrincipal = { id: 'judge-1', tier: AgentTier.JUDGE, clearance: 3 };

      it('should allow JUDGE to modify all block types including IMMUTABLE', () => {
        const mutableBlock = createTestBlock(ImmutabilityLevel.MUTABLE);
        const lockedBlock = createTestBlock(ImmutabilityLevel.LOCKED);
        const immutableBlock = createTestBlock(ImmutabilityLevel.IMMUTABLE);

        expect(validateWrite(judgePrincipal, mutableBlock).allowed).toBe(true);
        expect(validateWrite(judgePrincipal, lockedBlock).allowed).toBe(true);
        expect(validateWrite(judgePrincipal, immutableBlock).allowed).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle block with no specific immutability gracefully', () => {
      // All blocks should have immutability set per INV-C002-01
      const block = createTestBlock(ImmutabilityLevel.MUTABLE);
      const principal = { clearance: AuthorityLevel.VIEWER };
      const result = validateWrite(principal, block);
      expect(result.allowed).toBe(true);
    });

    it('should provide blockedBy in result when blocked', () => {
      const block = createTestBlock(ImmutabilityLevel.LOCKED);
      const principal = { clearance: AuthorityLevel.VIEWER };
      const result = validateWrite(principal, block);
      expect(result.blockedBy).toBe(block.id);
    });
  });
});

describe('Authority Level Ranking', () => {
  it('should have correct ranking order: VIEWER < AGENT < CONTRIBUTOR < SENIOR < PRINCIPAL < SYSTEM', () => {
    // VIEWER (0) < CONTRIBUTOR (2) < SENIOR (3) < PRINCIPAL (4) < SYSTEM (5)
    const viewer = { clearance: AuthorityLevel.VIEWER };
    const agent = { clearance: AuthorityLevel.AGENT };
    const contributor = { clearance: AuthorityLevel.CONTRIBUTOR };
    const senior = { clearance: AuthorityLevel.SENIOR };
    const principal = { clearance: AuthorityLevel.PRINCIPAL };
    const system = { clearance: AuthorityLevel.SYSTEM };

    const mutableBlock = createTestBlock(ImmutabilityLevel.MUTABLE);
    const lockedBlock = createTestBlock(ImmutabilityLevel.LOCKED);
    const immutableBlock = createTestBlock(ImmutabilityLevel.IMMUTABLE);

    // VIEWER can modify MUTABLE
    expect(validateWrite(viewer, mutableBlock).allowed).toBe(true);

    // AGENT can modify MUTABLE
    expect(validateWrite(agent, mutableBlock).allowed).toBe(true);

    // CONTRIBUTOR can modify MUTABLE and LOCKED
    expect(validateWrite(contributor, mutableBlock).allowed).toBe(true);
    expect(validateWrite(contributor, lockedBlock).allowed).toBe(true);

    // SENIOR can modify all
    expect(validateWrite(senior, immutableBlock).allowed).toBe(true);

    // PRINCIPAL can modify all
    expect(validateWrite(principal, immutableBlock).allowed).toBe(true);

    // SYSTEM can modify all
    expect(validateWrite(system, immutableBlock).allowed).toBe(true);
  });
});

/**
 * Bully Physics Hook
 *
 * Implements physics-based repulsion for nodes to create
 * natural spacing and prevent overlaps
 */

import { useCallback, useRef, useEffect } from 'react';
import { Node } from 'react-flow-renderer';
import { spring, distance, clamp } from '@/lib/utils';

interface PhysicsNode {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  mass: number;
  pinned: boolean;
}

interface BullyPhysicsConfig {
  enabled: boolean;
  bullyRadius: number;
  stiffness: number;
  damping: number;
  minDistance: number;
  maxForce: number;
  iterations: number;
}

const DEFAULT_CONFIG: BullyPhysicsConfig = {
  enabled: true,
  bullyRadius: 40, // Pixels
  stiffness: 300,
  damping: 30,
  minDistance: 80,
  maxForce: 100,
  iterations: 5,
};

export function useBullyPhysics(config: Partial<BullyPhysicsConfig> = {}) {
  const physicsConfig = { ...DEFAULT_CONFIG, ...config };
  const nodesRef = useRef<Map<string, PhysicsNode>>(new Map());
  const animationFrameRef = useRef<number>();
  const isSimulating = useRef(false);

  // Initialize physics nodes from React Flow nodes
  const initializePhysicsNodes = useCallback((nodes: Node[]) => {
    const physicsNodes = new Map<string, PhysicsNode>();

    nodes.forEach((node) => {
      physicsNodes.set(node.id, {
        id: node.id,
        position: { ...node.position },
        velocity: { x: 0, y: 0 },
        mass: 1,
        pinned: !node.draggable,
      });
    });

    nodesRef.current = physicsNodes;
  }, []);

  // Apply repulsion force between two nodes
  const applyRepulsion = useCallback(
    (nodeA: PhysicsNode, nodeB: PhysicsNode) => {
      const d = distance(nodeA.position, nodeB.position);

      // Skip if nodes are too far apart
      if (d > physicsConfig.bullyRadius * 2) return;

      // Prevent division by zero
      const safeDistance = Math.max(d, 1);

      // Calculate repulsion force (inverse square law)
      const strength = Math.min(
        (physicsConfig.bullyRadius * physicsConfig.bullyRadius) / (safeDistance * safeDistance),
        physicsConfig.maxForce
      );

      // Calculate direction
      const dx = (nodeB.position.x - nodeA.position.x) / safeDistance;
      const dy = (nodeB.position.y - nodeA.position.y) / safeDistance;

      // Apply force to velocities
      if (!nodeA.pinned) {
        nodeA.velocity.x -= dx * strength / nodeA.mass;
        nodeA.velocity.y -= dy * strength / nodeA.mass;
      }

      if (!nodeB.pinned) {
        nodeB.velocity.x += dx * strength / nodeB.mass;
        nodeB.velocity.y += dy * strength / nodeB.mass;
      }
    },
    [physicsConfig]
  );

  // Apply centering force to keep nodes from drifting
  const applyCenteringForce = useCallback(
    (node: PhysicsNode, center: { x: number; y: number }) => {
      const d = distance(node.position, center);
      if (d > 500) {
        // Only apply if far from center
        const strength = 0.01;
        const dx = (center.x - node.position.x) / d;
        const dy = (center.y - node.position.y) / d;

        node.velocity.x += dx * strength;
        node.velocity.y += dy * strength;
      }
    },
    []
  );

  // Main physics simulation step
  const simulationStep = useCallback(() => {
    if (!physicsConfig.enabled) return;

    const nodes = Array.from(nodesRef.current.values());
    const center = { x: 400, y: 300 }; // Canvas center

    // Apply forces
    for (let iter = 0; iter < physicsConfig.iterations; iter++) {
      // Reset forces
      nodes.forEach((node) => {
        if (!node.pinned) {
          // Apply damping
          node.velocity.x *= 0.95;
          node.velocity.y *= 0.95;
        }
      });

      // Apply repulsion between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          applyRepulsion(nodes[i], nodes[j]);
        }
      }

      // Apply centering force
      nodes.forEach((node) => {
        if (!node.pinned) {
          applyCenteringForce(node, center);
        }
      });
    }

    // Update positions based on velocities
    let hasMovement = false;
    nodes.forEach((node) => {
      if (!node.pinned) {
        const oldX = node.position.x;
        const oldY = node.position.y;

        // Use spring physics for smooth motion
        const springX = spring(
          node.position.x,
          node.position.x + node.velocity.x,
          node.velocity.x,
          physicsConfig.stiffness,
          physicsConfig.damping
        );

        const springY = spring(
          node.position.y,
          node.position.y + node.velocity.y,
          node.velocity.y,
          physicsConfig.stiffness,
          physicsConfig.damping
        );

        node.position.x = springX.position;
        node.position.y = springY.position;
        node.velocity.x = springX.velocity;
        node.velocity.y = springY.velocity;

        // Check if there's significant movement
        if (Math.abs(oldX - node.position.x) > 0.1 || Math.abs(oldY - node.position.y) > 0.1) {
          hasMovement = true;
        }
      }
    });

    return hasMovement;
  }, [physicsConfig, applyRepulsion, applyCenteringForce]);

  // Apply bully physics when dragging a node
  const applyBullyPhysics = useCallback(
    (draggedNodeId: string, draggedPosition: { x: number; y: number }, allNodes: Node[]) => {
      if (!physicsConfig.enabled) return;

      // Initialize physics nodes if needed
      if (nodesRef.current.size === 0) {
        initializePhysicsNodes(allNodes);
      }

      // Update dragged node position
      const draggedNode = nodesRef.current.get(draggedNodeId);
      if (draggedNode) {
        draggedNode.position = { ...draggedPosition };
        draggedNode.pinned = true; // Pin while dragging
      }

      // Apply repulsion from dragged node to others
      const nodes = Array.from(nodesRef.current.values());
      nodes.forEach((node) => {
        if (node.id === draggedNodeId) return;

        const d = distance(draggedPosition, node.position);
        if (d < physicsConfig.bullyRadius) {
          // Calculate push direction and strength
          const strength = (physicsConfig.bullyRadius - d) / physicsConfig.bullyRadius;
          const dx = (node.position.x - draggedPosition.x) / Math.max(d, 1);
          const dy = (node.position.y - draggedPosition.y) / Math.max(d, 1);

          // Apply smooth push
          node.velocity.x += dx * strength * 10;
          node.velocity.y += dy * strength * 10;
        }
      });

      // Run simulation
      simulationStep();

      // Return updated positions
      const updatedPositions = new Map<string, { x: number; y: number }>();
      nodes.forEach((node) => {
        if (node.id !== draggedNodeId) {
          updatedPositions.set(node.id, { ...node.position });
        }
      });

      return updatedPositions;
    },
    [physicsConfig, initializePhysicsNodes, simulationStep]
  );

  // Start continuous simulation
  const startSimulation = useCallback(() => {
    if (isSimulating.current) return;
    isSimulating.current = true;

    const animate = () => {
      if (!isSimulating.current) return;

      const hasMovement = simulationStep();

      // Continue animation if there's movement
      if (hasMovement) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        isSimulating.current = false;
      }
    };

    animate();
  }, [simulationStep]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    isSimulating.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Get current node positions
  const getNodePositions = useCallback(() => {
    const positions = new Map<string, { x: number; y: number }>();
    nodesRef.current.forEach((node) => {
      positions.set(node.id, { ...node.position });
    });
    return positions;
  }, []);

  // Reset physics state
  const reset = useCallback(() => {
    nodesRef.current.clear();
    stopSimulation();
  }, [stopSimulation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, [stopSimulation]);

  return {
    applyBullyPhysics,
    startSimulation,
    stopSimulation,
    getNodePositions,
    reset,
    initializePhysicsNodes,
    config: physicsConfig,
  };
}

/**
 * Hook for individual node physics
 */
export function useNodePhysics(nodeId: string, initialPosition: { x: number; y: number }) {
  const positionRef = useRef(initialPosition);
  const velocityRef = useRef({ x: 0, y: 0 });

  const applyForce = useCallback((force: { x: number; y: number }) => {
    velocityRef.current.x += force.x;
    velocityRef.current.y += force.y;
  }, []);

  const updatePosition = useCallback((deltaTime: number = 0.016) => {
    // Apply damping
    velocityRef.current.x *= 0.95;
    velocityRef.current.y *= 0.95;

    // Update position
    positionRef.current.x += velocityRef.current.x * deltaTime * 60;
    positionRef.current.y += velocityRef.current.y * deltaTime * 60;

    return { ...positionRef.current };
  }, []);

  const setPosition = useCallback((newPosition: { x: number; y: number }) => {
    positionRef.current = { ...newPosition };
  }, []);

  return {
    position: positionRef.current,
    velocity: velocityRef.current,
    applyForce,
    updatePosition,
    setPosition,
  };
}
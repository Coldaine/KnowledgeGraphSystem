/**
 * Graph View Component
 *
 * Main visualization for the knowledge graph using React Flow.
 * Handles rendering blocks as nodes and relationships as edges.
 */

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge as FlowEdge,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionLineType,
  MarkerType,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  ReactFlowInstance,
} from 'react-flow-renderer';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlockStore } from '@/stores/blockStore';
import { Block as BlockNode } from '../Block/Block';
import { GraphControls } from './GraphControls';
import { usePerformance } from '@/hooks/usePerformance';
import { useBullyPhysics } from '@/hooks/useBullyPhysics';
import { Block, Edge, StructuralRelation, SemanticRelation } from '@/types';

// Custom node component wrapper
const CustomNode = ({ data }: { data: Block }) => {
  const { selectBlock, selectedBlockId } = useBlockStore();
  const isSelected = selectedBlockId === data.id;

  return (
    <BlockNode
      block={data}
      isSelected={isSelected}
      onSelect={() => selectBlock(data.id)}
      viewMode="card"
    />
  );
};

// Custom edge component for different relationship types
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: any) => {
  const { relationType, label } = data;

  // Determine edge style based on relationship type
  const isStructural = Object.values(StructuralRelation).includes(relationType);
  const edgeColor = isStructural
    ? 'rgba(156, 163, 175, 0.4)' // text-300
    : 'rgba(99, 181, 255, 0.6)'; // primary

  const strokeWidth = selected ? 3 : isStructural ? 2 : 1;
  const strokeDasharray = isStructural ? '0' : '5,5';

  // Calculate edge path (Bezier curve)
  const edgePath = `M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${
    (sourceX + targetX) / 2
  },${targetY} ${targetX},${targetY}`;

  return (
    <g>
      <path
        id={id}
        style={{
          stroke: edgeColor,
          strokeWidth,
          strokeDasharray,
          fill: 'none',
        }}
        d={edgePath}
        className="transition-all duration-200 hover:stroke-primary"
      />
      {label && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 12, fill: 'rgba(229, 231, 235, 0.7)' }}
            startOffset="50%"
            textAnchor="middle"
          >
            {label}
          </textPath>
        </text>
      )}
    </g>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export const GraphView: React.FC = () => {
  const {
    blocks,
    edges,
    selectedBlockId,
    createBlock,
    createEdge,
    updateBlock,
    visibleBlockIds,
    visibleEdgeIds,
    updateVisibleNodes,
  } = useBlockStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Performance monitoring
  const { startMeasure, endMeasure, fps } = usePerformance();

  // Bully physics for node repulsion
  const { applyBullyPhysics } = useBullyPhysics();

  // Convert blocks to React Flow nodes
  const convertBlocksToNodes = useCallback(() => {
    startMeasure('convertNodes');

    const flowNodes: Node[] = Array.from(blocks.values())
      .filter((block) => visibleBlockIds.size === 0 || visibleBlockIds.has(block.id))
      .map((block) => ({
        id: block.id,
        type: 'custom',
        position: block.position || { x: Math.random() * 800, y: Math.random() * 600 },
        data: block,
        draggable: block.immutability !== 'immutable',
        selectable: true,
      }));

    endMeasure('convertNodes');
    return flowNodes;
  }, [blocks, visibleBlockIds, startMeasure, endMeasure]);

  // Convert edges to React Flow edges
  const convertEdgesToFlowEdges = useCallback(() => {
    startMeasure('convertEdges');

    const flowEdges: FlowEdge[] = Array.from(edges.values())
      .filter((edge) => visibleEdgeIds.size === 0 || visibleEdgeIds.has(edge.id))
      .map((edge) => ({
        id: edge.id,
        source: edge.fromBlockId,
        target: edge.toBlockId,
        type: 'custom',
        animated: edge.relationType === SemanticRelation.DEPENDS_ON,
        data: {
          relationType: edge.relationType,
          label: edge.label,
        },
        style: {
          stroke: edge.color,
        },
      }));

    endMeasure('convertEdges');
    return flowEdges;
  }, [edges, visibleEdgeIds, startMeasure, endMeasure]);

  // Update nodes and edges when store changes
  useEffect(() => {
    setNodes(convertBlocksToNodes());
    setEdges(convertEdgesToFlowEdges());
  }, [blocks, edges, visibleBlockIds, visibleEdgeIds, convertBlocksToNodes, convertEdgesToFlowEdges]);

  // Handle node position updates
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const block = blocks.get(node.id);
      if (block) {
        updateBlock({
          ...block,
          position: node.position,
        });
      }

      // Apply bully physics to nearby nodes
      applyBullyPhysics(node.id, node.position, nodes);
    },
    [blocks, updateBlock, nodes, applyBullyPhysics]
  );

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        createEdge(params.source, params.target, StructuralRelation.LINKS);
      }
    },
    [createEdge]
  );

  // Handle double-click on canvas to create new block
  const onCanvasDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      if (reactFlowInstance) {
        const flowPosition = reactFlowInstance.project(position);
        createBlock({
          title: 'New Block',
          content: '',
          position: flowPosition,
        });
      }
    },
    [createBlock, reactFlowInstance]
  );

  // Smart edge visibility based on context
  useEffect(() => {
    if (selectedBlockId) {
      // Show edges connected to selected block
      const connectedEdges = Array.from(edges.values()).filter(
        (edge) => edge.fromBlockId === selectedBlockId || edge.toBlockId === selectedBlockId
      );

      const connectedBlockIds = new Set<string>();
      connectedEdges.forEach((edge) => {
        connectedBlockIds.add(edge.fromBlockId);
        connectedBlockIds.add(edge.toBlockId);
      });

      updateVisibleNodes(
        Array.from(connectedBlockIds),
        connectedEdges.map((e) => e.id)
      );
    } else {
      // Show only structural relationships by default
      const structuralEdges = Array.from(edges.values()).filter((edge) =>
        Object.values(StructuralRelation).includes(edge.relationType as StructuralRelation)
      );

      updateVisibleNodes(
        Array.from(blocks.keys()),
        structuralEdges.map((e) => e.id)
      );
    }
  }, [selectedBlockId, blocks, edges, updateVisibleNodes]);

  return (
    <div className="w-full h-full bg-background">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onInit={setReactFlowInstance}
          onDoubleClick={onCanvasDoubleClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.Bezier}
          defaultEdgeOptions={{
            type: 'custom',
          }}
          fitView
          attributionPosition="top-right"
        >
          {/* Background grid */}
          <Background
            color="rgba(99, 181, 255, 0.05)"
            gap={32}
            variant="dots"
            size={1}
          />

          {/* Controls */}
          <Controls className="bg-graph-800 border border-white/10" />

          {/* Minimap */}
          <MiniMap
            nodeStrokeColor={(n) => {
              const block = blocks.get(n.id);
              if (!block) return '#6B7280';
              switch (block.type) {
                case 'note':
                  return '#9CA3AF';
                case 'requirement':
                  return '#FFA500';
                case 'spec':
                  return '#3B82F6';
                case 'impl':
                  return '#10B981';
                case 'test':
                  return '#B5FF63';
                default:
                  return '#6B7280';
              }
            }}
            nodeColor={(n) => {
              const block = blocks.get(n.id);
              return block && selectedBlockId === block.id
                ? 'rgba(99, 181, 255, 0.3)'
                : 'rgba(107, 114, 128, 0.2)';
            }}
            nodeBorderRadius={8}
            className="bg-graph-800 border border-white/10"
          />

          {/* Custom Controls Panel */}
          <div className="absolute top-4 left-4 z-10 space-y-2">
            <GraphControls />
          </div>

          {/* Performance Monitor */}
          <div className="absolute bottom-4 right-4 z-10 glass-panel p-2">
            <div className="text-xs text-text-300">
              <div>FPS: {fps.toFixed(0)}</div>
              <div>Nodes: {nodes.length}</div>
              <div>Edges: {flowEdges.length}</div>
            </div>
          </div>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
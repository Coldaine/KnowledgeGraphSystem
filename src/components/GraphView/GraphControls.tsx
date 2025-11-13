/**
 * Graph Controls Component
 *
 * Control panel for graph visualization options
 */

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Layers,
  Shuffle,
  ZoomIn,
  ZoomOut,
  Maximize,
  Filter,
  Download,
  Settings,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import { useReactFlow } from 'react-flow-renderer';
import { useBlockStore } from '@/stores/blockStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const GraphControls: React.FC = () => {
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const { blocks, edges } = useBlockStore();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showStructural: true,
    showSemantic: false,
    showLabels: true,
    animateEdges: true,
    physicsEnabled: true,
    autoLayout: false,
  });

  // Toggle setting
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Auto layout (simplified force layout)
  const handleAutoLayout = () => {
    const nodeCount = blocks.size;
    const radius = Math.min(500, nodeCount * 50);
    const angleStep = (2 * Math.PI) / nodeCount;

    let index = 0;
    blocks.forEach((block) => {
      const angle = index * angleStep;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      // Update block position
      block.position = { x, y };
      index++;
    });

    // Fit view after layout
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  };

  // Export graph as JSON
  const handleExport = () => {
    const data = {
      blocks: Array.from(blocks.values()),
      edges: Array.from(edges.values()),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      {/* Main Controls */}
      <div className="glass-panel p-2 flex flex-col gap-1">
        <button
          onClick={() => fitView({ padding: 0.2 })}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-300 hover:bg-white/10 rounded transition-colors"
          title="Fit View"
        >
          <Maximize className="w-4 h-4" />
          <span>Fit</span>
        </button>
        <button
          onClick={() => zoomIn()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-300 hover:bg-white/10 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
          <span>Zoom In</span>
        </button>
        <button
          onClick={() => zoomOut()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-300 hover:bg-white/10 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
          <span>Zoom Out</span>
        </button>
        <button
          onClick={() => setCenter(400, 300, { zoom: 1 })}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-300 hover:bg-white/10 rounded transition-colors"
          title="Reset View"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* View Controls */}
      <div className="glass-panel p-2 flex flex-col gap-1">
        <button
          onClick={() => toggleSetting('showStructural')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors',
            settings.showStructural
              ? 'bg-primary/20 text-primary'
              : 'text-text-300 hover:bg-white/10'
          )}
          title="Toggle Structural Edges"
        >
          <Layers className="w-4 h-4" />
          <span>Structural</span>
        </button>
        <button
          onClick={() => toggleSetting('showSemantic')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors',
            settings.showSemantic
              ? 'bg-primary/20 text-primary'
              : 'text-text-300 hover:bg-white/10'
          )}
          title="Toggle Semantic Edges"
        >
          <Shuffle className="w-4 h-4" />
          <span>Semantic</span>
        </button>
        <button
          onClick={() => toggleSetting('showLabels')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors',
            settings.showLabels
              ? 'bg-primary/20 text-primary'
              : 'text-text-300 hover:bg-white/10'
          )}
          title="Toggle Edge Labels"
        >
          {settings.showLabels ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
          <span>Labels</span>
        </button>
      </div>

      {/* Layout Controls */}
      <div className="glass-panel p-2 flex flex-col gap-1">
        <button
          onClick={handleAutoLayout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-300 hover:bg-white/10 rounded transition-colors"
          title="Auto Layout"
        >
          <Shuffle className="w-4 h-4" />
          <span>Auto Layout</span>
        </button>
        <button
          onClick={() => toggleSetting('physicsEnabled')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors',
            settings.physicsEnabled
              ? 'bg-primary/20 text-primary'
              : 'text-text-300 hover:bg-white/10'
          )}
          title="Toggle Physics"
        >
          {settings.physicsEnabled ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
          <span>Physics</span>
        </button>
      </div>

      {/* Actions */}
      <div className="glass-panel p-2 flex flex-col gap-1">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-300 hover:bg-white/10 rounded transition-colors"
          title="Export Graph"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors',
            showSettings
              ? 'bg-primary/20 text-primary'
              : 'text-text-300 hover:bg-white/10'
          )}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="glass-panel p-3 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h4 className="text-sm font-semibold text-text-100 mb-2">
              Graph Settings
            </h4>
            <label className="flex items-center gap-2 text-xs text-text-300">
              <input
                type="checkbox"
                checked={settings.animateEdges}
                onChange={() => toggleSetting('animateEdges')}
                className="rounded"
              />
              Animate Edges
            </label>
            <label className="flex items-center gap-2 text-xs text-text-300">
              <input
                type="checkbox"
                checked={settings.autoLayout}
                onChange={() => toggleSetting('autoLayout')}
                className="rounded"
              />
              Auto Layout on Changes
            </label>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-text-400">
                Nodes: {blocks.size} | Edges: {edges.size}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
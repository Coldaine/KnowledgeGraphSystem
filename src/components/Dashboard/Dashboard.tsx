/**
 * Dashboard Component
 *
 * User-composed dashboard system that allows building custom workspaces
 * from blocks, filters, and widgets.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GridLayout, { Layout, Layouts } from 'react-grid-layout';
import {
  Plus,
  Settings,
  Save,
  Share2,
  Grid,
  List,
  BarChart,
  Calendar,
  Filter,
  X,
  GripVertical,
  Maximize2,
} from 'lucide-react';
import { Dashboard as DashboardType, DashboardWidget, FilterConfig, BlockType } from '@/types';
import { useBlockStore } from '@/stores/blockStore';
import { Block } from '../Block/Block';
import { cn } from '@/lib/utils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface DashboardProps {
  dashboard?: DashboardType;
  onSave?: (dashboard: DashboardType) => void;
  className?: string;
}

// Widget component wrapper
const Widget: React.FC<{
  widget: DashboardWidget;
  onRemove: (id: string) => void;
  onEdit: (widget: DashboardWidget) => void;
}> = ({ widget, onRemove, onEdit }) => {
  const { blocks } = useBlockStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Apply filters to get relevant blocks
  const filteredBlocks = useMemo(() => {
    if (!widget.config.blockFilter) {
      return Array.from(blocks.values());
    }

    return Array.from(blocks.values()).filter((block) => {
      const filter = widget.config.blockFilter!;
      switch (filter.field) {
        case 'tags':
          return filter.operator === 'contains'
            ? block.tags.some((t) => filter.value.includes(t))
            : block.tags.every((t) => !filter.value.includes(t));
        case 'type':
          return filter.operator === 'equals'
            ? block.type === filter.value
            : block.type !== filter.value;
        case 'state':
          return filter.operator === 'equals'
            ? block.state === filter.value
            : block.state !== filter.value;
        case 'immutability':
          return filter.operator === 'equals'
            ? block.immutability === filter.value
            : block.immutability !== filter.value;
        default:
          return true;
      }
    });
  }, [blocks, widget.config.blockFilter]);

  // Render widget content based on type
  const renderContent = () => {
    switch (widget.type) {
      case 'block-list':
        return (
          <div className="space-y-2 overflow-y-auto h-full">
            {filteredBlocks.map((block) => (
              <Block key={block.id} block={block} viewMode="compact" />
            ))}
            {filteredBlocks.length === 0 && (
              <div className="text-center text-text-400 py-8">
                No blocks match the filter
              </div>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="glass-panel p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {filteredBlocks.length}
              </div>
              <div className="text-xs text-text-400">Total Blocks</div>
            </div>
            <div className="glass-panel p-3 text-center">
              <div className="text-2xl font-bold text-accent">
                {filteredBlocks.filter((b) => b.type === BlockType.REQUIREMENT).length}
              </div>
              <div className="text-xs text-text-400">Requirements</div>
            </div>
            <div className="glass-panel p-3 text-center">
              <div className="text-2xl font-bold text-warning">
                {filteredBlocks.filter((b) => b.immutability === 'locked').length}
              </div>
              <div className="text-xs text-text-400">Locked</div>
            </div>
            <div className="glass-panel p-3 text-center">
              <div className="text-2xl font-bold text-success">
                {filteredBlocks.filter((b) => b.state === 'active').length}
              </div>
              <div className="text-xs text-text-400">Active</div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-center text-xs text-text-400 py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square glass-panel flex items-center justify-center text-sm hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        );

      case 'graph-view':
        return (
          <div className="flex items-center justify-center h-full text-text-400">
            <div className="text-center">
              <Grid className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Graph view widget</p>
              <p className="text-xs mt-1">Coming soon</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-text-400">
            Custom widget content
          </div>
        );
    }
  };

  return (
    <motion.div
      className={cn(
        'glass-card h-full flex flex-col',
        isExpanded && 'fixed inset-4 z-50'
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-text-400 cursor-move" />
          <h3 className="text-sm font-semibold text-text-100">
            {widget.config.title || 'Widget'}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Maximize2 className="w-3 h-3 text-text-400" />
          </button>
          <button
            onClick={() => onEdit(widget)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Settings className="w-3 h-3 text-text-400" />
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-3 h-3 text-text-400" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </motion.div>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC<DashboardProps> = ({
  dashboard,
  onSave,
  className,
}) => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(
    dashboard?.widgets || []
  );
  const [layouts, setLayouts] = useState<Layouts>({});
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);

  // Convert widgets to grid layout items
  const layoutItems: Layout[] = widgets.map((widget) => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    minW: 2,
    minH: 2,
  }));

  // Handle layout changes
  const handleLayoutChange = useCallback(
    (layout: Layout[]) => {
      const updatedWidgets = widgets.map((widget) => {
        const layoutItem = layout.find((l) => l.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            },
          };
        }
        return widget;
      });
      setWidgets(updatedWidgets);
    },
    [widgets]
  );

  // Add new widget
  const addWidget = useCallback(
    (type: DashboardWidget['type']) => {
      const newWidget: DashboardWidget = {
        id: `widget-${Date.now()}`,
        type,
        position: {
          x: 0,
          y: 0,
          w: 4,
          h: 4,
        },
        config: {
          title: `New ${type} Widget`,
        },
      };
      setWidgets([...widgets, newWidget]);
      setShowAddWidget(false);
    },
    [widgets]
  );

  // Remove widget
  const removeWidget = useCallback(
    (id: string) => {
      setWidgets(widgets.filter((w) => w.id !== id));
    },
    [widgets]
  );

  // Edit widget
  const editWidget = useCallback(
    (updatedWidget: DashboardWidget) => {
      setWidgets(
        widgets.map((w) => (w.id === updatedWidget.id ? updatedWidget : w))
      );
    },
    [widgets]
  );

  // Save dashboard
  const handleSave = useCallback(() => {
    if (onSave && dashboard) {
      onSave({
        ...dashboard,
        widgets,
        updatedAt: new Date(),
      });
    }
  }, [dashboard, widgets, onSave]);

  return (
    <div className={cn('w-full h-full bg-background overflow-auto', className)}>
      {/* Dashboard Header */}
      <div className="glass-panel m-4 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-100">
            {dashboard?.name || 'Custom Dashboard'}
          </h2>
          <p className="text-sm text-text-300">
            {dashboard?.description || 'Compose your own workspace with widgets'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={cn(
              'glass-button flex items-center gap-2',
              editMode && 'bg-primary/30'
            )}
          >
            <Settings className="w-4 h-4" />
            {editMode ? 'Done Editing' : 'Edit Layout'}
          </button>
          <button
            onClick={() => setShowAddWidget(true)}
            className="glass-button flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Widget
          </button>
          <button onClick={handleSave} className="glass-button flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="glass-button flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="p-4">
        <GridLayout
          className="layout"
          layout={layoutItems}
          cols={12}
          rowHeight={60}
          width={1200}
          isDraggable={editMode}
          isResizable={editMode}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".cursor-move"
        >
          {widgets.map((widget) => (
            <div key={widget.id}>
              <Widget
                widget={widget}
                onRemove={removeWidget}
                onEdit={editWidget}
              />
            </div>
          ))}
        </GridLayout>
      </div>

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddWidget && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddWidget(false)}
          >
            <motion.div
              className="glass-panel p-6 max-w-lg w-full mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-text-100 mb-4">
                Add Widget
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addWidget('block-list')}
                  className="glass-panel p-4 hover:bg-white/10 transition-colors text-left"
                >
                  <List className="w-8 h-8 mb-2 text-primary" />
                  <div className="text-sm font-medium text-text-100">Block List</div>
                  <div className="text-xs text-text-400">
                    Display filtered blocks
                  </div>
                </button>
                <button
                  onClick={() => addWidget('stats')}
                  className="glass-panel p-4 hover:bg-white/10 transition-colors text-left"
                >
                  <BarChart className="w-8 h-8 mb-2 text-accent" />
                  <div className="text-sm font-medium text-text-100">Statistics</div>
                  <div className="text-xs text-text-400">
                    Show block metrics
                  </div>
                </button>
                <button
                  onClick={() => addWidget('calendar')}
                  className="glass-panel p-4 hover:bg-white/10 transition-colors text-left"
                >
                  <Calendar className="w-8 h-8 mb-2 text-warning" />
                  <div className="text-sm font-medium text-text-100">Calendar</div>
                  <div className="text-xs text-text-400">
                    Timeline view
                  </div>
                </button>
                <button
                  onClick={() => addWidget('graph-view')}
                  className="glass-panel p-4 hover:bg-white/10 transition-colors text-left"
                >
                  <Grid className="w-8 h-8 mb-2 text-success" />
                  <div className="text-sm font-medium text-text-100">Graph View</div>
                  <div className="text-xs text-text-400">
                    Mini graph display
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
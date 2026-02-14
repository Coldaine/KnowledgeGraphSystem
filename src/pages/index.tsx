import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid3x3,
  FileText,
  Brain,
  FolderTree,
  LayoutDashboard,
  Settings,
  Download,
  Upload,
  HelpCircle,
  Command,
} from 'lucide-react';
import { useBlockStore } from '@/stores/blockStore';
import { cn } from '@/lib/utils';

// Dynamically import heavy components
const GraphView = dynamic(() => import('@/components/GraphView/GraphView').then(mod => ({ default: mod.GraphView })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>,
});

const Dashboard = dynamic(() => import('@/components/Dashboard/Dashboard').then(mod => ({ default: mod.Dashboard })), {
  ssr: false,
});

export default function Home() {
  const { viewMode, setViewMode, blocks, edges, exportData, importData } = useBlockStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showHUD, setShowHUD] = useState(true);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setShowHelp(!showHelp);
      }
      // Note: Multi-key shortcuts (gg, gd, etc.) would require state tracking
      // For now, using simple single-key shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case '1':
            setViewMode('graph');
            break;
          case '2':
            setViewMode('document');
            break;
          case '3':
            setViewMode('brainstorm');
            break;
          case '4':
            setViewMode('folder');
            break;
        }
      }
      if (e.key === 'h' && e.ctrlKey) {
        setShowHUD(!showHUD);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showHelp, showHUD, setViewMode]);

  // Handle export
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-graph-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <Head>
        <title>Knowledge Graph System</title>
        <meta name="description" content="Block-based knowledge management with graph visualization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
        {/* Header */}
        <header className="glass-panel border-b border-white/10 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-text-100">Knowledge Graph</h1>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('graph')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'graph'
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-white/10 text-text-300'
                  )}
                  title="Graph View (gg)"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('document')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'document'
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-white/10 text-text-300'
                  )}
                  title="Document View (gd)"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('brainstorm')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'brainstorm'
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-white/10 text-text-300'
                  )}
                  title="Brainstorm Mode (gb)"
                >
                  <Brain className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('folder')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'folder'
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-white/10 text-text-300'
                  )}
                  title="Folder View (gf)"
                >
                  <FolderTree className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-white/10 text-text-300"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-text-400 mr-4">
                {blocks.size} blocks • {edges.size} edges
              </div>
              <button
                onClick={handleExport}
                className="glass-button p-2"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>
              <label className="glass-button p-2 cursor-pointer" title="Import Data">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button className="glass-button p-2" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="glass-button p-2"
                title="Help (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative">
          {viewMode === 'graph' && <GraphView />}
          {viewMode === 'document' && (
            <div className="flex items-center justify-center h-full text-text-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Document View</h2>
                <p>Assemble documents from blocks</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            </div>
          )}
          {viewMode === 'brainstorm' && (
            <div className="flex items-center justify-center h-full text-text-400">
              <div className="text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Brainstorm Mode</h2>
                <p>Structured planning with lanes</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            </div>
          )}
          {viewMode === 'folder' && (
            <div className="flex items-center justify-center h-full text-text-400">
              <div className="text-center">
                <FolderTree className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Folder View</h2>
                <p>Hierarchical repository structure</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            </div>
          )}
        </main>

        {/* HUD - Keyboard Shortcuts */}
        <AnimatePresence>
          {showHUD && (
            <motion.div
              className="hud-window bottom-4 right-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-text-100">
                  <Command className="inline w-4 h-4 mr-1" />
                  Shortcuts
                </h3>
                <button
                  onClick={() => setShowHUD(false)}
                  className="text-text-400 hover:text-text-100"
                >
                  ×
                </button>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-400">Graph</span>
                  <kbd className="px-1 bg-graph-700 rounded">gg</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-400">Document</span>
                  <kbd className="px-1 bg-graph-700 rounded">gd</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-400">Brainstorm</span>
                  <kbd className="px-1 bg-graph-700 rounded">gb</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-400">Folder</span>
                  <kbd className="px-1 bg-graph-700 rounded">gf</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-400">Help</span>
                  <kbd className="px-1 bg-graph-700 rounded">?</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-400">Toggle HUD</span>
                  <kbd className="px-1 bg-graph-700 rounded">Ctrl+H</kbd>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                className="glass-panel p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-text-100 mb-6">
                  Knowledge Graph Help
                </h2>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Getting Started
                    </h3>
                    <p className="text-text-200 mb-2">
                      Double-click anywhere on the canvas to create a new block. Double-click
                      blocks to flip them and see metadata.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Block Types
                    </h3>
                    <ul className="space-y-1 text-text-200">
                      <li>• <span className="text-text-300">Note</span> - General information</li>
                      <li>• <span className="text-warning">Requirement</span> - What must be done</li>
                      <li>• <span className="text-primary">Spec</span> - Design and features</li>
                      <li>• <span className="text-success">Implementation</span> - How to do it</li>
                      <li>• <span className="text-accent">Test</span> - Verification</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Keyboard Shortcuts
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-400">Switch to Graph</span>
                        <kbd className="px-2 py-1 bg-graph-700 rounded">gg</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-400">Switch to Document</span>
                        <kbd className="px-2 py-1 bg-graph-700 rounded">gd</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-400">Switch to Brainstorm</span>
                        <kbd className="px-2 py-1 bg-graph-700 rounded">gb</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-400">Switch to Folder</span>
                        <kbd className="px-2 py-1 bg-graph-700 rounded">gf</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-400">Toggle Help</span>
                        <kbd className="px-2 py-1 bg-graph-700 rounded">?</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-400">Toggle HUD</span>
                        <kbd className="px-2 py-1 bg-graph-700 rounded">Ctrl+H</kbd>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Immutability Levels
                    </h3>
                    <ul className="space-y-1 text-text-200">
                      <li>• <span className="text-success">Mutable</span> - Normal editing allowed</li>
                      <li>• <span className="text-warning">Locked</span> - Requires unlock to edit</li>
                      <li>• <span className="text-error">Immutable</span> - Cannot be changed</li>
                    </ul>
                  </section>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowHelp(false)}
                    className="glass-button px-4 py-2"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
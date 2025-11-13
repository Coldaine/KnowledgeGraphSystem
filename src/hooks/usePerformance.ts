/**
 * Performance monitoring hook
 *
 * Tracks FPS, render times, and other performance metrics
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  renderTime: number;
  memoryUsage: number;
  nodeCount: number;
  edgeCount: number;
}

interface PerformanceMeasure {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    nodeCount: 0,
    edgeCount: 0,
  });

  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());
  const measures = useRef<Map<string, PerformanceMeasure>>(new Map());
  const rafId = useRef<number>();

  // FPS calculation
  const calculateFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime.current;

    frameCount.current++;

    // Update FPS every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / deltaTime);
      frameCount.current = 0;
      lastFrameTime.current = currentTime;

      // Get memory usage if available
      let memoryUsage = 0;
      if ('memory' in performance) {
        memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
      }

      setMetrics((prev) => ({
        ...prev,
        fps,
        frameTime: 1000 / fps,
        memoryUsage,
      }));
    }

    rafId.current = requestAnimationFrame(calculateFPS);
  }, []);

  // Start FPS monitoring
  useEffect(() => {
    rafId.current = requestAnimationFrame(calculateFPS);
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [calculateFPS]);

  // Start performance measure
  const startMeasure = useCallback((name: string) => {
    measures.current.set(name, {
      name,
      startTime: performance.now(),
    });
  }, []);

  // End performance measure
  const endMeasure = useCallback((name: string): number => {
    const measure = measures.current.get(name);
    if (!measure) return 0;

    const endTime = performance.now();
    const duration = endTime - measure.startTime;

    measure.endTime = endTime;
    measure.duration = duration;

    // Update render time if this was a render measure
    if (name.includes('render') || name.includes('convert')) {
      setMetrics((prev) => ({
        ...prev,
        renderTime: duration,
      }));
    }

    return duration;
  }, []);

  // Get all measures
  const getMeasures = useCallback(() => {
    return Array.from(measures.current.values());
  }, []);

  // Clear measures
  const clearMeasures = useCallback(() => {
    measures.current.clear();
  }, []);

  // Update node and edge counts
  const updateCounts = useCallback((nodeCount: number, edgeCount: number) => {
    setMetrics((prev) => ({
      ...prev,
      nodeCount,
      edgeCount,
    }));
  }, []);

  // Check if performance is degraded
  const isDegraded = useCallback(() => {
    return metrics.fps < 30 || metrics.renderTime > 100;
  }, [metrics]);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];

    if (metrics.fps < 30) {
      suggestions.push('FPS is low. Consider reducing visible nodes/edges.');
    }

    if (metrics.renderTime > 100) {
      suggestions.push('Render time is high. Try simplifying visualizations.');
    }

    if (metrics.memoryUsage > 500) {
      suggestions.push('High memory usage. Consider clearing unused data.');
    }

    if (metrics.nodeCount > 1000) {
      suggestions.push('Many nodes. Use filtering or pagination.');
    }

    if (metrics.edgeCount > 5000) {
      suggestions.push('Many edges. Show only structural relationships by default.');
    }

    return suggestions;
  }, [metrics]);

  return {
    metrics,
    fps: metrics.fps,
    isDegraded: isDegraded(),
    startMeasure,
    endMeasure,
    getMeasures,
    clearMeasures,
    updateCounts,
    getOptimizationSuggestions,
  };
}

/**
 * Performance observer hook for monitoring specific operations
 */
export function usePerformanceObserver(
  callback: (entry: PerformanceEntry) => void,
  options?: PerformanceObserverInit
) {
  useEffect(() => {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });

    observer.observe(options || { entryTypes: ['measure', 'navigation'] });

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);
}

/**
 * Frame rate limiter hook
 */
export function useFrameRateLimiter(targetFPS: number = 60) {
  const frameTime = 1000 / targetFPS;
  const lastFrameTime = useRef(0);

  const shouldRender = useCallback(() => {
    const now = performance.now();
    if (now - lastFrameTime.current >= frameTime) {
      lastFrameTime.current = now;
      return true;
    }
    return false;
  }, [frameTime]);

  return shouldRender;
}

/**
 * Debounced performance measure hook
 */
export function useDebouncedPerformance(delay: number = 1000) {
  const [performanceData, setPerformanceData] = useState<{
    renderCount: number;
    averageRenderTime: number;
    peakRenderTime: number;
  }>({
    renderCount: 0,
    averageRenderTime: 0,
    peakRenderTime: 0,
  });

  const renderTimes = useRef<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const recordRender = useCallback((duration: number) => {
    renderTimes.current.push(duration);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const times = renderTimes.current;
      if (times.length === 0) return;

      const average = times.reduce((a, b) => a + b, 0) / times.length;
      const peak = Math.max(...times);

      setPerformanceData({
        renderCount: times.length,
        averageRenderTime: average,
        peakRenderTime: peak,
      });

      renderTimes.current = [];
    }, delay);
  }, [delay]);

  return { performanceData, recordRender };
}
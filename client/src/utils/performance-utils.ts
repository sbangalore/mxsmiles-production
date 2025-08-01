// Performance utilities to avoid forced reflows and optimize DOM queries

// Cache DOM measurements to avoid forced reflows
const measurementCache = new Map<string, { value: number; timestamp: number }>();
const CACHE_DURATION = 1000; // 1 second cache

export function getCachedMeasurement(
  element: Element,
  property: 'offsetWidth' | 'offsetHeight' | 'scrollTop' | 'scrollLeft',
  cacheKey?: string
): number {
  const key = cacheKey || `${element.tagName}-${property}`;
  const cached = measurementCache.get(key);
  const now = Date.now();

  // Return cached value if still valid
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.value;
  }

  // Get fresh measurement and cache it
  const value = (element as any)[property];
  measurementCache.set(key, { value, timestamp: now });
  return value;
}

// Batch DOM reads to avoid layout thrashing
export function batchDOMReads<T>(
  reads: Array<() => T>
): Promise<T[]> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const results = reads.map(read => read());
      resolve(results);
    });
  });
}

// Optimized scroll position utility that avoids forced reflows
export function getOptimizedScrollPosition(element?: Element): { top: number; left: number } {
  const target = element || document.documentElement;
  
  // Use cached values when possible
  const top = getCachedMeasurement(target, 'scrollTop', 'scroll-top');
  const left = getCachedMeasurement(target, 'scrollLeft', 'scroll-left');
  
  return { top, left };
}

// Optimized element bounds that batches reads
export async function getOptimizedBounds(element: Element): Promise<DOMRect> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve(element.getBoundingClientRect());
    });
  });
}

// Debounced resize observer to reduce layout calculations
export function createOptimizedResizeObserver(
  callback: (entries: ResizeObserverEntry[]) => void,
  debounceMs = 16
): ResizeObserver {
  let timeoutId: number;
  
  return new ResizeObserver((entries) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(entries);
    }, debounceMs);
  });
}

// Clear measurement cache when needed
export function clearMeasurementCache(): void {
  measurementCache.clear();
}
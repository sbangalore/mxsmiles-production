// Main thread optimization to fix long tasks identified in PageSpeed

export function breakUpLongTasks(): void {
  if (typeof window === 'undefined') return;

  // Split heavy initialization into smaller chunks
  const scheduler = window.scheduler?.postTask || ((callback: () => void) => setTimeout(callback, 0));
  
  // Chunk heavy DOM operations
  function processInChunks<T>(
    items: T[],
    processor: (item: T) => void,
    chunkSize: number = 50
  ): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      
      function processChunk() {
        const startTime = performance.now();
        
        while (index < items.length && (performance.now() - startTime) < 5) {
          processor(items[index]);
          index++;
        }
        
        if (index < items.length) {
          scheduler(processChunk);
        } else {
          resolve();
        }
      }
      
      processChunk();
    });
  }

  // Defer heavy image processing
  function optimizeImagesInChunks(): void {
    const images = Array.from(document.querySelectorAll('img'));
    
    processInChunks(images, (img) => {
      // Add intersection observer for lazy loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Optimize image decoding
      img.setAttribute('decoding', 'async');
      
      // Add size attributes if missing
      if (!img.width && !img.height) {
        const computedStyle = window.getComputedStyle(img);
        if (computedStyle.width && computedStyle.height) {
          img.width = parseInt(computedStyle.width);
          img.height = parseInt(computedStyle.height);
        }
      }
    });
  }

  // Split analytics initialization
  function initAnalyticsInChunks(): void {
    scheduler(() => {
      // Initialize Google Analytics in separate task
      if (window.gtag && import.meta.env.VITE_GA_MEASUREMENT_ID) {
        scheduler(() => {
          window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
        });
      }
    });
  }

  // Process heavy React hydration
  function optimizeReactHydration(): void {
    // Allow main thread to breathe during React updates
    const originalSetTimeout = window.setTimeout;
    let taskCount = 0;
    
    window.setTimeout = function(callback: Function, delay?: number) {
      taskCount++;
      
      if (taskCount > 10) {
        // Yield to main thread every 10 tasks
        return originalSetTimeout(() => {
          taskCount = 0;
          return originalSetTimeout(callback as any, 0);
        }, 0);
      }
      
      return originalSetTimeout(callback as any, delay);
    };
  }

  // Initialize optimizations
  optimizeImagesInChunks();
  initAnalyticsInChunks();
  optimizeReactHydration();

  // Export utilities for global use
  window.processInChunks = processInChunks;
}

// Reduce JavaScript execution time
export function optimizeJavaScriptExecution(): void {
  if (typeof window === 'undefined') return;

  // Debounce scroll events to reduce CPU usage
  let scrollTimeout: number;
  const originalAddEventListener = window.addEventListener;
  
  window.addEventListener = function(type: string, listener: any, options?: any) {
    if (type === 'scroll') {
      const debouncedListener = function(event: Event) {
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          listener(event);
        }, 16); // ~60fps
      };
      return originalAddEventListener.call(this, type, debouncedListener, options);
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Optimize resize events
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      // Clear measurement cache on resize
      if (window.clearMeasurementCache) {
        window.clearMeasurementCache();
      }
    }, 250);
  }, { passive: true });
}

// Global interface extension
declare global {
  interface Window {
    processInChunks: <T>(
      items: T[],
      processor: (item: T) => void,
      chunkSize?: number
    ) => Promise<void>;
    clearMeasurementCache: () => void;
    scheduler?: {
      postTask: (callback: () => void) => void;
    };
  }
}
import { useEffect } from 'react';

// Export the lazy loading hook
export { useLazyLoading } from '@/components/performance/image-optimizer';

// Performance optimizations for faster website loading
export const usePerformanceOptimizations = () => {
  useEffect(() => {
    // Optimize images with lazy loading and WebP support
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-optimize]');
      
      images.forEach((img) => {
        if ('loading' in HTMLImageElement.prototype) {
          (img as HTMLImageElement).loading = 'lazy';
        }
        
        // Add intersection observer for better loading control
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const imgElement = entry.target as HTMLImageElement;
              if (imgElement.dataset.src) {
                imgElement.src = imgElement.dataset.src;
                imgElement.removeAttribute('data-src');
              }
              observer.unobserve(imgElement);
            }
          });
        }, { rootMargin: '50px' });
        
        observer.observe(img);
      });
    };

    // Optimize main thread tasks by deferring non-critical operations
    const optimizeMainThread = () => {
      // Defer non-critical scripts
      const deferredTasks = [
        () => {
          // Initialize analytics after initial load
          if (typeof (window as any).gtag !== 'undefined') {
            const idleCallback = window.requestIdleCallback || ((cb: any) => setTimeout(cb, 1));
            idleCallback(() => {
              (window as any).gtag('config', 'GA_MEASUREMENT_ID');
            });
          }
        },
        () => {
          // Preload next page resources during idle time
          const idleCallback = window.requestIdleCallback || ((cb: any) => setTimeout(cb, 1));
          idleCallback(() => {
            const nextPageLinks = document.querySelectorAll('link[rel="prefetch"]');
            nextPageLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href) {
                const linkEl = document.createElement('link');
                linkEl.rel = 'prefetch';
                linkEl.href = href;
                document.head.appendChild(linkEl);
              }
            });
          });
        }
      ];

      // Execute deferred tasks when main thread is idle
      deferredTasks.forEach(task => {
        const idleCallback = window.requestIdleCallback || ((cb: any) => setTimeout(cb, 1));
        if ('requestIdleCallback' in window) {
          idleCallback(task, { timeout: 2000 });
        } else {
          setTimeout(task, 100);
        }
      });
    };

    // Preload critical fonts
    const preloadFonts = () => {
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
      ];
      
      fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // DNS prefetch for external resources
    const setupDNSPrefetch = () => {
      const domains = [
        'https://images.unsplash.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];
      
      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Enable service worker for caching (if available)
    const enableServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed, continue without it
        });
      }
    };

    optimizeImages();
    optimizeMainThread();
    preloadFonts();
    setupDNSPrefetch();
    enableServiceWorker();

    // Resource hints for better performance
    const addResourceHints = () => {
      // Preconnect to external domains
      const preconnectDomains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    addResourceHints();
  }, []);
};
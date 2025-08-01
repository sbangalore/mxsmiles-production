import { useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  sizes
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP source with fallback
  const webpSrc = src.includes('unsplash.com') 
    ? `${src}&fm=webp&q=85`
    : src;

  const avifSrc = src.includes('unsplash.com')
    ? `${src}&fm=avif&q=85`
    : src;

  useEffect(() => {
    if (priority && imgRef.current) {
      // Preload high-priority images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = webpSrc;
      document.head.appendChild(link);
    }
  }, [priority, webpSrc]);

  return (
    <picture>
      {/* Modern format sources */}
      <source srcSet={avifSrc} type="image/avif" sizes={sizes} />
      <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      
      {/* Fallback */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority && { fetchpriority: 'high' as any })}
        style={{
          contentVisibility: priority ? 'visible' : 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : 'none'
        }}
      />
    </picture>
  );
}

// Hook for performance-optimized lazy loading
export function useLazyLoading() {
  useEffect(() => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              
              // Add animation class when image enters viewport
              img.style.opacity = '0';
              img.style.transition = 'opacity 0.3s ease-in-out';
              
              img.onload = () => {
                img.style.opacity = '1';
              };
              
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );

      images.forEach(img => imageObserver.observe(img));

      return () => {
        images.forEach(img => imageObserver.unobserve(img));
      };
    }
  }, []);
}
import { useEffect, useState, useCallback, useRef } from 'react';
import { getOptimizedScrollPosition } from '@/utils/performance-utils';

// Optimized scroll hook that minimizes forced reflows
export function useOptimizedScroll(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const { top } = getOptimizedScrollPosition();
        setIsScrolled(top > threshold);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isScrolled;
}

// Active section tracker with optimized scroll handling
export function useActiveSection(sections: string[]) {
  const [activeSection, setActiveSection] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Use intersection observer instead of scroll events for better performance
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Observe all sections
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element && observer.current) {
        observer.current.observe(element);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [sections]);

  return activeSection;
}
import { useEffect, useRef } from 'react';
import { useInView, useAnimation } from 'framer-motion';
import { useDesign } from '@/contexts/design-context';

export const useScrollAnimation = (threshold = 0.1, once = true) => {
  const { theme } = useDesign();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const controls = useAnimation();

  useEffect(() => {
    // For Apple theme, always show content immediately
    if (theme === 'apple') {
      controls.start('visible');
      return;
    }
    
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView, theme]);

  return { ref, controls };
};

// Animation presets based on theme
export const useAnimationPresets = () => {
  const { theme } = useDesign();
  
  const isAppleTheme = theme === 'apple';
  
  // No animations for Apple theme - instant transitions
  if (isAppleTheme) {
    return {
      fadeInUp: {
        hidden: { opacity: 1, y: 0 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0 }
        }
      },
      
      fadeInLeft: {
        hidden: { opacity: 1, x: 0 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0 }
        }
      },
      
      fadeInRight: {
        hidden: { opacity: 1, x: 0 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0 }
        }
      },
      
      scaleIn: {
        hidden: { opacity: 1, scale: 1 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0 }
        }
      },
      
      staggerContainer: {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0,
            delayChildren: 0
          }
        }
      },
      
      staggerItem: {
        hidden: { opacity: 1, y: 0 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0 }
        }
      }
    };
  }
  
  // Standard animations for other themes
  const standardEase = "easeOut";
  const duration = 0.6;
  const distance = 30;
  
  return {
    fadeInUp: {
      hidden: { opacity: 0, y: distance },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, ease: standardEase }
      }
    },
    
    fadeInLeft: {
      hidden: { opacity: 0, x: -distance },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, ease: standardEase }
      }
    },
    
    fadeInRight: {
      hidden: { opacity: 0, x: distance },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, ease: standardEase }
      }
    },
    
    scaleIn: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5, ease: standardEase }
      }
    },
    
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },
    
    staggerItem: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, ease: standardEase }
      }
    }
  };
};
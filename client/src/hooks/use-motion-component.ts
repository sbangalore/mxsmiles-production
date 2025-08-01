import { useDesign } from '@/contexts/design-context';
import React from 'react';

interface MotionComponentProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  initial?: any;
  animate?: any;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  transition?: any;
  viewport?: any;
}

export const ConditionalMotion: React.FC<MotionComponentProps> = (props) => {
  const { theme } = useDesign();
  
  // Always render a static div - no animations for now to avoid import issues
  return React.createElement('div', { 
    className: props.className,
    id: props.id 
  }, props.children);
};
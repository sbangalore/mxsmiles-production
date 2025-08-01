import { useEffect } from 'react';

declare global {
  interface Window {
    Cal?: any;
  }
}

interface CalEmbedProps {
  calLink: string;
  config?: {
    name?: string;
    email?: string;
    theme?: 'light' | 'dark';
    hideEventTypeDetails?: boolean;
    layout?: 'month_view' | 'week_view' | 'column_view';
  };
  className?: string;
}

export default function CalEmbed({ calLink, config = {}, className = "" }: CalEmbedProps) {
  useEffect(() => {
    // Load Cal.com embed script if not already loaded
    if (!window.Cal) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        if (window.Cal) {
          window.Cal('init', {
            origin: 'https://cal.com'
          });
        }
      };
      
      script.onerror = () => {
        console.warn('Cal.com embed script failed to load, using direct links');
      };
    } else {
      // If Cal is already loaded, initialize
      try {
        window.Cal('init', {
          origin: 'https://cal.com'
        });
      } catch (error) {
        console.warn('Cal.com initialization error:', error);
      }
    }
  }, []);

  const handleBooking = () => {
    try {
      if (window.Cal && typeof window.Cal === 'function') {
        window.Cal('openModal', calLink, {
          ...config,
        });
      } else {
        // Fallback to direct link
        window.open(`https://cal.com/${calLink}`, '_blank');
      }
    } catch (error) {
      console.warn('Cal.com embed error, using direct link:', error);
      // Fallback to direct link if embed fails
      window.open(`https://cal.com/${calLink}`, '_blank');
    }
  };

  return (
    <div className={`cal-embed ${className}`}>
      <button
        onClick={handleBooking}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Book Appointment
      </button>
    </div>
  );
}
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function MobileCTA() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    // Only show CTA on homepage
    if (location !== "/") {
      setShowCTA(false);
      return;
    }

    const handleScroll = () => {
      // Look for the "Transparent Pricing" section instead of general pricing
      const transparentPricingElement = document.querySelector('h2');
      let transparentPricingSection = null;
      
      // Find the h2 element that contains "Transparent Pricing" text
      if (transparentPricingElement) {
        const headings = document.querySelectorAll('h2, h3');
        headings.forEach(heading => {
          if (heading.textContent?.includes('Transparent Pricing') || 
              heading.textContent?.includes('Precios Transparentes')) {
            transparentPricingSection = heading;
          }
        });
      }
      
      // Fallback to pricing section if transparent pricing not found
      if (!transparentPricingSection) {
        transparentPricingSection = document.getElementById("pricing");
      }
      
      if (transparentPricingSection) {
        const rect = transparentPricingSection.getBoundingClientRect();
        // Show CTA when transparent pricing section comes into view and continues after it
        setShowCTA(rect.top <= window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  if (!showCTA) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/20 p-5 shadow-2xl">
      <Button 
        className="w-full bg-[#007aff] hover:bg-[#1f8fff] text-white font-semibold py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        onClick={() => window.location.href = '/booking#top'}
      >
        <Calendar className="w-5 h-5" />
        {t.nav.freeConsultation}
      </Button>
    </div>
  );
}
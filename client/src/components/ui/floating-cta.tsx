import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FloatingCTA() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--medical-blue)] p-4 z-50 border-t border-blue-600">
      <Button 
        className="w-full bg-[var(--mexican-orange)] text-white py-3 rounded-lg font-semibold hover:bg-yellow-600"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Free Consultation
      </Button>
    </div>
  );
}

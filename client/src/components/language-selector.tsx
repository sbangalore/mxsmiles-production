import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          {language.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-blue-50' : ''}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('es')}
          className={language === 'es' ? 'bg-blue-50' : ''}
        >
          🇲🇽 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
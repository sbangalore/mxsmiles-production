import { createContext, useContext, useEffect, useState } from "react";
import { Language, defaultLanguage, translations } from "@shared/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mxsmiles-language');
      if (saved === 'en' || saved === 'es') {
        return saved;
      }
      
      // Enhanced auto-detection for Spanish-speaking regions
      const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
      const languageCode = browserLanguage.toLowerCase();
      
      // Check if browser language is Spanish or Spanish variant
      if (languageCode.startsWith('es')) {
        return 'es';
      }
      
      // Check for Spanish-speaking countries by country code
      const spanishCountryCodes = [
        'mx', // Mexico
        'ar', // Argentina
        'co', // Colombia
        've', // Venezuela
        'pe', // Peru
        'cl', // Chile
        'ec', // Ecuador
        'gt', // Guatemala
        'cu', // Cuba
        'bo', // Bolivia
        'do', // Dominican Republic
        'hn', // Honduras
        'py', // Paraguay
        'sv', // El Salvador
        'ni', // Nicaragua
        'cr', // Costa Rica
        'pa', // Panama
        'uy', // Uruguay
        'gq'  // Equatorial Guinea
      ];
      
      const countryCode = languageCode.split('-')[1];
      if (countryCode && spanishCountryCodes.includes(countryCode)) {
        return 'es';
      }
      
      // Check user's timezone for additional Spanish-speaking region detection
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const spanishTimezones = [
          'America/Mexico_City', 'America/Tijuana', 'America/Cancun',
          'America/Buenos_Aires', 'America/Bogota', 'America/Caracas',
          'America/Lima', 'America/Santiago', 'America/Guayaquil',
          'America/Guatemala', 'America/Havana', 'America/La_Paz',
          'America/Santo_Domingo', 'America/Tegucigalpa', 'America/Asuncion',
          'America/El_Salvador', 'America/Managua', 'America/Costa_Rica',
          'America/Panama', 'America/Montevideo'
        ];
        
        if (spanishTimezones.some(tz => timezone.includes(tz.split('/')[1]))) {
          return 'es';
        }
      } catch (error) {
        // Timezone detection failed, continue with default
      }
      
      // Default to English
      return 'en';
    }
    return defaultLanguage;
  });

  // Note: Geolocation detection removed to improve user experience
  // Language detection now relies on browser language and timezone only
  // This prevents unnecessary permission prompts without user context

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mxsmiles-language', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
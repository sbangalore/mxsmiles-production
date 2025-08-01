import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LanguageTest() {
  const { language, setLanguage, t } = useLanguage();

  const getBrowserInfo = () => {
    if (typeof window === 'undefined') return null;
    
    return {
      language: navigator.language,
      languages: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent.substring(0, 100) + '...'
    };
  };

  const browserInfo = getBrowserInfo();

  const clearLanguagePreference = () => {
    localStorage.removeItem('mxsmiles-language');
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Language Auto-Detection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant={language === 'es' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              Current Language: {language === 'es' ? 'Español' : 'English'}
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Browser Information:</h3>
            {browserInfo && (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <p><strong>Browser Language:</strong> {browserInfo.language}</p>
                <p><strong>Accepted Languages:</strong> {browserInfo.languages?.join(', ')}</p>
                <p><strong>Timezone:</strong> {browserInfo.timezone}</p>
                <p><strong>User Agent:</strong> {browserInfo.userAgent}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detection Logic:</h3>
            <div className="text-sm space-y-2 bg-blue-50 p-4 rounded-lg">
              <p>1. Check saved preference in localStorage</p>
              <p>2. Check if browser language starts with 'es'</p>
              <p>3. Check country code for Spanish-speaking countries</p>
              <p>4. Check timezone for Spanish-speaking regions</p>
              <p>5. Default to English</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLanguage('en')}
              variant={language === 'en' ? 'default' : 'outline'}
            >
              Switch to English
            </Button>
            <Button 
              onClick={() => setLanguage('es')}
              variant={language === 'es' ? 'default' : 'outline'}
            >
              Cambiar a Español
            </Button>
            <Button 
              onClick={clearLanguagePreference}
              variant="destructive"
            >
              Clear & Reload
            </Button>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              Current Translation Sample:
            </h4>
            <p className="text-green-700">
              <strong>Hero Title:</strong> {t.hero.title}
            </p>
            <p className="text-green-700">
              <strong>CTA Button:</strong> {t.hero.ctaFree}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
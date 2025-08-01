import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, MapPin } from "lucide-react";
import { ConditionalMotion } from "@/hooks/use-motion-component";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Treatment } from "@shared/schema";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";

export default function PricingCalculator() {
  const { t, language } = useLanguage();
  const { theme } = useDesign();
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Helper function to get translated treatment name
  const getTranslatedTreatmentName = (treatment: Treatment) => {
    const treatmentMap: Record<string, { en: string; es: string }> = {
      'Dental Cleaning': { en: 'Dental Cleaning', es: 'Limpieza Dental' },
      'Dental Crown': { en: 'Dental Crown', es: 'Corona Dental' },
      'Dental Implant': { en: 'Dental Implant', es: 'Implante Dental' },
      'Porcelain Veneers (per tooth)': { en: 'Porcelain Veneers (per tooth)', es: 'Carillas de Porcelana (por diente)' },
      'Root Canal': { en: 'Root Canal', es: 'Endodoncia' },
      'All-on-4 Implants (full arch)': { en: 'All-on-4 Implants (full arch)', es: 'Implantes All-on-4 (arcada completa)' },
      'Teeth Whitening': { en: 'Teeth Whitening', es: 'Blanqueamiento Dental' },
      'Wisdom Tooth Extraction': { en: 'Wisdom Tooth Extraction', es: 'Extracción de Muela del Juicio' },
      'Dental Bridge (3-unit)': { en: 'Dental Bridge (3-unit)', es: 'Puente Dental (3 unidades)' },
      'Dentures (complete set)': { en: 'Dentures (complete set)', es: 'Dentaduras (juego completo)' },
      // Additional mappings for any database variations
      'Dental Cleaning - Preventive': { en: 'Dental Cleaning', es: 'Limpieza Dental' },
      'Dental Crown - Restorative': { en: 'Dental Crown', es: 'Corona Dental' },
      'Dental Implant - Restorative': { en: 'Dental Implant', es: 'Implante Dental' },
      'Porcelain Veneers (per tooth) - Cosmetic': { en: 'Porcelain Veneers (per tooth)', es: 'Carillas de Porcelana (por diente)' },
      'Root Canal - Endodontic': { en: 'Root Canal', es: 'Endodoncia' },
      'All-on-4 Implants (full arch) - Restorative': { en: 'All-on-4 Implants (full arch)', es: 'Implantes All-on-4 (arcada completa)' },
      'Teeth Whitening - Cosmetic': { en: 'Teeth Whitening', es: 'Blanqueamiento Dental' },
      'Wisdom Tooth Extraction - Oral Surgery': { en: 'Wisdom Tooth Extraction', es: 'Extracción de Muela del Juicio' },
      'Dental Bridge (3-unit) - Restorative': { en: 'Dental Bridge (3-unit)', es: 'Puente Dental (3 unidades)' },
      'Dentures (complete set) - Restorative': { en: 'Dentures (complete set)', es: 'Dentaduras (juego completo)' }
    };

    // Try exact match first, then try without category suffix
    let mapped = treatmentMap[treatment.name];
    if (!mapped) {
      // Try removing category suffix
      const nameWithoutCategory = treatment.name.replace(/ - (Preventive|Restorative|Cosmetic|Endodontic|Oral Surgery)$/, '');
      mapped = treatmentMap[nameWithoutCategory];
    }
    
    return mapped ? mapped[language] : treatment.name;
  };

  // Helper function to get translated category
  const getTranslatedCategory = (category: string) => {
    const categoryMap: Record<string, { en: string; es: string }> = {
      'Preventive': { en: 'Preventive', es: 'Preventivo' },
      'Restorative': { en: 'Restorative', es: 'Restaurativo' },
      'Cosmetic': { en: 'Cosmetic', es: 'Cosmético' },
      'Endodontic': { en: 'Endodontic', es: 'Endodóntico' },
      'Oral Surgery': { en: 'Oral Surgery', es: 'Cirugía Oral' }
    };

    const mapped = categoryMap[category];
    return mapped ? mapped[language] : category;
  };

  const { data: treatmentsData, isLoading } = useQuery<{ success: boolean; data: Treatment[] }>({
    queryKey: ["/api/treatments"],
  });

  const treatments = treatmentsData?.data || [];

  // Set All-on-4 implants as default selection when treatments are loaded
  useEffect(() => {
    if (treatments.length > 0 && !selectedTreatment) {
      const allOn4Treatment = treatments.find(t => 
        t.name.includes('All-on-4') || 
        t.name.includes('All on 4') ||
        t.name.toLowerCase().includes('all-on-4') ||
        t.name.toLowerCase().includes('all on 4')
      );
      
      if (allOn4Treatment) {
        setSelectedTreatment(allOn4Treatment);
      }
    }
  }, [treatments, selectedTreatment]);

  const calculateSavings = () => {
    if (!selectedTreatment) return { savings: 0, percentage: 0 };
    
    const usTotal = parseFloat(selectedTreatment.usPrice) * quantity;
    const mexicoTotal = parseFloat(selectedTreatment.mexicoPrice) * quantity;
    const savings = usTotal - mexicoTotal;
    const percentage = Math.round((savings / usTotal) * 100);
    
    return { savings, percentage, usTotal, mexicoTotal };
  };

  const { savings, percentage, usTotal, mexicoTotal } = calculateSavings();

  return (
    <section id="pricing" className="py-20 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConditionalMotion
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            {t.calculator.badge}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.calculator.subtitle}
          </p>
        </ConditionalMotion>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <ConditionalMotion
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-blue-100 shadow-xl">
              <CardHeader className="bg-primary text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.calculator.badge}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.calculator.selectTreatment}
                  </label>
                  <Select 
                    value={selectedTreatment?.id || ""} 
                    onValueChange={(value) => {
                      const treatment = treatments.find(t => t.id === value);
                      setSelectedTreatment(treatment || null);
                    }} 
                    disabled={isLoading}
                  >
                    <SelectTrigger aria-label={t.calculator.selectTreatment}>
                      <SelectValue placeholder={isLoading ? t.common.loading : t.calculator.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {treatments.map((treatment) => (
                        <SelectItem key={treatment.id} value={treatment.id}>
                          {getTranslatedTreatmentName(treatment)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.calculator.quantity}
                  </label>
                  <Select onValueChange={(value) => setQuantity(parseInt(value))}>
                    <SelectTrigger aria-label={t.calculator.quantity}>
                      <SelectValue placeholder="1" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? (language === 'es' ? 'tratamiento' : 'treatment') : (language === 'es' ? 'tratamientos' : 'treatments')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTreatment && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{getTranslatedTreatmentName(selectedTreatment)}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">{language === 'es' ? 'Categoría:' : 'Category:'}</span> {getTranslatedCategory(selectedTreatment.category)}</p>
                      {selectedTreatment.duration && (
                        <p><span className="font-medium">{language === 'es' ? 'Duración:' : 'Duration:'}</span> {selectedTreatment.duration}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </ConditionalMotion>

          <ConditionalMotion
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {selectedTreatment ? (
              <>
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-900">{t.common.unitedStates}</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700">
                        ${usTotal?.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-red-600">
                      {t.common.usCost}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">{t.common.mexico}</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        ${mexicoTotal?.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-green-600">
                      {t.common.mexicoCost}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary-border bg-primary-light">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-center mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ${savings.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {percentage}% {t.common.savings}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{t.calculator.readyToSave}</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {t.calculator.getPersonalized}
                  </p>
                  <Link href="/booking">
                    <button 
                      className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      {t.nav.consultation}
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {t.calculator.emptyState}
                  </h3>
                  <p className="text-gray-600">
                    {t.calculator.emptySubtitle}
                  </p>
                </CardContent>
              </Card>
            )}
          </ConditionalMotion>
        </div>

        <ConditionalMotion
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-700 text-sm">
              <strong>{t.about.noteTitle}:</strong> {t.about.noteDesc}
            </p>
          </div>
        </ConditionalMotion>
      </div>
    </section>
  );
}
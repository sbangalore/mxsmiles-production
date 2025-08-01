import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TREATMENT_OPTIONS } from "@/lib/types";
import { ConditionalMotion } from "@/hooks/use-motion-component";
import { useScrollAnimation, useAnimationPresets } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/contexts/language-context";

export default function CostComparison() {
  const { ref, controls } = useScrollAnimation();
  const { t } = useLanguage();
  const { fadeInUp, staggerContainer, staggerItem } = useAnimationPresets();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConditionalMotion 
          className="text-center mb-16"
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.pricing.title}</h2>
          <p className="text-xl text-[var(--trust-gray)] max-w-3xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </ConditionalMotion>
        
        {/* Interactive Cost Calculator */}
        <ConditionalMotion
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
            }
          }}
        >
          <Card className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <ConditionalMotion 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
          >
            {/* USA Pricing */}
            <div className="text-center">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 bg-red-50 border border-red-200 rounded-xl p-6">
                  {t.pricing.usPrice}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {TREATMENT_OPTIONS.slice(0, 4).map((treatment) => (
                  <div key={treatment.id} className="flex justify-between">
                    <span className="text-[var(--trust-gray)]">{treatment.name}</span>
                    <span className="font-semibold text-red-600">${treatment.usPrice.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </div>
            
            {/* Mexico Pricing */}
            <div className="text-center">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 bg-[var(--health-green)]/10 border border-[var(--health-green)]/30 rounded-xl p-6">
                  {t.pricing.mexicoPrice}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {TREATMENT_OPTIONS.slice(0, 4).map((treatment) => (
                  <div key={treatment.id} className="flex justify-between">
                    <span className="text-[var(--trust-gray)]">{treatment.name}</span>
                    <span className="font-semibold text-[var(--health-green)]">${treatment.mexicoPrice.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </div>
            
            {/* Savings */}
            <div className="text-center">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 bg-[var(--mexican-orange)]/10 border border-[var(--mexican-orange)]/30 rounded-xl p-6">
                  {t.pricing.yourSavings}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {TREATMENT_OPTIONS.slice(0, 4).map((treatment) => (
                  <div key={treatment.id} className="flex justify-between">
                    <span className="text-[var(--trust-gray)]">{t.pricing.save}</span>
                    <span className="font-semibold text-[var(--mexican-orange)]">
                      ${treatment.savings.toLocaleString()} ({treatment.savingsPercent}%)
                    </span>
                  </div>
                ))}
              </CardContent>
            </div>
          </ConditionalMotion>
          
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-[var(--medical-blue)]/10 to-[var(--health-green)]/10 rounded-xl">
            <p className="text-lg font-semibold text-gray-900 mb-2">{t.pricing.evenWithTravel}</p>
            <p className="text-[var(--trust-gray)]">{t.pricing.comprehensiveCare}</p>
          </div>
        </Card>
        </ConditionalMotion>
      </div>
    </section>
  );
}

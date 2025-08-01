import { Card, CardContent } from "@/components/ui/card";
import { TREATMENT_OPTIONS } from "@/lib/types";
import { Crown, Smile, Stethoscope, Zap } from "lucide-react";
import { FaTooth, FaTeeth } from "react-icons/fa";
import { motion } from "framer-motion";
import { useScrollAnimation, useAnimationPresets } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/contexts/language-context";

const getIcon = (iconName: string) => {
  const iconMap = {
    tooth: FaTooth,
    crown: Crown,
    smile: Smile,
    stethoscope: Stethoscope,
    teeth: FaTeeth,
    "teeth-open": Zap,
  };
  
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || FaTooth;
  return <IconComponent className="text-2xl" />;
};

export default function ServicesGrid() {
  const { ref, controls } = useScrollAnimation();
  const { t } = useLanguage();
  const { fadeInUp, staggerContainer, staggerItem } = useAnimationPresets();

  const getLocalizedTreatment = (service: any) => {
    const treatmentMap = {
      'implants': t.treatments.dentalImplants,
      'crowns': t.treatments.crownsAndBridges,
      'veneers': t.treatments.porcelainVeneers,
      'root-canal': t.treatments.rootCanal,
      'all-on-4': t.treatments.allOn4,
      'orthodontics': t.treatments.orthodontics
    };
    return treatmentMap[service.id as keyof typeof treatmentMap] || { name: service.name, description: service.description };
  };

  return (
    <section className="pt-8 pb-20 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.services.title}</h2>
          <p className="text-xl text-[var(--trust-gray)] max-w-3xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {TREATMENT_OPTIONS.map((service, index) => (
            <motion.div key={service.id} variants={staggerItem}>
              <Card className="bg-[var(--light-bg)] rounded-xl p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className={`w-16 h-16 ${
                  index % 3 === 0 ? 'bg-[var(--medical-blue)]/10' : 
                  index % 3 === 1 ? 'bg-[var(--health-green)]/10' : 
                  'bg-[var(--mexican-orange)]/10'
                } rounded-xl flex items-center justify-center mb-6`}>
                  <div className={
                    index % 3 === 0 ? 'text-[var(--medical-blue)]' : 
                    index % 3 === 1 ? 'text-[var(--health-green)]' : 
                    'text-[var(--mexican-orange)]'
                  }>
                    {getIcon(service.icon)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{getLocalizedTreatment(service).name}</h3>
                <p className="text-[var(--trust-gray)] mb-4">{getLocalizedTreatment(service).description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--health-green)]">
                    ${service.mexicoPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-[var(--trust-gray)] line-through">
                    US: ${service.usPrice.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

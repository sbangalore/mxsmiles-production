import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Plane, Building2 } from "lucide-react";
import { LOCATIONS } from "@/lib/types";
import { motion } from "framer-motion";
import { useScrollAnimation, useAnimationPresets } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/contexts/language-context";

export default function Locations() {
  const { ref, controls } = useScrollAnimation();
  const { t } = useLanguage();
  const { fadeInUp, staggerContainer, staggerItem } = useAnimationPresets();

  const getLocalizedLocation = (location: any) => {
    const locationMap = {
      'los-algodones': t.locationDetails.losAlgodones,
      'tijuana': t.locationDetails.tijuana
    };
    return locationMap[location.id as keyof typeof locationMap] || {
      name: location.name,
      description: location.description,
      distance: location.distance,
      walkTime: location.walkTime,
      airportDistance: location.airportDistance,
      features: location.features[0]
    };
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.locations.title}</h2>
          <p className="text-xl text-[var(--trust-gray)] max-w-3xl mx-auto">
            {t.locations.subtitle}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {LOCATIONS.map((location) => (
            <motion.div key={location.id} variants={staggerItem}>
              <Card className="bg-[var(--light-bg)] rounded-xl p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src={location.imageUrl} 
                    alt={`${location.name} Mexico`} 
                    className="w-20 h-20 rounded-lg object-cover mr-4" 
                    loading="lazy"
                    decoding="async"
                    width="80"
                    height="80"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{getLocalizedLocation(location).name}</h3>
                    <p className="text-[var(--trust-gray)]">{getLocalizedLocation(location).description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-[var(--mexican-orange)] mr-3 flex-shrink-0" />
                    <span className="text-[var(--trust-gray)]">{getLocalizedLocation(location).distance}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[var(--mexican-orange)] mr-3 flex-shrink-0" />
                    <span className="text-[var(--trust-gray)]">{getLocalizedLocation(location).walkTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Plane className="w-5 h-5 text-[var(--mexican-orange)] mr-3 flex-shrink-0" />
                    <span className="text-[var(--trust-gray)]">{getLocalizedLocation(location).airportDistance}</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-[var(--mexican-orange)] mr-3 flex-shrink-0" />
                    <span className="text-[var(--trust-gray)]">{getLocalizedLocation(location).features}</span>
                  </div>
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

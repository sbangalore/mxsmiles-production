import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, useAnimationPresets } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/contexts/language-context";

export default function Team() {
  const { ref, controls } = useScrollAnimation();
  const { t } = useLanguage();
  const { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } = useAnimationPresets();

  return (
    <section className="py-20 bg-[var(--light-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.about.team}</h2>
          <p className="text-xl text-[var(--trust-gray)] max-w-3xl mx-auto">
            {t.about.teamDesc}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeInLeft}
          >
            <img 
              src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop" 
              alt="Modern dental facility in Mexico" 
              className="rounded-2xl shadow-xl w-full h-auto" 
            />
          </motion.div>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeInRight}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.about.facilities}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-[var(--health-green)] text-xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{t.about.professionalEquipment}</h4>
                  <p className="text-[var(--trust-gray)]">{t.about.professionalEquipmentDesc}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-[var(--health-green)] text-xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{t.about.internationalStandards}</h4>
                  <p className="text-[var(--trust-gray)]">{t.about.internationalStandardsDesc}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-[var(--health-green)] text-xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{t.about.comprehensiveCareTitle}</h4>
                  <p className="text-[var(--trust-gray)]">{t.about.comprehensiveCareDesc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Team Members */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {/* Dr. Rodriguez */}
          <motion.div variants={staggerItem}>
            <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=face" 
                alt={t.team.drRodriguez.name} 
                className="w-full h-64 object-cover" 
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.team.drRodriguez.name}</h3>
                <p className="text-[var(--medical-blue)] font-medium mb-3">{t.team.drRodriguez.title}</p>
                <p className="text-[var(--trust-gray)] text-sm mb-4">
                  {t.team.drRodriguez.education}, {t.team.drRodriguez.experience} in {t.team.drRodriguez.speciality.toLowerCase()}.
                </p>
                <div className="flex items-center text-sm text-[var(--trust-gray)]">
                  <Award className="w-4 h-4 text-[var(--health-green)] mr-2 flex-shrink-0" />
                  <span>{t.team.drRodriguez.certifications.boardCertified}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {t.team.drRodriguez.certifications.adaMember}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {t.team.drRodriguez.certifications.oralImplantologists}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dr. Martinez */}
          <motion.div variants={staggerItem}>
            <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face" 
                alt={t.team.drMartinez.name} 
                className="w-full h-64 object-cover" 
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.team.drMartinez.name}</h3>
                <p className="text-[var(--medical-blue)] font-medium mb-3">{t.team.drMartinez.title}</p>
                <p className="text-[var(--trust-gray)] text-sm mb-4">
                  {t.team.drMartinez.education}, {t.team.drMartinez.experience} in {t.team.drMartinez.speciality.toLowerCase()}.
                </p>
                <div className="flex items-center text-sm text-[var(--trust-gray)]">
                  <Award className="w-4 h-4 text-[var(--health-green)] mr-2 flex-shrink-0" />
                  <span>{t.team.drMartinez.certifications.aestheticCertified}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {t.team.drMartinez.certifications.smileDesign}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {t.team.drMartinez.certifications.porcelainExpert}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dr. Garcia */}
          <motion.div variants={staggerItem}>
            <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop&crop=face" 
                alt={t.team.drGarcia.name} 
                className="w-full h-64 object-cover" 
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.team.drGarcia.name}</h3>
                <p className="text-[var(--medical-blue)] font-medium mb-3">{t.team.drGarcia.title}</p>
                <p className="text-[var(--trust-gray)] text-sm mb-4">
                  {t.team.drGarcia.education}, {t.team.drGarcia.experience} in {t.team.drGarcia.speciality.toLowerCase()}.
                </p>
                <div className="flex items-center text-sm text-[var(--trust-gray)]">
                  <Award className="w-4 h-4 text-[var(--health-green)] mr-2 flex-shrink-0" />
                  <span>{t.team.drGarcia.certifications.endodonticBoard}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {t.team.drGarcia.certifications.microscopicEndo}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {t.team.drGarcia.certifications.rotaryEndo}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Shield, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useDesign } from "@/contexts/design-context";
import { ConditionalMotion } from "@/hooks/use-motion-component";

export default function About() {
  const { t } = useLanguage();
  const { theme } = useDesign();
  
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConditionalMotion 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t.about.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </ConditionalMotion>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ConditionalMotion
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-6 h-full">
              <CardContent className="p-0 flex flex-col items-center">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">15,000+</h3>
                <p className="text-gray-600">{t.about.happyPatients}</p>
              </CardContent>
            </Card>
          </ConditionalMotion>

          <ConditionalMotion
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-6 h-full">
              <CardContent className="p-0 flex flex-col items-center">
                <Award className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">25+</h3>
                <p className="text-gray-600">{t.about.yearsExperience}</p>
              </CardContent>
            </Card>
          </ConditionalMotion>

          <ConditionalMotion
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-6 h-full">
              <CardContent className="p-0 flex flex-col items-center">
                <Shield className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
                <p className="text-gray-600">{t.about.averageRating}</p>
              </CardContent>
            </Card>
          </ConditionalMotion>

          <ConditionalMotion
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-6 h-full">
              <CardContent className="p-0 flex flex-col items-center">
                <MapPin className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">2</h3>
                <p className="text-gray-600">{t.about.averageSavings}</p>
              </CardContent>
            </Card>
          </ConditionalMotion>
        </div>

        {/* Mission Statement */}
        <ConditionalMotion 
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.about.mission}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.about.missionDesc}
            </p>
          </div>
        </ConditionalMotion>

        {/* Facilities & Standards */}
        <ConditionalMotion 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <img 
              src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop&fm=webp&q=85" 
              alt="Modern dental facility in Mexico" 
              className="rounded-2xl shadow-xl w-full h-auto" 
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.about.facilities}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.about.professionalEquipment}</h4>
                  <p className="text-gray-600">{t.about.professionalEquipmentDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.about.internationalStandards}</h4>
                  <p className="text-gray-600">{t.about.internationalStandardsDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.about.comprehensiveCareTitle}</h4>
                  <p className="text-gray-600">{t.about.comprehensiveCareDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </ConditionalMotion>

        {/* Our Team */}
        <ConditionalMotion
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.about.team}</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t.about.teamDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team member cards will be added here when profiles are ready */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t.about.expertDentalTeam}</h4>
              <p className="text-gray-600 text-sm">{t.about.expertDentalTeamDesc}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t.about.certifiedSpecialists}</h4>
              <p className="text-gray-600 text-sm">{t.about.certifiedSpecialistsDesc}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t.about.qualityAssurance}</h4>
              <p className="text-gray-600 text-sm">{t.about.qualityAssuranceDesc}</p>
            </div>
          </div>
        </ConditionalMotion>
      </div>
    </section>
  );
}
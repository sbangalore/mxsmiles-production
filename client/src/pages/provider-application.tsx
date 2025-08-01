import React from "react";
import ProviderApplicationForm from "@/components/forms/provider-application-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Building2, Users, DollarSign, Globe } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language-context";

export default function ProviderApplicationPage() {
  const { t } = useLanguage();
  
  // Redirect to Cal.com booking for provider partnership
  React.useEffect(() => {
    window.location.href = '/booking';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>{t.providerApplication.seoTitle}</title>
        <meta 
          name="description" 
          content={t.providerApplication.seoDescription}
        />
        <meta name="keywords" content="MxSmiles provider application, dental tourism provider, Mexico dental provider, international dental patients" />
        <link rel="canonical" href="https://mxsmiles.com/provider-application" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t.providerApplication.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {t.providerApplication.subtitle}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Building2 className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.providerApplication.benefits.expandReach.title}</h3>
              <p className="text-sm text-gray-600">{t.providerApplication.benefits.expandReach.description}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Users className="w-8 h-8 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.providerApplication.benefits.growPractice.title}</h3>
              <p className="text-sm text-gray-600">{t.providerApplication.benefits.growPractice.description}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.providerApplication.benefits.competitiveRates.title}</h3>
              <p className="text-sm text-gray-600">{t.providerApplication.benefits.competitiveRates.description}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Globe className="w-8 h-8 text-orange-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.providerApplication.benefits.globalPlatform.title}</h3>
              <p className="text-sm text-gray-600">{t.providerApplication.benefits.globalPlatform.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.providerApplication.requirements.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  {t.providerApplication.requirements.qualifications.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t.providerApplication.requirements.qualifications.licensed}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t.providerApplication.requirements.qualifications.experience}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t.providerApplication.requirements.qualifications.boardCertified}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t.providerApplication.requirements.qualifications.continuingEducation}
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  {t.providerApplication.requirements.facility.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {t.providerApplication.requirements.facility.modernEquipment}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {t.providerApplication.requirements.facility.sterilization}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {t.providerApplication.requirements.facility.accessibility}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {t.providerApplication.requirements.facility.englishStaff}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <ProviderApplicationForm />
      </section>
      </div>
    </>
  );
}
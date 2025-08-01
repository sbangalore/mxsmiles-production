import { useLanguage } from "@/contexts/language-context";
import { AlertTriangle } from "lucide-react";

export default function MedicalDisclaimer() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--light-bg)] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {t.legal.medicalDisclaimer.title}
            </h1>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg text-[var(--trust-gray)] mb-8">
              {t.legal.medicalDisclaimer.lastUpdated}: January 2025
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <div className="flex">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">
                    {t.legal.medicalDisclaimer.important.title}
                  </h3>
                  <p className="text-yellow-700">
                    {t.legal.medicalDisclaimer.important.content}
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.notMedicalAdvice.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.medicalDisclaimer.notMedicalAdvice.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.facilitation.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <p>{t.legal.medicalDisclaimer.facilitation.description}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t.legal.medicalDisclaimer.facilitation.coordination}</li>
                  <li>{t.legal.medicalDisclaimer.facilitation.information}</li>
                  <li>{t.legal.medicalDisclaimer.facilitation.communication}</li>
                  <li>{t.legal.medicalDisclaimer.facilitation.logistics}</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.professionalRelationship.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.medicalDisclaimer.professionalRelationship.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.risks.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <p>{t.legal.medicalDisclaimer.risks.acknowledgment}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t.legal.medicalDisclaimer.risks.medical}</li>
                  <li>{t.legal.medicalDisclaimer.risks.travel}</li>
                  <li>{t.legal.medicalDisclaimer.risks.communication}</li>
                  <li>{t.legal.medicalDisclaimer.risks.legal}</li>
                  <li>{t.legal.medicalDisclaimer.risks.emergency}</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.informed.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.medicalDisclaimer.informed.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.emergency.title}
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-6">
                <div className="flex">
                  <AlertTriangle className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">
                      {t.legal.medicalDisclaimer.emergency.warning}
                    </h3>
                    <p className="text-red-700">
                      {t.legal.medicalDisclaimer.emergency.content}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.credentials.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.medicalDisclaimer.credentials.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.changes.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.medicalDisclaimer.changes.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.medicalDisclaimer.contact.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-2">
                <p>{t.legal.medicalDisclaimer.contact.intro}</p>
                <p>Email: medical@mxsmiles.com</p>
                <p>Phone: +1 (800) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
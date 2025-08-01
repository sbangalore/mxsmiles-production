import { useLanguage } from "@/contexts/language-context";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--light-bg)] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            {t.legal.privacyPolicy.title}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-[var(--trust-gray)] mb-8">
              {t.legal.privacyPolicy.lastUpdated}: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.introduction.title}
              </h2>
              <p className="text-[var(--trust-gray)] mb-4">
                {t.legal.privacyPolicy.introduction.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.informationCollected.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <h3 className="text-xl font-medium text-gray-800">
                  {t.legal.privacyPolicy.informationCollected.personalInfo.title}
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t.legal.privacyPolicy.informationCollected.personalInfo.name}</li>
                  <li>{t.legal.privacyPolicy.informationCollected.personalInfo.contact}</li>
                  <li>{t.legal.privacyPolicy.informationCollected.personalInfo.medical}</li>
                  <li>{t.legal.privacyPolicy.informationCollected.personalInfo.photos}</li>
                </ul>
                
                <h3 className="text-xl font-medium text-gray-800 mt-6">
                  {t.legal.privacyPolicy.informationCollected.automaticInfo.title}
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t.legal.privacyPolicy.informationCollected.automaticInfo.ip}</li>
                  <li>{t.legal.privacyPolicy.informationCollected.automaticInfo.browser}</li>
                  <li>{t.legal.privacyPolicy.informationCollected.automaticInfo.usage}</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.howWeUse.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--trust-gray)]">
                <li>{t.legal.privacyPolicy.howWeUse.consultations}</li>
                <li>{t.legal.privacyPolicy.howWeUse.coordination}</li>
                <li>{t.legal.privacyPolicy.howWeUse.communication}</li>
                <li>{t.legal.privacyPolicy.howWeUse.improvement}</li>
                <li>{t.legal.privacyPolicy.howWeUse.legal}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.sharing.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <p>{t.legal.privacyPolicy.sharing.intro}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t.legal.privacyPolicy.sharing.providers}</li>
                  <li>{t.legal.privacyPolicy.sharing.services}</li>
                  <li>{t.legal.privacyPolicy.sharing.legal}</li>
                  <li>{t.legal.privacyPolicy.sharing.consent}</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.security.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.privacyPolicy.security.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.rights.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--trust-gray)]">
                <li>{t.legal.privacyPolicy.rights.access}</li>
                <li>{t.legal.privacyPolicy.rights.correct}</li>
                <li>{t.legal.privacyPolicy.rights.delete}</li>
                <li>{t.legal.privacyPolicy.rights.opt}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.privacyPolicy.contact.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-2">
                <p>{t.legal.privacyPolicy.contact.intro}</p>
                <p>Email: privacy@mxsmiles.com</p>
                <p>Phone: +1 (800) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
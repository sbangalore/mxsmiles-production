import { useLanguage } from "@/contexts/language-context";

export default function TermsOfService() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--light-bg)] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            {t.legal.termsOfService.title}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-[var(--trust-gray)] mb-8">
              {t.legal.termsOfService.lastUpdated}: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.acceptance.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.termsOfService.acceptance.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.services.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <p>{t.legal.termsOfService.services.description}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t.legal.termsOfService.services.consultation}</li>
                  <li>{t.legal.termsOfService.services.coordination}</li>
                  <li>{t.legal.termsOfService.services.support}</li>
                  <li>{t.legal.termsOfService.services.information}</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.userResponsibilities.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--trust-gray)]">
                <li>{t.legal.termsOfService.userResponsibilities.accurate}</li>
                <li>{t.legal.termsOfService.userResponsibilities.medical}</li>
                <li>{t.legal.termsOfService.userResponsibilities.payment}</li>
                <li>{t.legal.termsOfService.userResponsibilities.travel}</li>
                <li>{t.legal.termsOfService.userResponsibilities.compliance}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.limitations.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <p>{t.legal.termsOfService.limitations.facilitation}</p>
                <p>{t.legal.termsOfService.limitations.medical}</p>
                <p>{t.legal.termsOfService.limitations.outcomes}</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.payment.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--trust-gray)]">
                <li>{t.legal.termsOfService.payment.consultation}</li>
                <li>{t.legal.termsOfService.payment.treatment}</li>
                <li>{t.legal.termsOfService.payment.travel}</li>
                <li>{t.legal.termsOfService.payment.refund}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.liability.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-4">
                <p>{t.legal.termsOfService.liability.limitation}</p>
                <p>{t.legal.termsOfService.liability.indemnification}</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.termination.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.termsOfService.termination.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.governing.title}
              </h2>
              <p className="text-[var(--trust-gray)]">
                {t.legal.termsOfService.governing.content}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.legal.termsOfService.contact.title}
              </h2>
              <div className="text-[var(--trust-gray)] space-y-2">
                <p>{t.legal.termsOfService.contact.intro}</p>
                <p>Email: legal@mxsmiles.com</p>
                <p>Phone: +1 (800) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
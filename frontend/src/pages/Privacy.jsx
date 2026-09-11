import siteConfig from '../config/site';

export default function Privacy() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-2xl font-semibold text-stone-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="text-base font-semibold text-stone-900">1. Information We Collect</h2>
          <p className="mt-2">
            When you submit an enquiry, list a property, or contact us, we collect information you
            provide directly — such as your name, phone number, WhatsApp number, email address,
            and details about the property or your requirements.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">2. How We Use It</h2>
          <p className="mt-2">
            We use this information to respond to enquiries, coordinate site visits and
            negotiations between buyers and owners, publish property listings (excluding private
            owner details), and improve our service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">3. Owner &amp; Buyer Privacy</h2>
          <p className="mt-2">
            Property owner contact details, asking price, minimum expected price, negotiation
            notes and internal admin notes are kept private and are never published on the public
            website. Only {siteConfig.businessName}'s admin team can access this information, and
            it is used solely to facilitate a transaction between the relevant parties.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">4. Data Sharing</h2>
          <p className="mt-2">
            We do not sell your personal information. Buyer enquiry details are shared with the
            relevant property owner only to the extent necessary to progress a transaction, and
            only through {siteConfig.businessName} as intermediary.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">5. Contact</h2>
          <p className="mt-2">
            Questions about this policy can be directed to {siteConfig.contact.email} or{' '}
            {siteConfig.contact.phoneDisplay}.
          </p>
        </section>
      </div>
    </div>
  );
}

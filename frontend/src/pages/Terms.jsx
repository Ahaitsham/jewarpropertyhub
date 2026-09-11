import siteConfig from '../config/site';

export default function Terms() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-2xl font-semibold text-stone-900">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="text-base font-semibold text-stone-900">1. About {siteConfig.businessName}</h2>
          <p className="mt-2">
            {siteConfig.businessName} ("we", "us", "the Platform") is a property discovery and
            brokerage service operated by {siteConfig.founder.name}, focused on Jewar and
            surrounding areas of Uttar Pradesh. The Platform is designed and developed by{' '}
            {siteConfig.founder.name}, who is also its {siteConfig.founder.title.toLowerCase()}.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">2. Nature of Service</h2>
          <p className="mt-2">
            {siteConfig.businessName} acts as an intermediary between property owners/sellers and
            potential buyers or tenants. We list properties on behalf of owners, receive enquiries
            from buyers, and coordinate communication, site visits and negotiation between the two
            parties. We do not claim ownership of any listed property.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">3. Commission on Closed Deals</h2>
          <p className="mt-2">
            Where a sale, purchase, rental or lease deal is closed between a buyer and a seller as
            a direct or indirect result of a property listed on, or an enquiry made through,{' '}
            {siteConfig.businessName}, {siteConfig.founder.name} shall be entitled to a commission
            of <strong>{siteConfig.commissionPercent}% of the final transaction value</strong> of
            that deal, payable by the party or parties as agreed at the time the deal is
            facilitated.
          </p>
          <p className="mt-2">
            This commission is separate from, and in addition to, any commission or fee that may
            be separately negotiated and agreed in writing between {siteConfig.businessName} and
            an individual owner or buyer for a specific property. Where a specific written
            agreement exists for a property, its terms govern the commission for that property.
          </p>
          <p className="mt-2">
            Owners and buyers using this Platform acknowledge and accept this commission term by
            submitting a property listing, submitting an enquiry, or otherwise engaging{' '}
            {siteConfig.businessName} to facilitate a transaction.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">4. Property Listings</h2>
          <p className="mt-2">
            Properties are added to the Platform by our team after receiving details from property
            owners. Public listings show information intended to help buyers evaluate a property.
            Owner contact details and private negotiation information are not published publicly
            and are used only internally by {siteConfig.businessName} to facilitate a deal.
          </p>
          <p className="mt-2">
            While we make reasonable efforts to verify property information, we do not guarantee
            the accuracy, completeness or current availability of every listing. Buyers are
            encouraged to independently verify property details, ownership documents and title
            before proceeding with any transaction.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">5. Enquiries and Communication</h2>
          <p className="mt-2">
            When you submit an enquiry or a "List Your Property" request, you consent to{' '}
            {siteConfig.businessName} contacting you by phone, WhatsApp or email regarding that
            enquiry or listing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">6. No Guarantee of Sale or Purchase</h2>
          <p className="mt-2">
            Listing a property on, or submitting an enquiry through, {siteConfig.businessName}{' '}
            does not guarantee that a sale, purchase, rental or lease will be completed. We
            facilitate connections and negotiations in good faith but are not a party to the
            underlying property transaction or its legal documentation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">7. Limitation of Liability</h2>
          <p className="mt-2">
            {siteConfig.businessName} is not liable for disputes arising directly between a buyer
            and a seller, including disputes over property title, condition, documentation or
            payment, except to the extent such disputes arise from our own negligence or
            misrepresentation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">8. Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms &amp; Conditions from time to time. Continued use of the
            Platform after changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900">9. Contact</h2>
          <p className="mt-2">
            For questions about these terms, contact {siteConfig.founder.name} at{' '}
            {siteConfig.contact.email} or {siteConfig.contact.phoneDisplay}.
          </p>
        </section>
      </div>
    </div>
  );
}

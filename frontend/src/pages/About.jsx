import siteConfig from '../config/site';

export default function About() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-2xl font-semibold text-stone-900">About {siteConfig.businessName}</h1>
      <p className="mt-4 text-stone-600 leading-relaxed">
        {siteConfig.businessName} helps buyers discover property in {siteConfig.location.city}{' '}
        and nearby areas of {siteConfig.location.state}, and connects serious buyers with
        property owners through a trusted local intermediary. We work directly with property
        owners to list plots, houses, flats, commercial spaces and agricultural land, and guide
        buyers from enquiry through to a closed deal.
      </p>
      <p className="mt-4 text-stone-600 leading-relaxed">
        Rather than exposing owner contact details publicly, our team coordinates every enquiry —
        site visits, negotiation and paperwork — so both buyers and sellers deal with one
        accountable point of contact.
      </p>

      <div className="mt-8 card p-5">
        <p className="text-sm text-stone-500">Founded and run by</p>
        <p className="mt-1 text-lg font-semibold text-stone-900">{siteConfig.founder.name}</p>
        <p className="text-sm text-stone-500">{siteConfig.founder.title}, {siteConfig.businessName}</p>
      </div>
    </div>
  );
}

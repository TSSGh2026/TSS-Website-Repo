import { usePageSeo, faqPage, breadcrumb, ORG_ID, SITE_ORIGIN } from "@/lib/seo";
import "@/styles/offer.css";
import { Hero } from "@/components/offer/sections/hero";
import { TheOfferLine } from "@/components/offer/sections/the-offer-line";
import { WhyUs } from "@/components/offer/sections/why-us";
import { Offer } from "@/components/offer/sections/offer";
import { HowItWorks } from "@/components/offer/sections/how-it-works";
import { ApplyForm } from "@/components/offer/sections/apply-form";
import { Faq, ITEMS as FAQ_ITEMS } from "@/components/offer/sections/faq";
import { Footer } from "@/components/offer/sections/footer";
import { StickyCta } from "@/components/offer/sticky-cta";

/**
 * The website offer landing page: a standing offer, no deadline and no cap on brands.
 *
 * Deliberately self-contained: no site Navbar, no site Footer, no exit links.
 * The only ways off this page are the apply form, Calendly, WhatsApp and
 * /offer/terms. Don't "helpfully" add the global nav.
 */
export default function OfferPage() {
  /* The title must match the /offer entry in script/prerender.ts.

     This is the one page on the site with a hard price on it, which is what a
     person asking "what does a website cost in India" is looking for, so the
     price is stated as an Offer a machine can read rather than left for it to
     find in a headline. The FAQPage is built from the same ITEMS the page
     shows. Both figures come from offer-config's terms: change them there and
     here together. */
  usePageSeo("offer", {
    title: "One website. ₹80,000. Live in 10 working days. — The Story Shapers",
    jsonLd: [
      {
        "@type": "Service",
        "@id": `${SITE_ORIGIN}/offer#service`,
        name: "Brand website, written, designed and built",
        serviceType: "Website copywriting, design and development",
        description:
          "A brand website of up to five pages with strategy, copywriting, design and build included, live in 10 working days once the client's assets are received.",
        url: `${SITE_ORIGIN}/offer`,
        provider: { "@id": ORG_ID },
        areaServed: ["India", "Worldwide"],
        termsOfService: `${SITE_ORIGIN}/offer/terms`,
        offers: {
          "@type": "Offer",
          price: "80000",
          priceCurrency: "INR",
          url: `${SITE_ORIGIN}/offer`,
          availability: "https://schema.org/InStock",
          description:
            "₹80,000 all in. ₹25,000 books the slot and the ₹55,000 balance is due on completion.",
        },
      },
      faqPage(FAQ_ITEMS),
      breadcrumb([
        ["The Story Shapers", "/"],
        ["The website offer", "/offer"],
      ]),
    ],
  });

  return (
    <div className="offer-page min-h-screen">
      <div className="relative z-1">
        <Hero />
        <TheOfferLine />
        <WhyUs />
        <Offer />
        <HowItWorks />
        {/* Testimonials sit here when real, permissioned quotes exist. The
            section and its config are built and kept — see
            components/offer/sections/testimonials.tsx. */}
        <ApplyForm />
        <Faq />
        <Footer />
      </div>
      <StickyCta />
    </div>
  );
}

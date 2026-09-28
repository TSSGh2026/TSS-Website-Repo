import { useEffect } from "react";
import "@/styles/offer.css";
import { Hero } from "@/components/offer/sections/hero";
import { TheOfferLine } from "@/components/offer/sections/the-offer-line";
import { WhyUs } from "@/components/offer/sections/why-us";
import { Offer } from "@/components/offer/sections/offer";
import { HowItWorks } from "@/components/offer/sections/how-it-works";
import { ApplyForm } from "@/components/offer/sections/apply-form";
import { Faq } from "@/components/offer/sections/faq";
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
  useEffect(() => {
    const previous = document.title;
    document.title =
      "One website. ₹80,000. Live in 10 working days. — The Story Shapers";
    return () => {
      document.title = previous;
    };
  }, []);

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

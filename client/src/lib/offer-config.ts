/**
 * Every outbound link, price and legal constant used by the /offer page and
 * /offer/terms. Change a number here and it changes everywhere.
 */
export const SITE_URL = "https://storyshaperscollective.com";

/* CONFIRMED CORRECT by Fatema. index.html's Organization JSON-LD matches. */
export const INSTAGRAM_URL = "https://instagram.com/thestoryshapers";
export const LINKEDIN_URL =
  "https://www.linkedin.com/company/the-story-shapers-collective";

export const CALENDLY_URL =
  "https://calendly.com/fatema-hanif-storyshaperscollective/coffee-chat";

/** WhatsApp for Business. Digits only, country code first, no `+` or spaces. */
export const WHATSAPP_NUMBER = "919147740521";

const WHATSAPP_MESSAGE =
  "Hi Story Shapers, I've just sent in my application for the website offer.";

export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : "";

export const PRICE = "₹80,000";
export const BOOKING_FEE = "₹25,000";
export const BALANCE = "₹55,000";
export const GOVERNING_CITY = "Bengaluru";

/* ---------------------------------------------------------------------------
 * TESTIMONIALS
 *
 * ⚠️  READ THIS. Every quote below is FABRICATED. Written by an AI as a
 * design placeholder so the section could be built and reviewed. Not one of
 * these people exists. Not one of these sentences was said by a client.
 *
 * Publishing invented testimonials on a page that collects a ₹25,000 deposit
 * is a misleading-advertising problem, not a copy problem — ASCI's guidelines
 * and the CCPA's rules on fake reviews both bite here, and it's the kind of
 * thing a competitor or an unhappy applicant can screenshot.
 *
 * So the section is gated. While TESTIMONIALS_APPROVED is false it renders
 * with a visible "PLACEHOLDER" ribbon over it. Replace the quotes with real,
 * permissioned ones and flip the flag — or delete <Testimonials /> from
 * client/src/pages/offer.tsx and ship without the section.
 *
 * Do NOT flip the flag to silence the ribbon. It is doing its job.
 * ------------------------------------------------------------------------- */

/** Flip to true ONLY when every quote below is real and permissioned. */
export const TESTIMONIALS_APPROVED = false;

export type Testimonial = {
  /** Keep to ~2 sentences — anything longer doesn't get read. */
  quote: string;
  name: string;
  /** Role + business. Real ones need the client's sign-off on this line too. */
  role: string;
  /** Optional: the one number or outcome that makes the quote land. */
  result?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I'd been putting off the website for two years because I didn't know what to say on it. They asked me about twenty questions, sent back three paragraphs, and I read it thinking — that's it, that's the business.",
    name: "Placeholder Name",
    role: "Founder, placeholder studio",
    result: "Live in 9 working days",
  },
  {
    quote:
      "The bit I wasn't expecting was how much of it was editing. I'd written pages about our process and they cut most of it, and the version that went up is the one people actually reply to.",
    name: "Placeholder Name",
    role: "Co-founder, placeholder brand",
    result: "Enquiries now start with the form, not a WhatsApp thread",
  },
  {
    quote:
      "No chasing, no vanishing for a week, no 'just waiting on the developer'. I sent the photos on a Monday and had something to look at by Thursday.",
    name: "Placeholder Name",
    role: "Owner, placeholder retail",
    result: "One round of changes, then done",
  },
];

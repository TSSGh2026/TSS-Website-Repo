import { Accordion, type QA } from "../accordion";
import { Reveal } from "../reveal";
import { MixedHeading, Section } from "../section";

/* Every answer here has a matching clause in /offer/terms. If you edit one,
   check the other — a FAQ that contradicts the terms is the version a client
   will hold you to. Clause numbers noted so the pairing survives edits.

   Fatema's copy, 13 Aug, used as written. Where an answer opens on a short
   line and then explains, that break is hers and is rendered as two
   paragraphs rather than being run together. */
export const ITEMS: QA[] = [
  {
    q: "Is this offer right for every business?",
    /* Terms clause 4 — the exclusions named here are the ones most likely to
       waste an alignment call. */
    a: "This is designed for brands that need a sharp, high-functioning marketing website and are ready to move quickly. If you need e-commerce, a large catalogue, complex integrations, multilingual functionality or something much more elaborate, tell us in the form. We’ll let you know whether this offer makes sense or whether the project needs a different scope.",
  },
  {
    q: "I already have a website. Can you redo it?",
    /* Terms clause 4 — migration of an existing website or its content. */
    a: "Not as part of this offer. We build your new website from scratch, rather than reworking or fixing an existing one. What you already have can, of course, help us understand your business and what you’d like to do differently this time.",
  },
  {
    q: "I don’t really know what my website should say. Is that a problem?",
    /* Terms clause 2 — copywriting is inside the scope, not an add-on. */
    a: [
      "That is rather the point.",
      "You don’t need to arrive with five beautifully written pages and a sitemap. We’ll ask the questions, understand the business, work out what the website needs to communicate and shape the copy from there.",
    ],
  },
  {
    q: "Do I need to have my branding sorted already?",
    /* Terms clause 4 — brand identity creation is excluded. */
    a: [
      "You’ll need an existing logo and a reasonably established visual identity for us to work with. This offer doesn’t include creating a new brand identity from scratch.",
      "If your brand needs a complete rethink before the website can do its job, we’ll tell you.",
    ],
  },
  {
    q: "What do you need from me before you start?",
    /* Terms clause 6 — the clock starts on the asset checklist, not on
       payment. That distinction is the one clients get wrong. */
    a: [
      "Enough to understand and represent your business properly: existing brand assets, logos, photographs or imagery, product/service information, relevant documents, references and access to anything we need for the build.",
      "We’ll send you one clear checklist rather than making you discover things piecemeal. The 10-working-day clock begins once everything on that list is with us.",
    ],
  },
  {
    q: "How many rounds of changes do I get?",
    /* Terms clause 7 — two copy, one design. Must move together. */
    a: "Two on the copy, one on the design, counted across the whole site rather than per page. Most of the argument happens before anyone writes a word, which is what the 30-minute call is for. We agree what the site is saying, then we write it.",
  },
  {
    q: "What if I need something that isn’t part of the offer?",
    /* Terms clauses 4 and 7 — anything outside scope is quoted separately and
       agreed in writing before the work is done. */
    a: [
      "Ask us.",
      "An extra page, functionality, integration, photography, illustration, content system or anything else outside the agreed scope doesn’t automatically kill the project. We’ll tell you what it involves and quote it separately before doing the additional work.",
    ],
  },
  {
    q: "How much of my time will this need?",
    /* Terms clause 8 — the single decision-maker is a real obligation, not a
       preference. */
    a: "Less than a traditional website project, but we do need you when it matters. There is one initial conversation, a clear asset handover and focused feedback at agreed review points. We ask for one decision-maker from your side so feedback doesn’t turn into a committee sport.",
  },
  {
    q: "What happens after the website goes live?",
    /* Terms clause 13 — fourteen days, defects in our build only. The window
       runs from "launch", which clause 5 defines as the day we notify you the
       site is ready, NOT the day it goes public. Said in plain words here so
       the FAQ can't be read as giving a longer window than the terms do.
       "Handover" was the old wording and now means the repo transfer in
       clause 10 — two different things, so it can't be used for both. */
    a: [
      "We don’t disappear the moment the site launches.",
      "If something in our build is broken, a link isn’t working or there’s a functional error, tell us within 14 days of the day we tell you the site is ready, and we’ll fix it. New pages, new copy, new features or ongoing updates aren’t part of this offer, but we can discuss continued support separately.",
    ],
  },
];

export function Faq() {
  return (
    <Section eyebrow="FAQ">
      <Reveal>
        <MixedHeading display="Frequently" light="asked questions." />
      </Reveal>
      <div className="mt-12 max-w-[880px]">
        <Reveal delay={1}>
          <Accordion items={ITEMS} />
        </Reveal>
      </div>
    </Section>
  );
}

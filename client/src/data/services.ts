/**
 * WHAT WE DO — one source for the homepage's act five and for /services.
 *
 * Two readers, one taxonomy. The homepage names four disciplines and three
 * things under each; /services opens the same four disciplines up into the
 * full catalogue. If the two pages were cut differently a reader who clicked
 * "See everything we do" would land on categories they had never seen, so the
 * disciplines live here once and both pages read them.
 *
 * Sources: the services doc Shaili and Aakanksha wrote (the six service lines,
 * their one-line promises and their scope lists), the tss_website thread of
 * 21 Sep, and the live Shape / Scale / Sharpen cards for performance and
 * retention, which the services doc does not carry.
 *
 * THE HOMEPAGE THREE ARE LITERAL ON PURPOSE. Aakanksha's point in that thread:
 * a founder skimming the homepage should come away knowing "we do blogs, we do
 * newsletters". "Editorial & thought leadership" is a category; "Blogs &
 * newsletters" is a thing somebody needs this quarter.
 *
 * Rules for anything rendered from this file, each learned by breaking it:
 * nothing behind a click, no numerals, no counts, no dashes in front of items.
 */

export type ServiceLine = {
  id: string;
  name: string;
  /** one sentence: what the line is for, in the client's terms */
  promise: string;
  scope: string[];
  /** held off the page until Fatema decides it should be there */
  held?: boolean;
};

export type Discipline = {
  id: string;
  label: string;
  line: string;
  /** the homepage three. Literal nouns, the flagship few. */
  lead: string[];
  /** what /services opens the discipline into */
  lines: ServiceLine[];
};

const ALL: Discipline[] = [
  {
    id: "brand",
    label: "Brand",
    line: "Make people understand why you, not someone else.",
    lead: [
      "Brand strategy & positioning",
      "Naming & brand voice",
      "Go-to-market strategy",
    ],
    lines: [
      {
        id: "brand-strategy",
        name: "Brand strategy & positioning",
        promise:
          "Give the brand something clear to build from: what you stand for, where you fit, and why someone should choose you.",
        scope: [
          "Brand strategy",
          "Brand positioning",
          "Market & category research",
          "Audience research & definition",
          "Customer insights",
          "Competitor analysis",
          "Product-market fit narrative",
          "Value proposition",
          "Brand narrative",
          "Messaging architecture",
          "Brand architecture",
          "Brand voice & tone",
          "Naming & verbal identity",
          "Taglines & brand lines",
          "Brand guidelines & playbooks",
          "Brand & messaging audits",
          "Repositioning",
        ],
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    line: "Give the brand something worth saying. Consistently.",
    lead: [
      "Websites & website copy",
      "Blogs & newsletters",
      "Social media & campaigns",
    ],
    lines: [
      {
        id: "websites",
        name: "Websites",
        promise:
          "Make the business easier to understand. Strategy, structure, copy, design and build, working as one site.",
        scope: [
          "Website strategy",
          "Website audits",
          "Information architecture",
          "Sitemaps & user journeys",
          "Page planning",
          "Website copy",
          "Homepage, product & service pages",
          "About pages",
          "UX writing & microcopy",
          "Landing pages",
          "Campaign landing pages",
          "Conversion copy",
          "Website design",
          "Website development",
          "Website redesigns",
          "Content restructuring & migration",
        ],
      },
      {
        id: "editorial",
        name: "Content & editorial",
        promise:
          "Decide what the brand should publish, then write it: blogs, newsletters, reports and founder columns.",
        scope: [
          "Content strategy",
          "Editorial strategy & positioning",
          "Content pillars",
          "Content IPs & recurring formats",
          "Editorial calendars",
          "Blogs & articles",
          "Features & interviews",
          "Newsletters",
          "Founder columns",
          "Case studies & customer stories",
          "Reports & white papers",
          "Guides & explainers",
          "Branded editorial",
          "Product & PDP content",
          "Ghostwriting",
          "Memoirs & zines",
          "Editorial guidelines",
          "Content audits",
        ],
      },
      {
        id: "social",
        name: "Social, campaigns & launches",
        promise:
          "Plan and run the social, campaigns and launches that put a brand or product in front of people.",
        scope: [
          "Social media strategy & management",
          "Platform & audience strategy",
          "Recurring social IPs",
          "Social calendars & copy",
          "Static & carousel content",
          "Video & short-form content",
          "Campaign strategy",
          "Launch strategy & GTM narrative",
          "Product positioning",
          "Channel planning",
          "Creator & influencer programmes",
          "Brand partnerships",
          "Digital PR",
          "Market-entry communication",
          "Multi-market campaigns",
          "Event communication",
        ],
      },
    ],
  },
  {
    id: "discovery",
    label: "Discovery",
    line: "Getting discovered is useful. Being the answer is better.",
    lead: [
      "SEO & AEO content",
      "Content audits & refreshes",
      "Landing pages & conversion copy",
    ],
    lines: [
      {
        id: "search",
        name: "Search, AEO & discovery",
        promise:
          "Get found on Google, and cited in ChatGPT, Perplexity and AI Overviews.",
        scope: [
          "SEO, AEO & GEO strategy",
          "SEO content",
          "AI discoverability",
          "Search-intent & keyword research",
          "Search-led content architecture",
          "Topic clusters",
          "Editorial SEO",
          "Programmatic & scaled content",
          "Search landing pages",
          "Product discovery content",
          "Content optimisation & refreshes",
          "Opportunity mapping",
          "Landing-page optimisation",
          "Measurement & performance frameworks",
        ],
      },
      /* NOT IN THE SERVICES DOC. Performance and retention were on the live
         Scale card, and Raayed's profile makes them a craft the collective now
         has a named person for. Fatema's call whether this line stays. */
      {
        id: "growth",
        /* Live from 30 Sep, Fatema's call, delivered with Raayed (growth &
           performance marketing, on /team). Not in the services doc; sourced
           from the old Scale card and his craft. No TSS case study shows
           paid or CRM results yet, so the first one that does belongs on
           the rail. */
        name: "Growth & performance",
        promise:
          "Put paid spend behind a story that already works, and keep the customers it brings in.",
        scope: [
          "Performance marketing",
          "Paid media management",
          "Marketplace ads",
          "Acquisition funnels",
          "Customer retention marketing",
          "CRM & lifecycle journeys",
          "Marketing automation",
        ],
      },
    ],
  },
  {
    id: "systems",
    label: "Systems",
    line: "Make good work possible at scale.",
    lead: [
      "Content teams & workflows",
      "AI content workflows",
      "Fractional content leadership",
    ],
    lines: [
      {
        id: "systems",
        name: "Thought leadership & content systems",
        promise:
          "Turn a founder’s expertise into posts, articles and podcasts, and build the workflows that keep them coming.",
        scope: [
          "Thought-leadership strategy",
          "Founder & personal brand strategy",
          "LinkedIn strategy & content",
          "Articles & opinion pieces",
          "Podcast & interview formats",
          "Video concepts & scripts",
          "Proprietary IP",
          "Editorial workflows",
          "AI-assisted content systems",
          "Templates & playbooks",
          "Scalable content production",
          "Fractional content leadership",
          "Ongoing editorial direction",
        ],
      },
    ],
  },
];

/** What the pages render: every discipline, minus any service line on hold. */
export const DISCIPLINES: Discipline[] = ALL.map((d) => ({
  ...d,
  lines: d.lines.filter((l) => !l.held),
}));

/**
 * The homepage hero's CMS-editable copy, in one place.
 *
 * The hero itself is a scripted film whose lines live in the Hero component.
 * What the CMS drives is everything around the film: the headline search
 * engines read, the subheading behind it, and the two buttons it rests on.
 *
 * WHY THIS IS VERSIONED
 *
 * The hero has been rewritten several times, and each rewrite left its own row
 * in the database. Because the stored row is read over the component's
 * defaults, a retired hero kept resurfacing on top of the new one — most
 * recently a "How we work →" button belonging to a version that still had a
 * brand ticker under it. Two things kept that alive: the seed merged the old
 * value forward instead of replacing it, and the build-time prerender reads
 * the *live* API, so a deploy would snapshot the outgoing hero's copy into the
 * incoming hero's static HTML.
 *
 * So the version is checked in both directions. The seed replaces any row that
 * isn't current, and the component ignores any row that isn't current. Copy
 * edited in the admin keeps the current version number, so it survives both.
 *
 * Bump HERO_VERSION when the shipped hero copy below changes.
 */
export const HERO_VERSION = 5;

/**
 * v4 is the scroll-carve hero. The film is no longer a timed sequence of two
 * headlines; it is one sentence that cuts itself down to "We shape stories." as
 * the reader scrolls, and every word of the last line is already in the first.
 *
 * So `heading` is now the END of the film and `subheading` is its BEGINNING —
 * which is also the right way round for a search engine, since the short line
 * is the claim and the long one is the description. And there is one button
 * rather than two: the film has just said what this is, and a second link
 * printed under it is the film explaining itself.
 *
 * `secondaryCta*` stays in the shape because the admin form and the stored rows
 * still carry it. Nothing renders it.
 *
 * v5 sends the button where it says it goes. Through v4 `ctaLink` was
 * "#act-close", so "Start a conversation" scrolled the reader down the whole
 * page to the closing act — where they found a second button, with the same
 * words on it, which was the one that actually opened the form. The button did
 * not start a conversation; it introduced you to the button that would. That is
 * a click and a page of scroll charged to someone who had already decided.
 *
 * It is a version bump rather than a one-word edit because the stored row wins:
 * production held a v4 row carrying "#act-close", and `currentHero` merges any
 * row whose version matches over these defaults. Editing the default alone
 * would have changed nothing on the live site. Moving the version retires that
 * row on both sides — the seed replaces it, the component ignores it.
 *
 * The target is CONTACT.form in client/src/lib/contact.ts — the same place the
 * closing act's button points, so the two buttons that carry the same words now
 * carry the same destination. It is written out rather than imported because
 * `shared` is bundled into the server and should not reach into the client for
 * a constant; if the form ever moves, both change.
 *
 * The hash matters: /contact leads with "Join the Collective", a job
 * application, and the client form is the second card down.
 */
export const HERO_CONTENT = {
  version: HERO_VERSION,
  heading: "We shape stories.",
  headingLine2: "The Story Shapers is a senior-led marketing collective.",
  subheading:
    "We are a full-service, senior-led marketing collective that helps ambitious companies shape brand strategy, positioning, content and go-to-market stories that genuinely land.",
  ctaText: "Start a conversation",
  ctaLink: "/contact#talk",
  secondaryCtaText: "What we do",
  secondaryCtaLink: "#services",
};

export type HeroContent = typeof HERO_CONTENT;

/**
 * The stored hero row, but only if it was written for the hero that is
 * currently shipping. Anything older is discarded in favour of HERO_CONTENT.
 */
export function currentHero(stored: unknown): HeroContent {
  const row = stored as Partial<HeroContent> | undefined;
  return row?.version === HERO_VERSION ? { ...HERO_CONTENT, ...row } : HERO_CONTENT;
}

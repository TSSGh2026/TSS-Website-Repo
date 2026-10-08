import { Link, useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseBody } from "@/components/home/CaseBody";
import { PillLink } from "@/components/home/Shapes";
import NotFound from "@/pages/not-found";
import { BRANDS, ORDERED_CASES, caseBySlug, type OrderedCase } from "@/data/cases";
import { CONTACT } from "@/lib/contact";
import { usePageSeo, breadcrumb, absolute, ORG_ID, SITE_ORIGIN, WEBSITE_ID } from "@/lib/seo";

const NAVY = "#0C0A3E";
const BONE = "#F4F1EA";
const BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.62)";
const MONO = "ui-monospace, monospace";
const SERIF = "'Zodiak', Georgia, serif";
const SANS = "'Switzer', sans-serif";

/* Must match what script/prerender.ts would otherwise leave in the head. Both
   pages set their own, so the prerender has no entry to keep in step. */
const INDEX_TITLE = "Case Studies: Brand, Content & Go-to-Market Work | The Story Shapers";
const INDEX_DESCRIPTION =
  "Case studies from The Story Shapers: Little Black Book, SOCIAL, Centre Court Pickleball League, Headout and Tuisa. The problem, the position, and what changed.";

/**
 * /work/<slug> — ONE CASE STUDY, AT ITS OWN ADDRESS.
 *
 * The homepage opens these in a dialog, which is right for the homepage: it is
 * one scroll score, and a route would cost the reader their place in it. But a
 * dialog has no URL and its text is not in the HTML, so nothing that reads the
 * site rather than scrolling it could see the work. These pages are the same
 * five cases, the same words, somewhere a link can point.
 *
 * Bone, like the reader, and for the reader's reason: several hundred words of
 * argument read better on it than on navy. The section carries data-ground so
 * the fixed nav knows to set itself in ink — see useGround in Navbar.tsx.
 */
export function CasePage() {
  const { slug } = useParams<{ slug: string }>();
  const c = caseBySlug(slug);

  usePageSeo(
    `case-${slug}`,
    c
      ? {
          /* the kind after the name, because "Social Case Study" on its own
             could be about anything */
          title: `${c.client} Case Study: ${c.kind} | The Story Shapers`,
          /* the result first, because a description is the one line of this
             page a search result or an AI answer is certain to show */
          description: `${c.fig} ${c.figLab}. ${c.synopsis}`,
          ogType: "article",
          jsonLd: [
            {
              "@type": "Article",
              "@id": `${SITE_ORIGIN}${c.path}#article`,
              headline: `${c.client}: ${c.fig} ${c.figLab}`,
              description: c.synopsis,
              image: absolute(c.readerImg ?? c.img),
              about: { "@type": "Organization", name: c.client },
              articleSection: "Case studies",
              inLanguage: "en-IN",
              author: { "@id": ORG_ID },
              publisher: { "@id": ORG_ID },
              isPartOf: { "@id": WEBSITE_ID },
              mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_ORIGIN}${c.path}` },
            },
            breadcrumb([
              ["The Story Shapers", "/"],
              ["Work", "/work"],
              [c.client, c.path],
            ]),
          ],
        }
      : null,
  );

  if (!c) return <NotFound />;

  const others = ORDERED_CASES.filter((x) => x.id !== c.id);

  return (
    <div style={{ backgroundColor: BONE, color: NAVY, fontFamily: SANS }} data-testid={`page-case-${c.id}`}>
      <Navbar />
      <main>
        <section data-ground="light" data-bg={BONE}>
          {/* 1100px, the width /services and the list below both use, so the
              page has one left edge from the nav down to the footer's rule */}
          <div className="mx-auto max-w-[1100px] px-6 pb-[clamp(4rem,9vh,6.5rem)] pt-[clamp(6rem,12vh,7.5rem)]">
            <Link
              href="/work"
              className="mb-[1.2rem] inline-flex min-h-11 items-center gap-[0.5rem] no-underline transition-colors duration-200 hover:text-[#7b1e7a]"
              style={{
                fontFamily: MONO,
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#5f5978",
              }}
              data-testid="link-back-to-work"
            >
              <span aria-hidden="true">←</span> The work
            </Link>
            <article>
              <CaseBody c={c} variant="page" />
            </article>
          </div>
        </section>

        <section
          data-ground="dark"
          data-bg={NAVY}
          aria-labelledby="more-work"
          style={{ backgroundColor: NAVY, color: "#FFFFFF" }}
        >
          <div className="mx-auto max-w-[1100px] px-6 py-[clamp(4rem,9vh,6rem)]">
            <h2
              id="more-work"
              className="m-0"
              style={{
                fontFamily: MONO,
                fontSize: "0.68rem",
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              More work
            </h2>
            <CaseList cases={others} className="mt-[1.6rem]" compact />
            {/* the site's one button, centred, where the reader has finished
                both the case and the list of what else there is */}
            <div className="mt-[clamp(3rem,7vh,4.5rem)] flex justify-center">
              <PillLink href={CONTACT.form} testId="link-case-contact">
                Start a conversation
              </PillLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/**
 * /work — THE CASES, AS A LIST.
 *
 * The homepage pans these sideways as cards, which is a way of showing five
 * things and a poor way of finding one. This is the index: the same five in the
 * same order, each a link to its page, with the number and the synopsis the
 * cards already carry.
 */
export function WorkIndexPage() {
  usePageSeo("work", {
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
    jsonLd: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}/work`,
        url: `${SITE_ORIGIN}/work`,
        name: "Case studies from The Story Shapers",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: ORDERED_CASES.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${c.client}: ${c.fig} ${c.figLab}`,
            url: `${SITE_ORIGIN}${c.path}`,
          })),
        },
      },
      breadcrumb([
        ["The Story Shapers", "/"],
        ["Work", "/work"],
      ]),
    ],
  });

  return (
    <div
      style={{ backgroundColor: NAVY, color: "#FFFFFF", minHeight: "100vh", fontFamily: SANS }}
      data-testid="page-work"
    >
      <Navbar />

      <header style={{ padding: "9rem 1.5rem 3.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: "1.5rem",
          }}
        >
          The work
        </div>
        {/* the homepage rail's own heading: this is that section, as a page */}
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            lineHeight: 1.08,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: 0,
            textWrap: "balance",
          }}
        >
          The stories we've shaped.
        </h1>
      </header>

      <main style={{ padding: "0 1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <CaseList cases={ORDERED_CASES} />

        {/* Five cases is a selection. This is the range they were selected
            from — the same footnote the rail carries on the homepage. */}
        <div
          className="grid gap-y-[0.9rem] md:grid-cols-[auto_minmax(0,1fr)] md:items-baseline md:gap-x-[2.4rem]"
          style={{ borderTop: `1px solid ${BORDER}`, padding: "2.2rem 0 0" }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            Also worked with
          </span>
          {/* each name with its own separator and unbreakable, or a line ends
              on "General" and the next begins "Mills", or begins with a dot */}
          <p
            className="m-0 flex flex-wrap gap-x-[0.9rem] gap-y-[0.3rem]"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              lineHeight: 1.6,
              letterSpacing: "-0.015em",
              color: "rgba(255,255,255,0.62)",
            }}
          >
            {BRANDS.map((b, i) => (
              <span key={b} className="whitespace-nowrap">
                {b}
                {i < BRANDS.length - 1 && (
                  <span aria-hidden="true" className="ml-[0.9rem]" style={{ color: "rgba(207,129,205,0.6)" }}>
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        <div className="flex justify-center" style={{ padding: "4.5rem 0 6rem" }}>
          <PillLink href={CONTACT.form} testId="link-work-contact">
            Start a conversation
          </PillLink>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * The cases, listed.
 *
 * On the index each row is the homepage card laid on its side: the same
 * photograph under the same navy veil with the same number standing on it,
 * and beside it the client, the category and the synopsis the card has no
 * room for. Same five pictures, same treatment, so the index reads as the
 * rail unrolled rather than as a different page about the same work.
 *
 * `compact` is the foot of a case page, where the reader has just finished one
 * and needs a name and a number to pick the next, not five more photographs.
 *
 * The client is a heading in both, so the list has an outline, and the link is
 * named for where it goes rather than for every word inside it.
 */
function CaseList({
  cases,
  compact = false,
  className = "",
}: {
  cases: OrderedCase[];
  compact?: boolean;
  className?: string;
}) {
  const Heading = compact ? "h3" : "h2";

  return (
    <ul className={"m-0 list-none p-0 " + className}>
      {cases.map((c) => (
        <li key={c.id} style={{ borderTop: `1px solid ${BORDER}` }}>
          <Link
            href={c.path}
            aria-label={`${c.client} case study`}
            className={
              "group grid grid-cols-1 no-underline " +
              (compact
                ? "gap-y-[0.7rem] py-[1.4rem] md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-baseline md:gap-x-[3.5rem]"
                : "gap-y-[1.4rem] py-[clamp(1.8rem,4vh,2.6rem)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-x-[3.5rem]")
            }
            style={{ color: "#FFFFFF" }}
            data-testid={`link-case-${c.id}`}
          >
            {compact ? (
              <Heading
                className="m-0 transition-colors duration-200 group-hover:text-[#cf81cd] group-focus-visible:text-[#cf81cd]"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontSize: "1.35rem",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                {c.client}
              </Heading>
            ) : (
              <span
                className="relative block aspect-[16/10] w-full overflow-hidden rounded-[3px]"
                style={{ backgroundColor: "#06041A", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-[1.015] object-cover object-center transition-[filter,transform] duration-500 [filter:saturate(0.6)_contrast(1.05)_brightness(0.9)] group-hover:scale-[1.045] group-hover:[filter:none] group-focus-visible:scale-[1.045] group-focus-visible:[filter:none] [@media(hover:none)]:scale-100 [@media(hover:none)]:[filter:saturate(0.88)_contrast(1.02)_brightness(0.95)]"
                />
                {/* the homepage card's veil, value for value */}
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,4,26,0.94) 0%, rgba(6,4,26,0.87) 14%, rgba(8,6,34,0.58) 40%, rgba(12,10,62,0.36) 70%, rgba(12,10,62,0.3) 100%)",
                  }}
                />
                <span className="absolute bottom-[clamp(1rem,1.6vw,1.4rem)] left-[clamp(1.2rem,2vw,1.7rem)] z-[2] grid gap-[0.25rem]">
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: "clamp(1.9rem, 3vw, 2.5rem)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.03em",
                      textShadow: "0 1px 10px rgba(6,4,26,0.8)",
                    }}
                  >
                    {c.fig}
                  </span>
                  <span
                    className="max-w-[14rem]"
                    style={{
                      fontSize: "0.78rem",
                      lineHeight: 1.35,
                      color: "rgba(255,255,255,0.74)",
                      textShadow: "0 1px 8px rgba(6,4,26,0.85)",
                    }}
                  >
                    {c.figLab}
                  </span>
                </span>
              </span>
            )}

            {compact ? (
              <span className="flex flex-wrap items-baseline justify-between gap-x-[2rem] gap-y-[0.3rem]">
                <span style={{ fontSize: "0.98rem", lineHeight: 1.5, color: "rgba(255,255,255,0.78)" }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, color: "#FFFFFF" }}>{c.fig}</span>{" "}
                  {c.figLab}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-colors duration-200 group-hover:text-white group-focus-visible:text-white"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  →
                </span>
              </span>
            ) : (
              <span className="block">
                <Heading
                  className="m-0 transition-colors duration-200 group-hover:text-[#cf81cd] group-focus-visible:text-[#cf81cd]"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    textWrap: "balance",
                  }}
                >
                  {c.client}
                </Heading>
                <span
                  className="mt-[0.6rem] block"
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {c.cat}
                </span>
                <span
                  className="mt-[1.1rem] block max-w-[36rem]"
                  style={{ fontSize: "1.02rem", lineHeight: 1.62, color: "rgba(255,255,255,0.78)", textWrap: "pretty" }}
                >
                  {c.synopsis}
                </span>
                <span
                  className="mt-[1.2rem] block transition-colors duration-200 group-hover:text-white group-focus-visible:text-white"
                  style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.55)" }}
                >
                  Read the case <span aria-hidden="true">→</span>
                </span>
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

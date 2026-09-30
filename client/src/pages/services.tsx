import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  DISCIPLINES,
  type Discipline,
  type ServiceLine,
} from "@/data/services";
import { PillLink } from "@/components/home/Shapes";

const BG = "#0C0A3E";
const BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.62)";
const SERIF = "'Zodiak', Georgia, serif";
const SANS = "'Switzer', sans-serif";
/* Must match the /services entry in script/prerender.ts, or the page swaps
   the prerendered title for a different one the moment React mounts. */
const TITLE = "Brand, Content & AEO Consultancy, India | The Story Shapers";

/**
 * /services — THE CATALOGUE.
 *
 * The homepage names what we specialise in: four disciplines, three things
 * under each. This page is where everything else went, so the homepage could
 * stay short without the long tail disappearing. It is the page a reader lands
 * on when they are looking for one specific deliverable, and the page search
 * engines and AI answers read when somebody asks who writes newsletters or
 * builds content operations.
 *
 * Same four disciplines as the homepage, in the same order, so clicking through
 * opens what you just read rather than re-cutting it. Inside each, the service
 * lines from the services doc: a name, the one sentence it is for, and its
 * scope.
 *
 * The scope lists are long by design and they are still subject to the rules
 * the homepage learned: nothing behind a click, no numerals, no counts, no
 * dashes. They are set small, in columns, as an index, so the eye reads the
 * names and promises first and drops into a list only when it wants to.
 */
export default function ServicesPage() {
  useEffect(() => {
    document.title = TITLE;

    /* One ItemList of Services, built from data/services.ts so it cannot
       drift from what the page says. Same head-injection pattern as
       blog-post.tsx; the prerender snapshots it into the static HTML. */
    /* Reuse the prerendered tag if it is there. The static HTML already
       carries one, and createRoot mounts rather than hydrates, so creating a
       fresh tag every time left two ItemLists on the live page. */
    let ld = document.querySelector<HTMLScriptElement>("script[data-services-jsonld]");
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.setAttribute("data-services-jsonld", "true");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Services from The Story Shapers",
      itemListElement: DISCIPLINES.flatMap((d) => d.lines).map((line, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: line.name,
          description: line.promise,
          serviceType: line.name,
          areaServed: ["India", "Worldwide"],
          provider: {
            "@type": "Organization",
            name: "The Story Shapers",
            url: "https://www.storyshaperscollective.com",
          },
        },
      })),
    });
    return () => document.querySelector("script[data-services-jsonld]")?.remove();
  }, []);

  return (
    <div
      style={{
        backgroundColor: BG,
        color: "#FFFFFF",
        minHeight: "100vh",
        fontFamily: SANS,
      }}
      data-testid="page-services"
    >
      <Navbar />

      <header
        style={{
          padding: "9rem 1.5rem 4.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: "1.5rem",
          }}
        >
          Services
        </div>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            lineHeight: 1.08,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: "0 0 1.6rem",
          }}
        >
          What we do.
        </h1>
        {/* The services doc's own intro with its throat-clearing cut: the
            "more than one way to shape a story" opener and the Sometimes,
            Sometimes, And sometimes triad went; the literal middle stayed. */}
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: MUTED,
            maxWidth: "620px",
            margin: 0,
            textWrap: "pretty",
          }}
          data-testid="text-services-intro"
        >
          We work out what a brand should stand for. We also rewrite websites,
          run social, start newsletters, fix CRM journeys, and build the
          workflows and AI systems that keep it all running.
        </p>

        {/* Where each discipline starts. Plain anchors, visible, in reading
            order — a table of contents, not a set of tabs. */}
        <nav aria-label="Disciplines" style={{ marginTop: "2.6rem" }}>
          <ul className="m-0 flex list-none flex-wrap gap-x-[1.8rem] gap-y-[0.6rem] p-0">
            {DISCIPLINES.map((d) => (
              <li key={d.id}>
                <a
                  href={`#${d.id}`}
                  className="transition-colors duration-200 hover:text-[#cf81cd]"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "1.15rem",
                    color: "rgba(255,255,255,0.88)",
                    textDecoration: "none",
                    borderBottom: `1px solid ${BORDER}`,
                    paddingBottom: "0.1rem",
                  }}
                  data-testid={`link-services-jump-${d.id}`}
                >
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main
        style={{ padding: "0 1.5rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        {DISCIPLINES.map((d) => (
          <DisciplineSection key={d.id} discipline={d} />
        ))}
      </main>

      <Close />
      <Footer />
    </div>
  );
}

/**
 * One discipline: its name and line on the left, held while its service lines
 * scroll past on the right. On a phone the two stack.
 */
function DisciplineSection({ discipline }: { discipline: Discipline }) {
  return (
    <section
      id={discipline.id}
      aria-labelledby={`h-${discipline.id}`}
      className="grid grid-cols-1 gap-y-[1.8rem] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-x-[3.5rem]"
      style={{
        borderTop: `1px solid ${BORDER}`,
        padding: "3.5rem 0 4rem",
        scrollMarginTop: "6rem",
      }}
      data-testid={`services-discipline-${discipline.id}`}
    >
      <div className="lg:sticky lg:top-[7rem] lg:self-start">
        <h2
          id={`h-${discipline.id}`}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: "clamp(2rem, 3.4vw, 2.8rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.022em",
            margin: 0,
          }}
        >
          {discipline.label}
        </h2>
        <p
          style={{
            fontSize: "0.98rem",
            lineHeight: 1.55,
            color: MUTED,
            margin: "0.9rem 0 0",
            maxWidth: "30ch",
            textWrap: "pretty",
          }}
        >
          {discipline.line}
        </p>
      </div>

      <div>
        {discipline.lines.map((line, i) => (
          <Line key={line.id} line={line} first={i === 0} />
        ))}
      </div>
    </section>
  );
}

function Line({ line, first }: { line: ServiceLine; first: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      style={{
        borderTop: first ? "none" : `1px solid ${BORDER}`,
        paddingTop: first ? 0 : "2.2rem",
        paddingBottom: "2.2rem",
      }}
      data-testid={`services-line-${line.id}`}
    >
      <h3
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: "clamp(1.3rem, 1.9vw, 1.55rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.012em",
          margin: 0,
        }}
      >
        {line.name}
      </h3>
      <p
        style={{
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.8)",
          margin: "0.7rem 0 1.5rem",
          maxWidth: "56ch",
          textWrap: "pretty",
        }}
      >
        {line.promise}
      </p>
      {/* An index, not a list of bullets: columns, small, no markers.
          Two columns even on a phone, where one ran Brand to seventeen rows
          and was the one place the page read as a laundry list. The hanging
          indent makes a wrapped item read as one item, not two: with the
          gap between items about equal to the leading, "Homepage, product &
          service / pages" looked like two entries. */}
      <ul
        className="m-0 list-none columns-2 gap-x-[1.25rem] p-0 text-[0.82rem] sm:gap-x-[2rem] sm:text-[0.86rem] xl:columns-3"
        style={{ lineHeight: 1.3, color: MUTED }}
      >
        {line.scope.map((item) => (
          <li
            key={item}
            style={{ breakInside: "avoid", padding: "0.4rem 0 0.4rem 0.8em", textIndent: "-0.8em" }}
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/* Centred, with the site's standard pill: the same close the homepage's
   services act and its final act use, so a button looks like one button
   everywhere. */
function Close() {
  return (
    <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 7rem" }}>
      <div
        className="flex flex-col items-center text-center"
        style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "4.5rem" }}
      >
        <p
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            margin: "0 0 1.8rem",
            maxWidth: "22ch",
            textWrap: "balance",
          }}
        >
          Most briefs cross more than one of these.
        </p>
        <PillLink href="/contact#talk" testId="link-services-page-cta">
          Tell us what you’re working on
        </PillLink>
      </div>
    </section>
  );
}

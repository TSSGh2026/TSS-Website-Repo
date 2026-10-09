import { Fragment, type ReactNode } from "react";
import { Link } from "wouter";
import type { CaseFull, CasePicture } from "@/data/cases";

const NAVY = "#0C0A3E";
const ACCENT_DEEP = "#7b1e7a";
const MONO = "ui-monospace, monospace";
const SERIF = "'Zodiak', Georgia, serif";
/* the grey of every label and caption, 4.5:1 or better on bone */
const QUIET = "#5f5978";
const BODY = "#3a3556";
const RULE = "rgba(12,10,62,0.14)";

/**
 * A CASE STUDY, IN FULL: the page at /work/<slug>.
 *
 * It answers what somebody deciding whether to hire us asks, in the order they
 * ask it: what was the job, what did you find, what did you do, where can I
 * see it, what came of it, and whose numbers are those.
 *
 * THE ORDER IS THE DESIGN. Who and when sit directly under the headline, before
 * any picture, because a reader decides in the first screen whether this is
 * relevant to them, and that depends on who it was for and what we did.
 *
 * Section headings are plain words in the left column and the account runs on
 * the right, the same 4/8 split /services uses. On a phone the heading simply
 * sits above its section.
 */
export function CaseStory({
  client,
  full,
  story,
}: {
  client: string;
  full: CaseFull;
  story?: { href: string; label: string };
}) {
  const picturesAfter = full.pictures?.after ?? -1;
  const team = full.facts.find((f) => (f.people?.length ?? 0) > 1);
  const cells = full.facts.filter((f) => f !== team);

  return (
    <>
      <header>
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: ACCENT_DEEP,
          }}
          data-testid="case-label"
        >
          Case study
        </div>
        <h1
          className="mb-0 mt-[0.9rem]"
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: "clamp(2.4rem, 5.2vw, 4rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            textWrap: "balance",
          }}
          data-testid="text-case-title"
        >
          {client}
        </h1>
        <p
          className="mb-0 mt-[1.6rem] max-w-[46rem]"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(1.25rem, 2.1vw, 1.6rem)",
            lineHeight: 1.32,
            letterSpacing: "-0.015em",
            color: NAVY,
            textWrap: "pretty",
          }}
          data-testid="case-standfirst"
        >
          {full.standfirst}
        </p>

        {/* Two or more people get a row of their own under the other facts.
            Stacked in a quarter-width cell, three names made that row half as
            tall again as every other page's, and on a phone a name that
            wrapped ran into the one beneath it. */}
        <dl className="mb-0 mt-[2.4rem]" style={{ borderTop: `1px solid ${RULE}` }} data-testid="case-facts">
          <div className={"grid grid-cols-2 gap-x-[1.5rem] lg:gap-x-[2rem] " + GRID_COLS[Math.min(cells.length, 4)]}>
            {cells.map((f, n) => (
              <div
                key={f.k}
                /* an odd count leaves the last fact alone on a two-column
                   phone, with half a rule under it: it takes the row */
                className={"py-[0.9rem] " + (cells.length % 2 === 1 && n === cells.length - 1 ? "col-span-2 lg:col-span-1" : "")}
                style={{ borderBottom: `1px solid ${RULE}` }}
              >
                <dt style={{ ...LABEL, color: QUIET }}>{f.k}</dt>
                <dd className="m-0 mt-[0.3rem]" style={{ fontSize: "1rem", lineHeight: 1.4, color: NAVY }}>
                  {f.people ? (
                    <FactLink href={f.people[0].href}>{f.people[0].name}</FactLink>
                  ) : f.href ? (
                    <FactLink href={f.href}>{f.v}</FactLink>
                  ) : (
                    f.v
                  )}
                </dd>
              </div>
            ))}
          </div>
          {team && (
            <div className="py-[0.9rem]" style={{ borderBottom: `1px solid ${RULE}` }}>
              <dt style={{ ...LABEL, color: QUIET }}>{team.k}</dt>
              <dd
                className="m-0 mt-[0.3rem] flex flex-wrap gap-x-[1.6rem] gap-y-[0.2rem]"
                style={{ fontSize: "1rem", lineHeight: 1.4, color: NAVY }}
              >
                {team.people!.map((person) => (
                  <FactLink key={person.href} href={person.href}>
                    {person.name}
                  </FactLink>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {full.hero && (
        <Picture
          {...full.hero}
          className={"mt-[2rem] " + (full.hero.shot ? "aspect-[16/10]" : "aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9]")}
          eager
        />
      )}

      {picturesAfter === -1 && <PictureRow full={full} lead />}

      {full.sections.map((sec, i) => (
        <Fragment key={sec.title}>
          <Section title={sec.title} kicker={sec.kicker}>
            {sec.paras?.map((p) => <P key={p}>{p}</P>)}
            {sec.items && (
              <ol className={"m-0 list-none p-0 " + (sec.paras ? "mt-[1.6rem]" : "")}>
                {sec.items.map(([head, body], n) => (
                  <li
                    key={head}
                    className={n === 0 ? "pb-[1.3rem]" : "py-[1.3rem]"}
                    style={n === 0 ? undefined : { borderTop: `1px solid ${RULE}` }}
                  >
                    <h3 className="mb-[0.45rem] mt-0" style={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {head}
                    </h3>
                    <p className="m-0 max-w-[40rem]" style={{ fontSize: "1.05rem", lineHeight: 1.65, color: BODY }}>
                      {body}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          {i === picturesAfter && <PictureRow full={full} />}
        </Fragment>
      ))}

      {full.ran && (
        <Section title={full.ran.title}>
          <ul className="m-0 list-none p-0">
            {full.ran.items.map((r, i) => (
              <li key={r.href} style={i === 0 ? undefined : { borderTop: `1px solid ${RULE}` }}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "group grid min-h-11 gap-[0.3rem] no-underline sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-x-[1.5rem] " +
                    (i === 0 ? "pb-[1.05rem]" : "py-[1.05rem]")
                  }
                  style={{ color: NAVY }}
                >
                  <span style={{ ...LABEL, color: QUIET }}>{r.outlet}</span>
                  <span
                    className="transition-colors duration-200 group-hover:text-[#7b1e7a]"
                    style={{ fontFamily: SERIF, fontSize: "1.12rem", lineHeight: 1.35 }}
                  >
                    {r.title}
                  </span>
                  <span aria-hidden="true" className="hidden sm:block" style={{ color: QUIET }}>
                    ↗
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(full.results || full.attribution || full.quote || story) && (
        <Section title={full.results?.title ?? "In their words"}>
          {full.results?.groups.map((g, gi) => (
            <div
              key={g.who ?? gi}
              className={gi === 0 ? "" : "mt-[2rem] pt-[1.6rem]"}
              style={gi === 0 ? undefined : { borderTop: `1px solid ${RULE}` }}
            >
              {g.who && (
                <h3 className="mb-[1.1rem] mt-0" style={{ ...LABEL, fontWeight: 400, color: ACCENT_DEEP }}>
                  {g.who}
                </h3>
              )}
              <div className="grid grid-cols-1 gap-x-[2rem] gap-y-[1.8rem] sm:grid-cols-2">
                {g.items.map((r) => (
                  <div key={r.lab}>
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: "clamp(2rem, 3.6vw, 2.7rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.025em",
                        color: NAVY,
                      }}
                    >
                      {r.fig}
                    </div>
                    <div className="mt-[0.55rem] max-w-[19rem]" style={{ fontSize: "0.92rem", lineHeight: 1.45, color: QUIET }}>
                      {r.lab}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {full.attribution && (
            <p
              className={"mb-0 max-w-[40rem] text-[1.05rem] " + (full.results ? "mt-[2rem]" : "mt-0")}
              style={{ lineHeight: 1.65, color: BODY }}
              data-testid="case-attribution"
            >
              {full.attribution}
            </p>
          )}

          {full.quote && (
            /* Set as type under a rule, not in a tinted box with a coloured
               edge. That box is the stock call-out, and it made a real person's
               words look like a template's. */
            <figure className="mx-0 mb-0 mt-[2.4rem] pt-[1.8rem]" style={{ borderTop: `1px solid ${RULE}` }}>
              <blockquote className="m-0">
                <p
                  className="m-0 max-w-[36rem]"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.015em",
                    color: NAVY,
                    textWrap: "pretty",
                  }}
                >
                  “{full.quote.text}”
                </p>
              </blockquote>
              <figcaption className="mt-[1.1rem]" style={{ fontSize: "0.92rem", lineHeight: 1.5, color: QUIET }}>
                <span style={{ color: NAVY, fontWeight: 600 }}>{full.quote.who}</span>, {full.quote.role}
                <span className="block">{full.quote.context}</span>
              </figcaption>
            </figure>
          )}

          {story && (
            <Link
              href={story.href}
              className="mt-[2rem] inline-flex min-h-11 items-center transition-colors duration-200 hover:text-[#7b1e7a]"
              style={{ color: NAVY, textDecoration: "none", fontSize: "1.05rem", fontWeight: 500 }}
              data-testid="link-case-story"
            >
              <span style={{ paddingBottom: "0.2rem", borderBottom: "1px solid rgba(12,10,62,0.3)" }}>
                {story.label} <span aria-hidden="true">&nbsp;→</span>
              </span>
            </Link>
          )}
        </Section>
      )}
    </>
  );
}

/** 44px to tap. The padding that makes it so is cancelled by an equal negative
 *  margin, so a name sits on the same line as the plain values beside it and a
 *  name that wraps to two lines still clears whatever is above and below. */
function FactLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="-my-[0.7rem] inline-block py-[0.7rem] transition-colors duration-200 hover:text-[#7b1e7a]"
      style={{
        color: NAVY,
        textDecoration: "underline",
        textDecorationColor: "rgba(12,10,62,0.3)",
        textUnderlineOffset: "0.2em",
      }}
    >
      {children}
    </Link>
  );
}

/** Full width, breaking the column: the pictures are the evidence for the
 *  section they follow, or, as `lead`, what the page opens on. Squares run two
 *  across at every size: four across made each post too small to read. */
function PictureRow({ full, lead }: { full: CaseFull; lead?: boolean }) {
  const pics = full.pictures;
  if (!pics) return null;
  return (
    <div
      className={
        (lead ? "mt-[2rem] " : "mt-[clamp(3rem,7vh,4.5rem)] ") +
        "grid gap-x-[1.4rem] gap-y-[1.8rem] " +
        (pics.shape === "square" ? "grid-cols-2" : pics.items.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")
      }
    >
      {pics.items.map((pic) => (
        <Picture key={pic.img} {...pic} className={SHAPES[pics.shape ?? "photo"]} />
      ))}
    </div>
  );
}

const SHAPES = {
  photo: "aspect-[5/4]",
  wide: "aspect-[16/10]",
  slide: "aspect-video",
  square: "aspect-square",
} as const;

/* written out, because Tailwind cannot see a class name assembled at run time */
const GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const LABEL = {
  fontFamily: MONO,
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
} as const;

/** One part of the account: its name on the left, the account on the right. */
function Section({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section
      className="mt-[clamp(3rem,7vh,4.5rem)] grid grid-cols-1 gap-y-[1.2rem] pt-[1.6rem] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-x-[3.5rem]"
      style={{ borderTop: `1px solid ${RULE}` }}
    >
      {/* held while its section scrolls past, as /services holds its left
          column, so the heading is not left alone beside a long account */}
      <div className="lg:sticky lg:top-[6.5rem] lg:self-start">
        {/* whose work a section is. Part of the heading, so the outline reads
            "Led by Fatema Hanif: Creator partnerships". */}
        <h2
          className="m-0"
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: NAVY,
          }}
        >
          {kicker && (
            <span className="mb-[0.7rem] block" style={{ ...LABEL, lineHeight: 1.4, color: ACCENT_DEEP }}>
              {kicker}
              <span className="sr-only">: </span>
            </span>
          )}
          {title}
        </h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function P({ children }: { children: string }) {
  return (
    <p
      className="m-0 max-w-[40rem] [&+p]:mt-[1.1rem]"
      style={{ fontSize: "1.05rem", lineHeight: 1.65, color: BODY }}
    >
      {children}
    </p>
  );
}

function Picture({ img, alt, caption, shot, anchor, className, eager }: CasePicture & { className: string; eager?: boolean }) {
  return (
    <figure className="m-0">
      <div
        className={"overflow-hidden rounded-[3px] " + className}
        /* a screenshot of a pale page needs an edge, or it bleeds into the bone */
        style={{ backgroundColor: shot ? "transparent" : "#06041A", border: shot ? `1px solid ${RULE}` : undefined }}
      >
        <img
          src={img}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={"block h-full w-full object-cover " + (shot ? "object-top" : anchor === "right" ? "object-right" : "")}
        />
      </div>
      {caption && (
        <figcaption className="mt-[0.7rem] max-w-[30rem]" style={{ fontSize: "0.92rem", lineHeight: 1.45, color: QUIET }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

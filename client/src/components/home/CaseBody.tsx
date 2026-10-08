import { createElement } from "react";
import { Link } from "wouter";
import { RichText } from "./RichText";
import { CONTACT } from "@/lib/contact";
import type { Case } from "@/data/cases";

const NAVY = "#0C0A3E";
const ACCENT = "#cf81cd";
const ACCENT_DEEP = "#7b1e7a";
const MONO = "ui-monospace, monospace";
const SERIF = "'Zodiak', Georgia, serif";
/* the grey of every label and caption. #6e6885 measured 4.42:1 inside the
   tinted "refused" box, under the 4.5 a 10px label needs */
const QUIET = "#5f5978";

/**
 * A CASE STUDY, READ. One body, two places it is read.
 *
 * `dialog` is the reader that opens over the homepage's rail: the picture
 * bleeds to the panel's edges and the title is an h2, because the page behind
 * it already has its h1.
 *
 * `page` is the same case at its own address, /work/<slug>. A dialog has no
 * URL, and its words are not in the HTML until somebody clicks, so the five
 * strongest pieces of evidence on the site were the five things a search engine
 * or an AI answer engine could not read. The page is the same argument with
 * three differences, each because it now has to stand alone:
 *
 *   - the client is the h1, and each block's label is a real heading, so the
 *     argument has an outline something other than an eye can follow;
 *   - the card's number and the synopsis open it. In the dialog the reader has
 *     just clicked a card that showed them both; arriving cold from a search
 *     result they have seen neither, and the result is the reason to read on;
 *   - it is laid out for a page, not a 46rem panel: who and what came of it
 *     held on the left, the argument on the right, as /services does it.
 *
 * The copy is the same strings from data/cases.ts in both. Nothing is written
 * for the page that the dialog or the card does not also say.
 */
export function CaseBody({
  c,
  variant,
}: {
  c: Case & { n?: string };
  variant: "dialog" | "page";
}) {
  const page = variant === "page";
  /* The card's picture — except for Tuisa, which opens onto the archive
     painting instead of repeating the necklace the card already showed.
     Opening a case should move the argument on. */
  const shot = c.readerImg ?? c.img;
  const shotAlt = c.readerImgAlt ?? c.imgAlt;

  const figure = (
    /* in the dialog, the negative margins mirror the panel's padding exactly,
       or the image sits in a frame it was never meant to have */
    <figure
      className={
        page
          ? "m-0 mt-[2.2rem] aspect-[16/9] overflow-hidden rounded-[3px]"
          : "-mx-[clamp(1.5rem,4vw,4rem)] -mt-[clamp(2.5rem,5vw,4.5rem)] mb-0 aspect-[16/9] overflow-hidden"
      }
      style={{ backgroundColor: "#06041A" }}
    >
      <img src={shot} alt={shotAlt} className="block h-full w-full object-cover" />
    </figure>
  );

  const label = (
    <div
      style={{
        fontFamily: MONO,
        fontSize: "0.68rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: ACCENT_DEEP,
      }}
    >
      {/* the number is the card's position in the rail, which means nothing on
          a page reached from anywhere else */}
      {page ? "Case study" : `Case study ${c.n ?? ""}`}
    </div>
  );

  const title = createElement(
    page ? "h1" : "h2",
    {
      id: page ? undefined : "readerTitle",
      className: "mt-[0.9rem] mb-0",
      style: {
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: page ? "clamp(2.4rem, 4.4vw, 3.4rem)" : "clamp(2.4rem, 5vw, 3.6rem)",
        lineHeight: 1.02,
        letterSpacing: "-0.03em",
        textWrap: "balance",
      },
      "data-testid": "text-case-title",
    },
    c.client,
  );

  const category = (
    <div
      className="mt-[0.7rem]"
      style={{
        fontFamily: MONO,
        fontSize: "0.68rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: QUIET,
      }}
    >
      {c.cat}
    </div>
  );

  const argument = (
    <>
      <Block k="The mandate" page={page}>{c.mandate}</Block>

      <div className="grid gap-0 md:grid-cols-2 md:gap-[2.4rem]">
        <Block k="The tension" page={page}>{c.tension}</Block>
        <Block k="The position" page={page}>{c.position}</Block>
      </div>

      {/* the label is per case: LBB's block holds the question the work had
          to answer, not something it turned down, and a heading that lies
          about its own contents is worse than no heading */}
      <div
        className="mt-[2.4rem] px-[1.6rem] py-[1.5rem]"
        style={{
          borderLeft: `2px solid ${ACCENT}`,
          backgroundColor: "rgba(207,129,205,0.07)",
        }}
      >
        <K page={page}>{c.refusedLabel ?? "What the position refused"}</K>
        <p
          className="m-0 italic"
          style={{ fontFamily: SERIF, fontSize: "1.1rem", lineHeight: 1.45, color: "#3a3556" }}
        >
          <RichText>{c.refused}</RichText>
        </p>
      </div>

      <div className="mt-[2.4rem]">
        <K page={page}>{c.componentsLabel}</K>
        <ol className="m-0 list-none p-0">
          {c.components.map(([head, body], i) => (
            <li
              key={head}
              className={
                i === 0
                  ? "border-t-0 pb-[1.3rem] pt-[0.2rem]"
                  : "py-[1.3rem] border-t border-[rgba(12,10,62,0.12)]"
              }
            >
              {createElement(
                page ? "h3" : "h4",
                {
                  className: "mb-[0.5rem] mt-0",
                  style: { fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em" },
                },
                <RichText>{head}</RichText>,
              )}
              <p className="m-0" style={{ fontSize: "0.98rem", lineHeight: 1.6, color: "#514c6f" }}>
                <RichText>{body}</RichText>
              </p>
            </li>
          ))}
        </ol>
      </div>

      {c.constraint && (
        <p
          className="mt-[1.8rem] pt-[1.2rem] italic"
          style={{
            borderTop: "1px solid rgba(12,10,62,0.12)",
            fontFamily: SERIF,
            fontSize: "1.02rem",
            lineHeight: 1.5,
            color: QUIET,
          }}
        >
          <RichText>{c.constraint}</RichText>
        </p>
      )}

      {/* "The impact" was a heading over scale and virtues in three of five
          cases. Each case names its own closing block, and one of them is a
          list rather than a figure grid because what Tuisa owns is not a
          number — and a word set in the 2.1rem numeral face also overflowed
          its column and painted over the next cell. */}
      <div className="mt-[2.4rem]">
        <K page={page}>{c.impactLabel ?? "The impact"}</K>
        {c.impactKind === "list" ? (
          <ul className="m-0 list-none p-0">
            {c.impact.map(([a, b], i) => (
              <li
                key={a}
                className={
                  "grid gap-[0.2rem] md:grid-cols-[11rem_1fr] md:items-baseline md:gap-x-[1.5rem] " +
                  (i === 0
                    ? "border-t-0 pb-[0.95rem] pt-[0.1rem]"
                    : "py-[0.95rem] border-t border-[rgba(12,10,62,0.12)]")
                }
              >
                <b style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em", color: NAVY }}>
                  {a}
                </b>
                <span style={{ fontSize: "0.94rem", lineHeight: 1.5, color: QUIET }}>{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          /* auto-fit rather than a fixed 3: with four figures a hard
             three-column grid left one orphan alone on the second row. On the
             page the column is wider, and six figures at auto-fit came out as
             four and two — so a count that divides by three is set in threes. */
          <div
            className={
              "grid gap-x-[1.4rem] gap-y-[1.6rem] " +
              (page && c.impact.length % 3 === 0
                ? "grid-cols-2 sm:grid-cols-3"
                : "grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))]")
            }
          >
            {c.impact.map(([fig, lab]) => (
              <div key={lab}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: NAVY,
                    /* a long word in a numeral slot used to overflow its
                       column and paint over the cell beside it */
                    overflowWrap: "anywhere",
                  }}
                >
                  {fig}
                </div>
                <div
                  className="mt-[0.45rem]"
                  style={{ fontSize: "0.84rem", lineHeight: 1.4, color: QUIET }}
                >
                  {lab}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p
        className="mt-[2.6rem] pt-[1.6rem]"
        style={{
          borderTop: "1px solid rgba(12,10,62,0.14)",
          fontFamily: SERIF,
          fontSize: "clamp(1.15rem, 2vw, 1.4rem)",
          lineHeight: 1.36,
          color: NAVY,
          textWrap: "balance",
        }}
      >
        <RichText>{c.close}</RichText>
      </p>
    </>
  );

  if (page) {
    return (
      /* The services page's own grid: what the thing is, held on the left
         while its detail scrolls past on the right. A reader three screens
         into the argument can still see whose case it is and what came of it. */
      <div className="grid grid-cols-1 gap-y-[2.2rem] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-x-[3.5rem]">
        <header className="lg:sticky lg:top-[7rem] lg:self-start">
          {label}
          {title}
          {category}
          <p className="mb-0 mt-[2rem]" data-testid="case-result">
            <span
              className="block"
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: "clamp(2.6rem, 4.6vw, 3.6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: NAVY,
              }}
            >
              {c.fig}
            </span>
            <span
              className="mt-[0.6rem] block max-w-[16rem]"
              style={{ fontSize: "0.94rem", lineHeight: 1.45, color: QUIET }}
            >
              {c.figLab}
            </span>
          </p>
        </header>

        <div className="min-w-0">
          {/* The synopsis opens the page and the card's one-line tension does
              not follow it: with The tension two blocks below, that was the
              same problem stated three times before the argument began. */}
          <p
            className="m-0 max-w-[40rem]"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(1.3rem, 2.1vw, 1.6rem)",
              lineHeight: 1.32,
              letterSpacing: "-0.015em",
              color: NAVY,
              textWrap: "pretty",
            }}
          >
            <RichText>{c.synopsis}</RichText>
          </p>
          {figure}
          {argument}
          {/* a longer piece about the same work, where one exists */}
          {c.story && (
            <Link
              href={c.story.href}
              className="mt-[1.4rem] inline-flex min-h-11 items-center transition-colors duration-200 hover:text-[#7b1e7a]"
              style={{
                color: NAVY,
                textDecoration: "none",
                fontFamily: "'Switzer', sans-serif",
                fontSize: "0.98rem",
                fontWeight: 500,
              }}
              data-testid="link-case-story"
            >
              <span style={{ paddingBottom: "0.2rem", borderBottom: "1px solid rgba(12,10,62,0.3)" }}>
                {c.story.label} <span aria-hidden="true">&nbsp;→</span>
              </span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {figure}
      <header
        className="pt-[clamp(2rem,4vw,3rem)] pb-[2.2rem] pr-[3.6rem]"
        style={{ borderBottom: "1px solid rgba(12,10,62,0.14)" }}
      >
        {label}
        {title}
        {category}
        {/* the tension again, as the standfirst: it confirms to somebody who
            has just clicked that they opened the case they meant to. The
            synopsis that used to sit under it went — three statements of the
            same problem before the first block is two too many. */}
        <p
          className="mt-[1.6rem] mb-0 max-w-[30rem] italic"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)",
            lineHeight: 1.34,
            color: "#3a3556",
          }}
        >
          <RichText>{c.q}</RichText>
        </p>
      </header>

      {argument}

      {/* Goes to the form, not back to the page.
          This used to close the reader and scroll to #act-close — the third
          button on the site saying "Start a conversation" that actually took
          you to a different button saying "Start a conversation". It fired at
          the worst possible moment to add a step: someone has just read a
          whole case study to the end, which is the most interested they will
          ever be. Closing the reader is still available three other ways —
          the close button, Escape, and the backdrop. */}
      <Link
        href={CONTACT.form}
        className="mt-[2rem] inline-flex transition-colors duration-200"
        style={{
          color: NAVY,
          textDecoration: "none",
          paddingBottom: "0.2rem",
          borderBottom: "1px solid rgba(12,10,62,0.3)",
          fontFamily: "'Switzer', sans-serif",
          fontSize: "0.98rem",
          fontWeight: 500,
        }}
      >
        Start a conversation <span aria-hidden="true">&nbsp;→</span>
      </Link>
    </>
  );
}

/** A block's label. On the page it is a heading; in the dialog, a caption. */
function K({ children, page }: { children: string; page: boolean }) {
  return createElement(
    page ? "h2" : "div",
    {
      className: "mb-[0.8rem] mt-0",
      style: {
        fontFamily: MONO,
        fontSize: "0.66rem",
        fontWeight: 400,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: QUIET,
      },
    },
    children,
  );
}

function Block({ k, children, page }: { k: string; children: string; page: boolean }) {
  return (
    <div className="mt-[2.4rem]">
      <K page={page}>{k}</K>
      <p className="m-0" style={{ fontSize: "1.02rem", lineHeight: 1.62, color: "#3a3556" }}>
        <RichText>{children}</RichText>
      </p>
    </div>
  );
}

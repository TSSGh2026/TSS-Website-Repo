import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { RichText } from "./RichText";
import { CONTACT } from "@/lib/contact";
import type { Case } from "@/data/cases";

const BONE = "#F4F1EA";
const NAVY = "#0C0A3E";
const ACCENT = "#cf81cd";
const ACCENT_DEEP = "#7b1e7a";
const MONO = "ui-monospace, monospace";
const SERIF = "'Zodiak', Georgia, serif";

/**
 * THE CASE READER — a dialog, not a route.
 *
 * This page is one scroll score and a route would cost the reader their place
 * in it. It opens onto the bone ground: the page already uses that hard cut for
 * its human material, and several hundred words of argument read better on it
 * than on navy.
 *
 * THE THREE THINGS THAT ARE EASY TO GET WRONG HERE
 *
 * 1. Locking the page. `position: fixed` on the body collapsed scrollHeight
 *    from 12150 to 900 and scrollY to 0, so every act behind the scrim
 *    re-rendered at progress 0 and the film visible through it cut to a
 *    different scene the moment a case opened. `overflow: hidden` holds the
 *    position instead, with the scrollbar gutter reserved so the page does not
 *    jump sideways as the bar goes.
 *
 * 2. Handing focus back. `focus()` scroll-anchors the card into view and
 *    overrides the scroll restore — measured 1035px of drift on desktop and a
 *    full viewport on a phone, which lands the reader in a different act from
 *    the one they opened the case from. `preventScroll` is not optional.
 *
 * 3. Keeping focus in. Without the Tab trap, tabbing walks straight out of the
 *    dialog and into a page the reader cannot see.
 */
export function CaseReader({
  caseStudy,
  onClose,
  landOn,
}: {
  caseStudy: Case & { n: string };
  onClose: (opts?: { to?: string }) => void;
  /** An element id to land on when this closes, instead of the position the
   *  page was at when it opened. Set for a case opened cold from a shared
   *  link — see the note on goToRef. */
  landOn?: string;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Captured on mount and restored on unmount rather than read at close time:
     by the time the close handler runs the browser may already have moved it. */
  const scrollYRef = useRef(0);

  /* Where to land INSTEAD of the captured position.
     Two things set it. The link at the foot of the case, which wants to go to
     the close act rather than back to the rail — routed through the cleanup
     rather than done in the click handler because the cleanup's scrollTo runs
     last and wins, so the link's old href="#act-close" put the reader on the
     close for one frame before the restore dragged them back.
     And `landOn`, for a case opened cold from a shared link: there the captured
     position is measured before the page's images have loaded, so restoring it
     put a phone 1255px below where the work act had settled. An id resolved at
     close time is measured against the layout that actually exists by then. */
  const goToRef = useRef<string | null>(landOn ?? null);

  useEffect(() => {
    scrollYRef.current = window.scrollY;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevGutter = html.style.scrollbarGutter;
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "stable";

    panelRef.current?.focus();

    return () => {
      html.style.overflow = prevOverflow;
      html.style.scrollbarGutter = prevGutter;
      const target = goToRef.current
        ? document.getElementById(goToRef.current)
        : null;
      if (target) target.scrollIntoView({ block: "start" });
      else window.scrollTo(0, scrollYRef.current);
    };
  }, []);

  /* `closeTo` lived here — closing towards an act rather than back to the card,
     for the foot-of-the-case link that used to land on #act-close. That link
     goes to the contact form now, so nothing closes towards an act any more.
     `goToRef` is still read by the cleanup above, for `landOn`. */

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const f = root.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const c = caseStudy;
  /* The card's picture, bled to the panel edges — except for Tuisa, which opens
     onto the archive painting instead of repeating the necklace the card already
     showed. Opening a case should move the argument on. */
  const shot = c.readerImg ?? c.img;
  const shotAlt = c.readerImgAlt ?? c.imgAlt;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="readerTitle"
      className="fixed inset-0 z-[200]"
      data-testid="case-reader"
    >
      <div
        className="absolute inset-0 backdrop-blur-[3px] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        style={{ backgroundColor: "rgba(6,4,26,0.72)" }}
        onClick={() => onClose()}
      />

      <article
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 w-full max-w-full overflow-y-auto overscroll-contain px-[clamp(1.5rem,4vw,4rem)] pt-[clamp(2.5rem,5vw,4.5rem)] pb-[clamp(4rem,8vh,6rem)] focus:outline-none motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:duration-300 sm:w-[46rem]"
        style={{ backgroundColor: BONE, color: NAVY }}
      >
        {/* Fixed to the viewport, not floated in the text. A sticky float only
            shortens the first few line boxes, so every paragraph after them
            scrolled underneath the button — it sat on top of body copy at four
            of four sampled positions. 46px, over the 44px touch minimum. */}
        <button
          type="button"
          onClick={() => onClose()}
          aria-label="Close"
          className="fixed right-[clamp(1rem,2.4vw,1.8rem)] top-[clamp(1rem,2.4vw,1.8rem)] z-[3] grid h-[2.875rem] w-[2.875rem] place-items-center rounded-full text-[1.4rem] leading-none transition-colors duration-200 hover:bg-[rgba(12,10,62,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: BONE,
            color: NAVY,
            border: "1px solid rgba(12,10,62,0.2)",
            boxShadow: "0 2px 14px rgba(6,4,26,0.3)",
            outlineColor: ACCENT_DEEP,
          }}
          data-testid="button-close-case"
        >
          <span aria-hidden="true">×</span>
        </button>

        {/* the negative margins mirror the panel's padding exactly, or the
            image sits in a frame it was never meant to have */}
        <figure
          className="-mx-[clamp(1.5rem,4vw,4rem)] -mt-[clamp(2.5rem,5vw,4.5rem)] mb-0 aspect-[16/9] overflow-hidden"
          style={{ backgroundColor: "#06041A" }}
        >
          <img src={shot} alt={shotAlt} className="block h-full w-full object-cover" />
        </figure>

        <header
          className="pt-[clamp(2rem,4vw,3rem)] pb-[2.2rem] pr-[3.6rem]"
          style={{ borderBottom: "1px solid rgba(12,10,62,0.14)" }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: ACCENT_DEEP,
            }}
          >
            Case study {c.n}
          </div>
          <h2
            id="readerTitle"
            className="mt-[0.9rem] mb-0"
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
            data-testid="text-case-title"
          >
            {c.client}
          </h2>
          <div
            className="mt-[0.7rem]"
            style={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6e6885",
            }}
          >
            {c.cat}
          </div>
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

        <Block k="The mandate">{c.mandate}</Block>

        <div className="grid gap-0 md:grid-cols-2 md:gap-[2.4rem]">
          <Block k="The tension">{c.tension}</Block>
          <Block k="The position">{c.position}</Block>
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
          <K>{c.refusedLabel ?? "What the position refused"}</K>
          <p
            className="m-0 italic"
            style={{ fontFamily: SERIF, fontSize: "1.1rem", lineHeight: 1.45, color: "#3a3556" }}
          >
            <RichText>{c.refused}</RichText>
          </p>
        </div>

        <div className="mt-[2.4rem]">
          <K>{c.componentsLabel}</K>
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
                <h4
                  className="mb-[0.5rem] mt-0"
                  style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  <RichText>{head}</RichText>
                </h4>
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
              color: "#6e6885",
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
          <K>{c.impactLabel ?? "The impact"}</K>
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
                  <span style={{ fontSize: "0.94rem", lineHeight: 1.5, color: "#6e6885" }}>{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            /* auto-fit rather than a fixed 3: with four figures a hard
               three-column grid left one orphan alone on the second row */
            <div className="grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-x-[1.4rem] gap-y-[1.6rem]">
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
                    style={{ fontSize: "0.84rem", lineHeight: 1.4, color: "#6e6885" }}
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
      </article>
    </div>,
    document.body,
  );
}

function K({ children }: { children: string }) {
  return (
    <div
      className="mb-[0.8rem]"
      style={{
        fontFamily: MONO,
        fontSize: "0.66rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#6e6885",
      }}
    >
      {children}
    </div>
  );
}

function Block({ k, children }: { k: string; children: string }) {
  return (
    <div className="mt-[2.4rem]">
      <K>{k}</K>
      <p className="m-0" style={{ fontSize: "1.02rem", lineHeight: 1.62, color: "#3a3556" }}>
        <RichText>{children}</RichText>
      </p>
    </div>
  );
}

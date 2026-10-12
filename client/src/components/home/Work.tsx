import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Act, ActLabel } from "./Act";
import { EyeDoodle } from "./Doodles";
import { useNarrow } from "@/hooks/use-act-progress";
import { ORDERED_CASES, BRANDS, type OrderedCase } from "@/data/cases";
import { HOME_Y } from "@/lib/home-place";

const NAVY = "#0C0A3E";
const MONO = "ui-monospace, monospace";
const SERIF = "'Zodiak', Georgia, serif";

/** the engine's `data-sc-pan="0.04"`: 4% more travel than the rail's overhang,
 *  so the last card clears the right edge rather than resting against it */
const PAN_EXTRA = 1.04;

/**
 * The case an old `#case-lbb` link was pointing at, or undefined.
 *
 * Cases used to open in a dialog over this rail, and that hash was the address
 * people copied. The dialog is gone; the links are not.
 */
function caseFromHash(hash: string): OrderedCase | undefined {
  const id = hash.startsWith("#case-") ? hash.slice(6) : null;
  return id ? ORDERED_CASES.find((c) => c.id === id) : undefined;
}

/**
 * ACT 5 — THE WORK. Five cases, panned sideways.
 *
 * A card is ONE LINK to the case's page: the whole thing, so the hit area is the
 * card and not a link buried at the bottom of it. Three things on it, and no
 * synopsis — a picture, one number, and the tension. A card that asks you to
 * read a summary before you decide to read the case is asking twice.
 *
 * The standfirst that used to sit under the heading is gone, Fatema's call on
 * 25 Aug. It explained what the cards were about to do, and the cards do it.
 *
 * ON A PHONE THE RAIL STOPS BEING A RAIL.
 *
 * The card pitch is 328px against a 375px screen and the pan is linear with no
 * snapping, so where a card comes to rest is purely a function of where a thumb
 * stops — measured mid-word truncation at every sampled position ("no consistent
 * answe", "brand togethe", "Unde"). These numbers are the credibility payload of
 * the page and they cannot need a lucky thumb. Below 40rem it becomes an
 * ordinary vertical stack, and so does reduced motion, where a 2865px row inside
 * a 1440px stage left cards three to five reachable only through a horizontal
 * scrollbar nobody had been told about.
 */
export function Work() {
  const narrow = useNarrow(40);
  const reduced = useReducedMotion();
  const stacked = narrow || !!reduced;
  const [, navigate] = useLocation();

  /* An old shared link, /#case-lbb. Replaced rather than pushed, so Back does
     not return to an address whose only job is to forward again. */
  useEffect(() => {
    const c = caseFromHash(window.location.hash);
    if (c) navigate(c.path, { replace: true });
  }, [navigate]);

  return (
    <Act
      id="act-proof"
      kind={stacked ? "flow" : "pin"}
      span={2.6}
      ground="dark"
      bg={NAVY}
      stagePad={stacked ? "px-6 py-16 sm:px-10" : "py-20"}
      stageClassName="relative overflow-hidden"
    >
      {(progress) => <Rail progress={progress} stacked={stacked} />}
    </Act>
  );
}

function Rail({
  progress,
  stacked,
}: {
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(0);

  /* Measured rather than assumed, and re-measured on resize: the rail's width
     is five cards of clamp() plus the header, so it is a different number at
     every viewport and there is no way to compute it up front. */
  useLayoutEffect(() => {
    if (stacked) {
      setOver(0);
      return;
    }
    const measure = () => {
      const rail = railRef.current;
      const frame = frameRef.current;
      if (!rail || !frame) return;
      setOver(Math.max(0, rail.scrollWidth - frame.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, [stacked]);

  const x = useTransform(progress, [0, 1], [0, -(over * PAN_EXTRA)]);

  /* KEYBOARD FOCUS ON A PANNED RAIL.
     Tab moves focus to a card that is two screens of lateral pan away, and the
     browser cannot scroll sideways to reach it because the rail is a transform.
     So the page scrolls VERTICALLY by the amount that pans it into the frame. */
  const onFocusCapture = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (stacked || over <= 0) return;
      const card = (e.target as HTMLElement).closest("[data-case]");
      if (!card) return;
      const act = document.getElementById("act-proof");
      if (!act) return;
      const runway = act.offsetHeight - window.innerHeight;
      if (runway <= 0) return;
      const r = card.getBoundingClientRect();
      const pad = 32;
      let need = 0;
      if (r.left < pad) need = r.left - pad;
      else if (r.right > window.innerWidth - pad) need = r.right - window.innerWidth + pad;
      if (!need) return;
      window.scrollTo(0, window.scrollY + (need / over) * runway);
    },
    [stacked, over],
  );

  return (
    <>
      <div ref={frameRef} className="w-full">
        <motion.div
          ref={railRef}
          onFocusCapture={onFocusCapture}
          className={
            /* Stacked, it WRAPS rather than running one card per row. Both
               reasons for stacking arrive at the same markup, but not at the
               same screen: a phone genuinely wants one column, and a 1440px
               desktop with motion off was getting five 1360px cards, 5.3
               screens of scrolling for a section that is one screen with the
               pan on. */
            stacked
              ? "grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3"
              : "flex w-max items-center gap-[clamp(1.5rem,3vw,3rem)] px-[clamp(1.5rem,5vw,5rem)]"
          }
          style={stacked ? undefined : { x }}
        >
          <div
            className={
              stacked
                ? "w-full sm:col-span-2 xl:col-span-3"
                : "w-[clamp(17rem,26vw,24rem)] shrink-0"
            }
          >
            {/* "impossible to ignore" was a promise. This is where it cashes. */}
            <EyeDoodle className="mb-6 w-[clamp(6rem,11vw,9rem)] text-white" />
            <ActLabel>The work</ActLabel>
            {/* Not "Five brands, and…": counting them dates the section the
                moment a sixth lands, and the count was never the interesting
                part. */}
            <h2
              className="mt-[1.2rem] mb-0"
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(2rem, 3.6vw, 3rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                color: "#FFFFFF",
                textWrap: "balance",
              }}
              data-testid="text-work-heading"
            >
              The stories we've shaped.
            </h2>
          </div>

          {ORDERED_CASES.map((c) => (
            <Card key={c.id} c={c} stacked={stacked} />
          ))}

          {/* trailing air, so the fifth card does not end flush against the
              edge of the frame. The paragraph about where the numbers come from
              used to live here; Fatema cut it, and she is right — a disclaimer
              is the wrong last thing to read after five case studies. */}
          {!stacked && <span aria-hidden="true" className="w-[clamp(1.5rem,5vw,5rem)] shrink-0" />}
        </motion.div>

        {/* STACKED, THIS HAS TO BE INSIDE THE FRAME. The act's stage is a flex
            row, so a second child sitting beside the rail is a second COLUMN:
            the two split the width and every card came out half a screen wide.
            Panning, it is absolutely positioned and therefore out of flow, so
            it can stay a sibling and pin itself to the bottom of the stage —
            which is where it has to be, a footnote under the cards rather than
            a strip under the rail. */}
        {stacked && <Brands stacked />}
      </div>

      {!stacked && <Brands stacked={false} />}
    </>
  );
}

function Card({ c, stacked }: { c: OrderedCase; stacked: boolean }) {
  return (
    /* A LINK TO THE CASE'S OWN PAGE.
       This was a <button> that opened a dialog, and a button has nowhere to
       go: nothing that reads the page rather than clicking it could tell there
       were five case studies behind these cards, let alone find them.

       The click writes down where the page was before it leaves. The rail is a
       pinned act, so "which card was I on" is a scroll position, and without it
       Back would return the reader to the top of a page they were six screens
       into. Home reads it back — see useActHash in pages/home.tsx. */
    <Link
      href={c.path}
      data-case={c.id}
      onClick={() => {
        window.history.replaceState(
          { ...window.history.state, [HOME_Y]: window.scrollY },
          "",
        );
      }}
      className={
        "group flex cursor-pointer flex-col overflow-hidden rounded-[3px] border p-0 text-left no-underline transition-[border-color,background-color,transform] duration-200 hover:-translate-y-[3px] focus-visible:-translate-y-[3px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#cf81cd] " +
        (stacked
          ? "w-full "
          : "w-[clamp(19rem,28vw,26rem)] shrink-0 self-stretch max-h-[37rem] ")
      }
      style={{
        borderColor: "rgba(255,255,255,0.13)",
        backgroundColor: "rgba(255,255,255,0.028)",
        color: "inherit",
        font: "inherit",
      }}
      data-testid={`card-case-${c.id}`}
    >
      {/* THE PLATE IS A PHOTOGRAPH.
          It used to be a drawn mark per case, in the page's own ink. Fatema's
          verdict was that those looked weird and that she wanted the real
          thing. Five real pictures, one design language — and the language has
          to be the TREATMENT, because the subjects have nothing in common: a
          phone in a hand, a shopping collage, a night venue, a match. So every
          one gets the same three things: a 16:10 band, a navy veil weighted to
          the bottom, and the figure standing on that veil. At rest the rail
          reads as one muted index; the card under the pointer comes back to
          full colour. That is what makes five unrelated photographs a set. */}
      <span
        className={
          "relative block w-full overflow-hidden " +
          (stacked ? "aspect-[19/10] " : "aspect-[16/10] ")
        }
        style={{ backgroundColor: "#06041A", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* lazy, and off the main thread: five 1400px photographs are the whole
            weight of this page, and four of them are a viewport and a half of
            lateral pan away from anything a reader has looked at yet */}
        <img
          src={c.img}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.015] object-cover object-center transition-[filter,transform] duration-500 [filter:saturate(0.6)_contrast(1.05)_brightness(0.9)] group-hover:scale-[1.055] group-hover:[filter:none] group-focus-visible:scale-[1.055] group-focus-visible:[filter:none] [@media(hover:none)]:scale-100 [@media(hover:none)]:[filter:saturate(0.88)_contrast(1.02)_brightness(0.95)]"
        />
        {/* Weighted to the bottom, not flat. Flat enough to unify five pictures
            is already too dark to see any of them. The top of the band is not
            clear glass either — a flat navy tint costs a dark photograph almost
            nothing and pulls a pale one (Tuisa's is nearly white) back into the
            set. Without it that card read as a hole in the rail. */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(6,4,26,0.94) 0%, rgba(6,4,26,0.87) 14%, rgba(8,6,34,0.58) 40%, rgba(12,10,62,0.36) 70%, rgba(12,10,62,0.3) 100%)",
          }}
        />

        {/* The brand sits ON the picture. In the card footer it was a caption
            filed under a photograph that could have been anybody's; up here it
            is what the picture IS, and the number beside it is the card's
            position in the rail. It sits on the lightest part of the veil, so
            it carries its own shadow. */}
        <span
          className="absolute left-[clamp(1.2rem,2vw,1.7rem)] top-[clamp(0.95rem,1.6vw,1.3rem)] z-[2] flex items-baseline gap-[0.7rem]"
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#fff",
            textShadow: "0 1px 8px rgba(6,4,26,0.85), 0 0 22px rgba(6,4,26,0.6)",
          }}
        >
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.62)" }}>{c.n}</span>
          {c.shortClient ?? c.client}
        </span>

        <span className="absolute bottom-[clamp(1rem,1.6vw,1.4rem)] left-[clamp(1.2rem,2vw,1.7rem)] z-[2] grid gap-[0.25rem]">
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: "clamp(1.7rem, 2.7vw, 2.3rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#fff",
              textShadow: "0 1px 10px rgba(6,4,26,0.8)",
            }}
          >
            {c.fig}
          </span>
          <span
            className="max-w-[13rem]"
            style={{
              fontSize: "0.74rem",
              lineHeight: 1.35,
              letterSpacing: "0.01em",
              color: "rgba(255,255,255,0.72)",
              textShadow: "0 1px 8px rgba(6,4,26,0.85)",
            }}
          >
            {c.figLab}
          </span>
        </span>
      </span>

      <span
        className={
          "flex flex-1 flex-col " +
          (stacked ? "px-[1.3rem] py-[1.4rem] " : "p-[clamp(1.4rem,2.2vw,1.9rem)] ")
        }
      >
        {/* This slot held a rhetorical question and now holds the TENSION: the
            thing that was actually wrong, named in a sentence a reader might
            recognise as their own. Longer than a question, so a step down in
            size — the number above it is the loud element, and this earns it. */}
        <span
          /* room under it: a four-line sentence used to finish on the footer's
             rule */
          className="block pb-[1.2rem]"
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: stacked ? "1.14rem" : "clamp(1.12rem, 1.55vw, 1.36rem)",
            lineHeight: 1.32,
            letterSpacing: "-0.015em",
            color: "rgba(255,255,255,0.96)",
            textWrap: "pretty",
          }}
        >
          {c.q}
        </span>

        <span
          className="mt-auto flex items-baseline justify-between gap-4 pt-[1.3rem]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          {/* the client name moved onto the picture, so the footer carries the
              category instead — one word, and the thing a reader scans for */}
          <span
            style={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {c.kind}
          </span>
          <span
            className="shrink-0 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white"
            style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}
          >
            Read the case <span aria-hidden="true">→</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

/**
 * THE BRANDS, INSIDE THE WORK.
 *
 * This was a section of its own between the rail and the services, and it read
 * as exactly that: a strip nobody had introduced, sitting in the gap between two
 * things that did belong. Fatema's word was orphaned. It is a footnote to the
 * work, so it is a footnote to the work — pinned to the bottom of this act's own
 * frame, under a rule, while the cards pan above it.
 *
 * A marquee, in type, at the site's own weights. No logo wall: nine grey
 * trademarks at nine different optical weights is the least designed thing a
 * page like this can do, and half of them would need permission we do not have.
 *
 * With motion off it becomes an ordinary wrapped list. A strip that never stops
 * moving is the single worst thing on a page for anyone who asked for stillness.
 */
function Brands({ stacked }: { stacked: boolean }) {
  const reduced = useReducedMotion();
  const still = stacked || !!reduced;

  return (
    <div
      className={
        still
          ? "relative z-[2] mt-[clamp(2rem,5vh,3rem)] w-full"
          : "pointer-events-none absolute inset-x-0 bottom-[clamp(1.4rem,4vh,2.8rem)] z-[2]"
      }
    >
      <div
        className={
          "grid items-center gap-y-[0.9rem] " +
          (still
            ? "grid-cols-1 "
            : "mx-[clamp(1.5rem,5vw,5rem)] grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(1.2rem,3vw,2.4rem)] ")
        }
        style={{
          paddingTop: "clamp(0.9rem, 2vh, 1.3rem)",
          borderTop: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.66rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            whiteSpace: "nowrap",
          }}
        >
          Also worked with
        </span>

        {still ? (
          <p className="m-0 flex flex-wrap items-center gap-y-2">
            {BRANDS.map((b, i) => (
              <span key={b} className="flex items-center">
                <Brand>{b}</Brand>
                {i < BRANDS.length - 1 && <Dot />}
              </span>
            ))}
          </p>
        ) : (
          <div className="marquee pointer-events-auto relative overflow-hidden">
            <div className="marquee__track flex w-max">
              {/* twice, so translateX(-50%) lands exactly where it started */}
              {[0, 1].map((set) => (
                <div key={set} className="flex shrink-0 items-center" aria-hidden="true">
                  {BRANDS.map((b) => (
                    <span key={b} className="flex items-center">
                      <Brand>{b}</Brand>
                      <Dot />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {/* the moving copy is hidden from assistive tech; this is the
                readable one */}
            <p className="sr-only">Brands we have worked with: {BRANDS.join(", ")}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Brand({ children }: { children: string }) {
  return (
    <span
      className="marquee__b whitespace-nowrap transition-colors duration-200"
      style={{
        fontFamily: SERIF,
        fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
        letterSpacing: "-0.015em",
        /* 0.42 measured 3.96:1 at 18px against 4.5:1 required — a name at this
           size is under the large-text threshold, so the alpha carries it */
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {children}
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="mx-[clamp(0.9rem,2.4vw,2rem)] block h-1 w-1 shrink-0 rounded-full"
      style={{ backgroundColor: "rgba(207,129,205,0.55)" }}
    />
  );
}


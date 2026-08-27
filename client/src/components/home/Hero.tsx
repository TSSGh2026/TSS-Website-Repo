import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "wouter";
import { useMotionValueEvent, useReducedMotion, type MotionValue } from "framer-motion";
import { Act, ActWrap } from "./Act";
import { useNarrow } from "@/hooks/use-act-progress";
import { useCmsSettings } from "@/hooks/use-cms";
import { currentHero } from "@shared/hero";

const NAVY = "#0C0A3E";

/**
 * ACT 1 — THE SHAPING.
 *
 * Every word of the final line is already in the first line. Nothing is added,
 * only removed, which is the service performed instead of claimed:
 *
 *   We are a full-service, senior-led marketing collective that helps ambitious
 *   companies shape brand strategy, positioning, content and go-to-market
 *   stories that genuinely land.
 *
 *                              ↓ scroll
 *
 *   We shape stories.
 *
 * WHAT THIS REPLACED
 *
 * A timed six-beat film: two headlines that swapped themselves on a clock,
 * whether or not anybody was watching, and were finished before most readers
 * had stopped moving. This one is welded to the scrollbar, so it runs at the
 * reader's speed, backwards if they scroll up, and not at all if they leave.
 *
 * WHY THIS PAINTS IMPERATIVELY
 *
 * Every frame rewrites the font size, the width of twenty-two words, and the
 * scale of twenty-two strikethroughs. Through React that is 22 components
 * re-rendering per animation frame for the length of a three-screen act. So
 * progress is subscribed to directly and the writes go to refs. Nothing here
 * re-renders while you scroll it.
 */
export function Hero() {
  /* A pinned act's span is how much SCROLL its animation costs, not how much it
     contains, so it is where a phone can give length back without losing a
     beat. The page is 13.9 viewport-heights on a 375x660 screen with the
     desktop spans; the two pinned acts hand 1.1 of that back between them. */
  const narrow = useNarrow(40);

  return (
    <Act
      id="act-shape"
      kind="pin"
      span={narrow ? 2.4 : 2.8}
      ground="dark"
      bg={NAVY}
      /* the cue is pinned to the bottom of the STAGE, so it travels with the
         sticky frame rather than with the section's 2.8-viewport box */
      stageClassName="relative"
    >
      {(progress) => <Shaping progress={progress} />}
    </Act>
  );
}

/* ---------------------------------------------------------------------------
   THE SENTENCE

   `cut` is WHEN a word is struck out, and the order is authored rather than
   left to right: the sentence loses its qualifiers before it loses its clauses,
   so what is on screen is a shorter sentence at every stage rather than a
   half-eaten one.
   ------------------------------------------------------------------------- */
type Word = { t: string; cut?: number; final?: boolean };

const WORDS: Word[] = [
  { t: "We" },
  { t: "are", cut: 0.66 },
  { t: "a", cut: 0.52 },
  { t: "full-service,", cut: 0.06 },
  { t: "senior-led", cut: 0.54 },
  { t: "marketing", cut: 0.56 },
  { t: "collective", cut: 0.58 },
  { t: "that", cut: 0.38 },
  { t: "helps", cut: 0.4 },
  { t: "ambitious", cut: 0.09 },
  { t: "companies", cut: 0.42 },
  { t: "shape" },
  { t: "brand", cut: 0.2 },
  { t: "strategy,", cut: 0.22 },
  { t: "positioning,", cut: 0.24 },
  { t: "content", cut: 0.26 },
  { t: "and", cut: 0.28 },
  { t: "go-to-market", cut: 0.3 },
  { t: "stories", final: true },
  { t: "that", cut: 0.68 },
  { t: "genuinely", cut: 0.12 },
  { t: "land.", cut: 0.7 },
];

const CUT_LEN = 0.07;
const SETTLE = 0.78;
const LAST = 18;
/* THE WINK IS GONE — Fatema, 25 Aug: it felt out of place once the sentence had
   settled on "We shape stories." It was a drawn smiley that opened after the
   full stop, sized in em so it scaled with the payoff. The reason it did not
   land is the same one that moved it off its own line and into the sentence in
   the first place: the act's last frame is a sentence that has just finished
   cutting itself down to three words, and a face arriving afterwards is a
   second punchline on a line that already had one. The stitch under "stories"
   is the mark that beat lands on. */
/** The three words that survive — We / shape / stories — are at full strength
 *  from the first frame; the nineteen that get cut open at 55%. So the opening
 *  frame is not a wall, it is already legible as "We shape stories" with the
 *  qualifiers set around it, and the scroll then removes exactly what the eye
 *  had already deprioritised. It makes the mechanic legible BEFORE it runs
 *  rather than only in hindsight. */
const DOOMED = 0.55;
const ROWS_END = 1;
const BASE = 40;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * How many lines the sentence is allowed to occupy at rest.
 *
 * The two numbers move in opposite directions and that is not a mistake. A
 * block's height goes as rows SQUARED, so this is the one number that fills the
 * frame. On a 1440 screen the old budget put the block at 57% and it read as a
 * wall — Fatema's first reaction was a huge block of text with nothing to look
 * at. On a 375 one the SAME budget puts the sentence at 24px and 35% of the
 * screen, a caption rather than a poster, because a phone fits three words to a
 * line. Measured: 5.4 gives 57% at 1440, and 9 gives 59% at 375.
 */
const rowsOpen = () => (window.innerWidth < 40 * 16 ? 9 : 5.4);

/**
 * The button the film ends on.
 *
 * It used to be a bare <a>, which was right when the href was a hash: through
 * hero v4 this button pointed at "#act-close" and merely scrolled the reader
 * down to the closing act, where a second button with the same words on it was
 * the one that opened the form. Now it goes to the form itself.
 *
 * Which means the element has to be chosen rather than assumed. "/contact" is a
 * wouter route, and a plain anchor would reload the whole app to reach a page
 * the client already has. But the href is a CMS field — free text, edited in
 * the admin, and it has held a hash before — so a hash or an off-site URL still
 * has to render as an anchor the browser handles itself. Handing either of
 * those to wouter's Link would push it onto the router as a path.
 */
function HeroCta({ href, label }: { href: string; label: string }) {
  const className =
    "group relative mt-[clamp(2rem,5vh,3.5rem)] inline-flex min-h-12 items-center gap-[0.6rem] rounded-full px-[2.1rem] py-[1.05rem] no-underline transition-[background-color,transform] duration-200 hover:bg-[#e0a0de] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white";
  const style: React.CSSProperties = {
    backgroundColor: "#cf81cd",
    color: NAVY,
    fontFamily: "'Switzer', sans-serif",
    fontSize: "1.02rem",
    fontWeight: 600,
    letterSpacing: "0.005em",
  };
  const inner = (
    <>
      {label}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </>
  );

  /* leading slash, and not "//" — that is a protocol-relative URL, off-site */
  const isRoute = href.startsWith("/") && !href.startsWith("//");

  if (isRoute) {
    return (
      <Link href={href} className={className} style={style} data-testid="button-hero-cta">
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} className={className} style={style} data-testid="button-hero-cta">
      {inner}
    </a>
  );
}

function Shaping({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();

  const flowRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const strikeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef = useRef<HTMLSpanElement>(null);
  const stitchRef = useRef<HTMLElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  /** per-word widths in em at both weights, measured once */
  const m = useRef({ em: [] as number[], emBold: [] as number[], emFinal: 0, EM0: 1 });

  const { data: settings } = useCmsSettings();
  const hero = currentHero(settings?.hero);

  const measure = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const words = wordRefs.current;
    flow.style.fontSize = `${BASE}px`;

    /* Measured at BOTH weights. The sentence opens at 700 and steps to 400 at
       the payoff, and Zodiak Bold is materially wider — sized from the regular
       measurement, the opening line runs past its row budget and the last word
       on each line clips. */
    flow.style.fontWeight = "700";
    const emBold = words.map((el) => {
      if (!el) return 0;
      el.style.width = "auto";
      return el.getBoundingClientRect().width / BASE;
    });
    flow.style.fontWeight = "400";
    const em = words.map((el) => {
      if (!el) return 0;
      el.style.width = "auto";
      return el.getBoundingClientRect().width / BASE;
    });

    /* the payoff word gains a full stop; measured without it the period is
       clipped straight off the end of the line */
    let emFinal = em[LAST];
    const lastEl = words[LAST];
    const textEl = textRef.current;
    if (lastEl && textEl) {
      /* PUT THE OVERFLOW BACK, and this is not tidiness.
         An inline-block takes its baseline from the bottom margin edge when its
         overflow is anything but visible, and from its own last line of text
         when it is visible. Every other word here is overflow-hidden, so a
         `visible` left behind on this one aligned it by a different rule than
         its neighbours and dropped "stories." 26.8px below "We shape" — the
         payoff word hanging off the end of the settled line.
         Restoring it puts the drop at 0. The box is still wide enough for the
         full stop, because the width measured below is the auto width. */
      const prevOverflow = lastEl.style.overflow;
      lastEl.style.overflow = "visible";
      textEl.textContent = "stories.";
      lastEl.style.width = "auto";
      emFinal = lastEl.getBoundingClientRect().width / BASE;
      textEl.textContent = "stories";
      lastEl.style.overflow = prevOverflow;
    }

    words.forEach((el, i) => {
      if (el) el.style.width = `${em[i]}em`;
    });

    /* the full sentence's width, which is what "how much is left" is measured
       against in paint() */
    const EM0 = WORDS.reduce((s, _w, i) => s + (emBold[i] || em[i]) + 0.3, 0);
    m.current = { em, emBold, emFinal, EM0 };
  }, []);

  const paint = useCallback((p: number) => {
    const flow = flowRef.current;
    if (!flow) return;
    const { em, emBold, emFinal, EM0 } = m.current;
    if (!em.length) return;

    /* the sentence is BOLD until it has been cut down, then steps to regular:
       the edit is visible in the weight as well as in the word count. Zodiak
       has nothing between 400 and 700, so it steps rather than ramps — and it
       steps on SETTLE, where the full stop and the stitch arrive anyway, so it
       reads as one event. */
    const heavy = p <= SETTLE;
    flow.style.fontWeight = heavy ? "700" : "400";

    let aliveEm = 0;
    WORDS.forEach((wd, i) => {
      const el = wordRefs.current[i];
      const strike = strikeRefs.current[i];
      if (!el || !strike) return;
      const base = heavy ? emBold[i] || em[i] : em[i];

      if (wd.cut === undefined) {
        const w = wd.final && emFinal && p > SETTLE ? emFinal : base;
        el.style.opacity = "1";
        el.style.width = `${w}em`;
        el.style.marginRight = "0.3em";
        strike.style.transform = "scaleX(0)";
        aliveEm += w + 0.3;
        return;
      }

      const k = clamp01((p - wd.cut) / CUT_LEN);
      const mark = clamp01(k / 0.45);
      const gone = clamp01((k - 0.45) / 0.55);
      /* the space holds to the end so the neighbour never slides into a
         half-clipped word */
      const sp = 0.3 * (1 - Math.pow(gone, 3));
      strike.style.transform = `scaleX(${mark})`;
      el.style.opacity = String(DOOMED * (1 - 0.35 * mark) * Math.pow(1 - gone, 1.9));
      el.style.width = `${base * (1 - gone)}em`;
      el.style.marginRight = `${sp}em`;
      aliveEm += base * (1 - gone) + sp;
    });

    /* Type size follows the WORD COUNT, not scroll position. Tied to p alone it
       hits display size with seventeen words standing and bursts off screen.

       Rows follow how much text is LEFT for the same reason: a block's height
       goes as rows squared over the text remaining, so rows proportional to
       sqrt(remaining) holds the block at constant mass while the sentence is
       cut. What you watch is the removal, not the paragraph bouncing between
       560px and 98px on the way down. Only the last stretch pulls it to a
       single display line for the payoff. */
    const C = (flow.getBoundingClientRect().width || window.innerWidth) * 0.92;
    const toOne = clamp01((p - 0.55) / (SETTLE - 0.55));
    let rows = Math.max(1, rowsOpen() * Math.sqrt(clamp01(aliveEm / EM0)));
    rows = rows * (1 - toOne) + ROWS_END * toOne;

    let fs = Math.min(
      Math.max((C * rows) / Math.max(aliveEm, 0.5), 20),
      Math.min(0.115 * window.innerWidth, 8.6 * 16),
    );
    /* a height guard, because the width formula alone does not know how tall
       the stage is. `rows` is a TARGET and real wrapping overshoots it by most
       of a line, so the divisor carries that slack — without it the block
       measured 73% of the stage against a 62% budget. */
    fs = Math.max(Math.min(fs, (window.innerHeight * 0.68) / ((rows + 0.7) * 1.2)), 20);
    flow.style.fontSize = `${fs}px`;

    if (textRef.current) textRef.current.textContent = p > SETTLE ? "stories." : "stories";
    if (stitchRef.current) {
      stitchRef.current.style.transform = `scaleX(${clamp01((p - SETTLE) / 0.07)})`;
    }

    const tail = clamp01((p - SETTLE - 0.08) / 0.08);
    if (tailRef.current) {
      tailRef.current.style.opacity = String(tail);
      /* The row is 0fr or 1fr, never in between. Growing it in step with the
         fade read as a button sliced in half by an invisible edge — the
         overflow:hidden that makes 0fr collapse was clipping the control at
         every frame. Height snaps; the arrival is the opacity and the rise. */
      tailRef.current.style.gridTemplateRows = tail > 0 ? "1fr" : "0fr";
      tailRef.current.style.transform = `translateY(${(1 - tail) * 14}px)`;
    }

    /* the scroll cue is gone before the first word is struck out. It exists to
       say "this moves", and once it has moved it is a leftover. */
    if (cueRef.current) {
      const c = 1 - clamp01((p - 0.005) / 0.05);
      cueRef.current.style.opacity = String(c);
      cueRef.current.style.visibility = c > 0.01 ? "visible" : "hidden";
    }
  }, []);

  /* Measured before paint, and re-measured when the fonts land: measured
     against a fallback face every width is wrong, and the sentence would be
     sized for a typeface that is never on the screen. */
  useLayoutEffect(() => {
    measure();
    paint(reduced ? 1 : progress.get());

    const onResize = () => {
      measure();
      paint(reduced ? 1 : progress.get());
    };
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, paint, progress, reduced]);

  useMotionValueEvent(progress, "change", (p) => {
    if (!reduced) paint(p);
  });

  useEffect(() => {
    if (reduced) paint(1);
  }, [reduced, paint]);

  return (
    <ActWrap>
      {/* The film is a paragraph of spans that resize themselves; this is the
          sentence a search engine and a screen reader get. */}
      <h1 className="sr-only" data-testid="text-hero-heading">
        {hero.heading} {hero.headingLine2}
      </h1>
      <p className="sr-only">{hero.subheading}</p>

      <p
        ref={flowRef}
        aria-hidden="true"
        /* hero-flow carries the pre-hydration font-size only; paint() writes an
           exact px size inline and inline wins. See index.css. */
        className="hero-flow m-0 flex w-full flex-wrap items-baseline justify-center"
        style={{
          fontFamily: "'Zodiak', Georgia, serif",
          fontWeight: 700,
          lineHeight: 1.14,
          letterSpacing: "-0.022em",
          rowGap: "0.08em",
          columnGap: 0,
          color: "#FFFFFF",
        }}
      >
        {WORDS.map((wd, i) => (
          <span key={`${wd.t}-${i}`}>
            <span
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="relative mr-[0.3em] inline-block overflow-hidden whitespace-nowrap"
            >
              <span className="inline-block">
                {wd.final ? (
                  <span className="relative inline-block italic">
                    <span ref={textRef}>stories</span>
                    {/* the same mark the turn draws under "story", three
                        screens later. Two moments, one claim. */}
                    <i
                      ref={stitchRef}
                      aria-hidden="true"
                      /* bottom-0, not the -0.01em it sat at. That 1.2px of
                         overhang was invisible only while the word span had a
                         stray overflow:visible on it; with the span clipping
                         again it took 1.2px off a 3px mark and the stitch drew
                         thin. 0.01em is a hundredth of the type size, so
                         nothing moves that the eye can find. */
                      className="absolute bottom-0 left-[0.03em] right-[0.34em] block h-[3px] rounded-[3px]"
                      style={{
                        transformOrigin: "left center",
                        transform: "scaleX(0)",
                        background:
                          "linear-gradient(90deg, transparent, #c36cc1 14%, #edb8eb 52%, #c36cc1 86%, transparent)",
                      }}
                    />
                  </span>
                ) : (
                  wd.t
                )}
              </span>
              <span
                ref={(el) => {
                  strikeRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-[52%] block h-[0.05em] w-full rounded-[2px]"
                style={{
                  backgroundColor: "#cf81cd",
                  transformOrigin: "left center",
                  transform: "scaleX(0)",
                }}
              />
            </span>
          </span>
        ))}
      </p>

      {/* The whole tail: one button. No positioning sentence, no four pillars,
          no second link. The film has just said what this is, and anything
          printed underneath it is the film explaining itself — a poster that
          explains itself is a poster that did not work. */}
      <div
        ref={tailRef}
        className="grid text-center"
        style={{ gridTemplateRows: "0fr", opacity: 0 }}
      >
        {/* overflow:hidden is what makes the 0fr row collapse, and it was also
            clipping 10px off the CTA's 48px hit area. The padding buys that
            back; the equal negative margin nets it to zero in the track. The
            gap above has to live on the CHILD — a margin on the grid item
            itself is outside the content box min-height:0 zeroes, so it kept
            sizing the track and the collapsed tail was still 33px tall. */}
        <div className="min-h-0 overflow-hidden pb-[14px] mb-[-14px]">
          <HeroCta href={hero.ctaLink} label={hero.ctaText} />
        </div>
      </div>

      {/* The scroll cue. The opening frame is a sentence sitting still and
          nothing on it says it is about to be edited. A chevron that breathes
          says "this moves, and downward" without adding a word of subtext — the
          hairline it replaced could say the first half of that but never the
          second, which is what made it read as an artefact. The breath itself
          is in index.css; the fade-out is driven by progress above. */}
      <div
        ref={cueRef}
        aria-hidden="true"
        /* 2.2rem floor, not the 1.6rem the hairline used. On a 375x660 phone
           the stage runs past the fold, and at 1.6rem the chevron's bottom
           landed at 664 against a 660 viewport — clipping the POINT, which is
           the only part of an arrow that says which way to go. The old hairline
           survived the same 4px because it was 35px tall and had nothing at its
           tip worth reading. Larger viewports are unaffected: 4vh overtakes the
           floor by 390x844 and the 2.8rem ceiling is unchanged. */
        className="hero-cue absolute bottom-[clamp(2.2rem,4vh,2.8rem)] left-1/2 -translate-x-1/2"
      >
        <svg width="22" height="13" viewBox="0 0 22 13" fill="none">
          <path
            d="M1.5 1.5 L11 11 L20.5 1.5"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </ActWrap>
  );
}

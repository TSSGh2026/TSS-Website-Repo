import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/offer-config";
import { Reveal } from "../reveal";
import { WordCycler } from "../word-cycler";

/* Each ending is kept short enough to hold one line on desktop. */
const ENDINGS = [
  "do nothing for you.",
  "you’d rather not send.",
  "are still “almost ready”.",
  "never say what you do.",
  "look like everyone else’s.",
];

/**
 * Real grabs of real pages. Two crops per site so the stream reads as a long
 * scroll of many screens rather than five posters.
 */
const COL_A = [
  "/proof/tiles/theyn-a.webp",
  "/proof/tiles/hitl-b.webp",
  "/proof/tiles/tuisa-a.webp",
  "/proof/tiles/tss-b.webp",
  "/proof/tiles/schmancy-b.webp",
  "/proof/tiles/tuisa-b.webp",
];

const COL_B = [
  "/proof/tiles/tss-a.webp",
  "/proof/tiles/schmancy-a.webp",
  "/proof/tiles/theyn-b.webp",
  "/proof/tiles/hitl-a.webp",
  "/proof/tiles/tuisa-b.webp",
  "/proof/tiles/hitl-b.webp",
];

const COL_C = [
  "/proof/tiles/tuisa-a.webp",
  "/proof/tiles/theyn-a.webp",
  "/proof/tiles/schmancy-b.webp",
  "/proof/tiles/tss-b.webp",
  "/proof/tiles/hitl-b.webp",
  "/proof/tiles/schmancy-a.webp",
];

function Shot({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_28px_64px_-28px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <img src={src} alt="" fetchPriority="low" decoding="async" className="block w-full" />
    </div>
  );
}

/** One endlessly looping column. The list is doubled, the track travels -50%. */
function Column({
  tiles,
  duration,
  down,
}: {
  tiles: string[];
  duration: string;
  down?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div
        className={cn("stack-track", down && "stack-track-down")}
        style={{ "--dur": duration } as React.CSSProperties}
      >
        {[...tiles, ...tiles].map((src, i) => (
          <Shot key={`${src}-${i}`} src={src} className="mb-6" />
        ))}
      </div>
    </div>
  );
}

/** The diagonal stream that sits behind/beside the headline on desktop. */
function SiteStream() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46vw] max-w-[820px] overflow-hidden lg:block"
    >
      <div className="absolute -top-[16%] left-[4%] flex h-[132%] w-[136%] rotate-[-10deg] gap-5">
        <Column tiles={COL_A} duration="58s" />
        <Column tiles={COL_B} duration="72s" down />
        <Column tiles={COL_C} duration="64s" />
      </div>
      {/* Blend the stream into the navy on every edge — including the right,
          which previously chopped the last column off mid-tile. */}
      <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-navy via-navy/70 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy to-transparent" />
    </div>
  );
}

/** Mobile gets the same idea as a single horizontal run. */
function SiteRow() {
  const tiles = [...COL_A, ...COL_B];
  return (
    <div aria-hidden className="relative mt-12 overflow-hidden lg:hidden">
      <div className="stack-row" style={{ "--dur": "46s" } as React.CSSProperties}>
        {[...tiles, ...tiles].map((src, i) => (
          <Shot key={`${src}-${i}`} src={src} className="mr-4 w-[200px] shrink-0 sm:w-[240px]" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-navy to-transparent" />
    </div>
  );
}

/**
 * Banner. The headline on the left, an endless scroll of the sites we've built
 * on the right — the work is the proof, so it runs before anything is claimed.
 */
export function Hero() {
  return (
    <header className="relative flex min-h-[88svh] flex-col overflow-hidden px-6 pb-14 pt-14 md:px-12 md:pb-16 md:pt-16">
      <SiteStream />

      <div className="relative z-1 mx-auto flex w-full max-w-[1120px] flex-1 flex-col">
        <Reveal>
          <div className="flex items-center justify-between gap-6">
            <a href={SITE_URL} target="_blank" rel="noreferrer">
              <img
                src="/images/tss-logo-white.webp"
                alt="The Story Shapers"
                width={640}
                height={167}
                className="h-7 w-auto opacity-90 transition-opacity hover:opacity-100 sm:h-8"
              />
            </a>
            <a
              href="#apply"
              /* Sits over the bright screenshot tiles, so it needs a near-opaque
                 plate rather than a light tint. o-accent-edge takes the border
                 to the accent on hover, o-tap gives the press a push. */
              className="o-eyebrow o-tap o-accent-edge rounded-full border border-white/20 bg-navy/90 px-4 py-2 text-white/85 backdrop-blur-sm"
            >
              APPLY
            </a>
          </div>
        </Reveal>

        <div className="flex flex-1 flex-col justify-center py-14 md:py-24 lg:max-w-[600px]">
          <Reveal delay={1}>
            {/* What the offer is, in one line. A standing offer: no deadline, no count. */}
            <p className="o-eyebrow text-white/70">
              THE WEBSITE OFFER
              <span className="hidden sm:inline"> · </span>
              <span className="mt-1.5 block sm:mt-0 sm:inline">
                ₹80,000 ALL IN
              </span>
            </p>
          </Reveal>

          <Reveal delay={2}>
            {/* `text-wrap: balance` because the display face changed underneath
                this line. Zodiak sets narrower than Libre Baskerville did, so
                "Freedom from websites that" newly fits across two lines and
                dropped "that" onto a line of its own. Balancing lets the line
                find its own break instead of pinning one that was only ever
                right for the old metrics. */}
            <h1 className="o-display mt-8 text-[36px] leading-[1.08] text-balance sm:text-[46px] md:text-[54px]">
              Freedom from websites that{" "}
              {/* Own line, fixed height — the cycler never reflows the line above. */}
              <span className="mt-1 block min-h-[2.2em] sm:min-h-[1.12em]">
                <WordCycler words={ENDINGS} />
              </span>
            </h1>
          </Reveal>

          <SiteRow />
        </div>

      </div>
    </header>
  );
}

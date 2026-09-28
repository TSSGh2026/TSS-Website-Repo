import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FORMATS, type Format } from "./content";
import { EASE, Head, Reveal, Wrap } from "./site";

const TALLEST = Math.max(...FORMATS.map((f) => f.h));
/** How far a cover swings in the row: enough to see the page, never onto a neighbour. */
const PEEK = -72;
/** How far it swings in the enlarged view, where there is room to lay it almost flat. */
const FULL = -158;

/** A format whose cover swings open on its spine (as opposed to a case, a box or a screen). */
const hinged = (f: Format) => !f.kind;

/** What you see under the cover: a text page, a photo page, or a zine's big type.
 *  `flush` is for a cover swung right out of the way, so the page can use its full width. */
function Inside({ f, flush = false }: { f: Format; flush?: boolean }) {
  const pad = flush ? "pl-[10%]" : "pl-[38%]";
  if (f.inside === "photo" && flush) {
    return <Spread f={f} half="right" />;
  }
  if (f.inside === "photo") {
    return (
      <div className={`flex h-full flex-col bg-white py-[8%] pr-[8%] ${flush ? "pl-[8%]" : "pl-[36%]"}`}>
        <img src={photoOf(f)} alt="" loading="lazy" className="h-[68%] w-full object-cover" />
        <div className="mt-[8%] h-[3px] w-[55%] bg-ink/60" />
        <div className="mt-[5%] h-[2px] w-[80%] bg-ink/15" />
      </div>
    );
  }
  if (f.inside === "zine") {
    return (
      <div className={`flex h-full flex-col justify-center bg-[#fbf8f1] py-[12%] pr-[10%] ${pad}`}>
        <p className="display text-[max(9px,calc(11px*var(--fmt-scale)))] leading-[1.15] text-magenta italic">
          &ldquo;We moved with two suitcases and a pressure cooker.&rdquo;
        </p>
        <div className="mt-[10%] h-[2px] w-[40%] bg-ink/25" />
      </div>
    );
  }
  return (
    <div className={`flex h-full flex-col bg-[#fbf8f1] py-[12%] pr-[10%] ${pad}`}>
      <p className="kicker text-[max(7px,calc(6px*var(--fmt-scale)))] tracking-[0.16em] text-magenta">Chapter one</p>
      <div className="mt-[8%] h-[4px] w-[70%] bg-ink/70" />
      <div className="mt-[10%] space-y-[6%]">
        {[92, 86, 95, 80, 90, 70, 88, 94, 60].map((w, i) => (
          <div key={i} className="h-[2px] bg-ink/20" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

const photoOf = (f: Format) => f.image ?? "/images/books/album-together.webp";

/** One half of a photograph laid across two facing pages, edge to edge. */
function Spread({ f, half }: { f: Format; half: "left" | "right" }) {
  return (
    <div
      className="h-full w-full bg-cover"
      style={{ backgroundImage: `url(${photoOf(f)})`, backgroundSize: "200% 100%", backgroundPosition: `${half} center` }}
    />
  );
}

function Cloth({ f, label, hideLabel = false }: { f: Format; label: string; hideLabel?: boolean }) {
  return (
    <span
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(90deg, rgba(0,0,0,0.36) 0 4px, rgba(255,255,255,0.12) 4px 5px, transparent 6px), ${f.cloth}`,
        backfaceVisibility: "hidden",
      }}
    >
      <span
        className="absolute inset-0 opacity-[0.16]"
        style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 3px)" }}
      />
      <span className="absolute inset-[9%] border border-[#e0d6c2]/35" />
      <span
        className="display relative px-3 text-center text-[calc(13px*var(--fmt-scale))] leading-[1.15] text-[#f4f1ea]/90 italic transition-opacity duration-300"
        style={{ opacity: hideLabel ? 0 : 1 }}
      >
        {label}
      </span>
    </span>
  );
}

/**
 * The object itself, at whatever --fmt-scale its container sets. Used twice: small in the row,
 * large in the enlarged view. `swing` is how far a hinged cover opens.
 */
function Drawing({ f, open, swing, delay = 0 }: { f: Format; open: boolean; swing: number; delay?: number }) {
  const still = useReducedMotion();
  const w = `calc(${f.w}px * var(--fmt-scale))`;
  const h = `calc(${f.h}px * var(--fmt-scale))`;
  const t = { duration: still ? 0 : 0.8, ease: EASE, delay: still ? 0 : delay };
  const wide = swing === FULL;

  return (
    <div className="relative" style={{ width: w, height: h, perspective: wide ? 2400 : 900 }}>
      {f.kind === "boxed" ? (
        <>
          {/* the volumes rise out of the box one after another */}
          {["#3c1030", "#0c0a3e", "#7b1e7a"].map((c, i) => (
            <motion.div
              key={c}
              initial={wide ? { y: "0%" } : false}
              animate={{ y: open ? `${-30 + i * 9}%` : "0%" }}
              transition={{ ...t, delay: t.delay + (still ? 0 : i * 0.08) }}
              className="absolute top-[3%] bottom-[3%]"
              style={{ left: `${6 + i * 30}%`, width: "28%" }}
            >
              <span className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(255,255,255,0.14) 0 2px, ${c} 3px, ${c} 80%, rgba(0,0,0,0.35))` }} />
              <span className="absolute inset-x-[18%] top-[8%] h-px bg-[#e0d6c2]/60" />
            </motion.div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[62%] shadow-[0_22px_34px_-22px_rgba(12,10,62,0.7)]">
            <Cloth f={f} label="Boxed set" />
          </div>
        </>
      ) : f.kind === "ebook" ? (
        <div className="absolute inset-0 rounded-[10px] bg-[#16142e] p-[7%] shadow-[0_22px_34px_-22px_rgba(12,10,62,0.7)]">
          {/* the screen: the cover, then a page once you look */}
          <div className="relative h-full w-full overflow-hidden rounded-[3px]">
            <Inside f={{ ...f, inside: "text" }} flush />
            <motion.div
              initial={wide ? { opacity: 1 } : false}
              animate={{ opacity: open ? 0 : 1 }}
              transition={t}
              className="absolute inset-0"
            >
              <Cloth f={f} label="Ebook" />
            </motion.div>
          </div>
        </div>
      ) : f.kind === "slipcase" ? (
        <>
          {/* the book slides up out of its case */}
          <motion.div
            initial={wide ? { y: "0%" } : false}
            animate={{ y: open ? "-38%" : "0%" }}
            transition={t}
            className="absolute inset-x-[5%] top-[3%] bottom-[3%]"
          >
            <Cloth f={{ ...f, cloth: "#3c1030" }} label="" />
          </motion.div>
          <div className="absolute inset-0 shadow-[0_22px_34px_-22px_rgba(12,10,62,0.7)]">
            <Cloth f={f} label="Slipcase" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 shadow-[0_22px_34px_-22px_rgba(12,10,62,0.7)]">
            <Inside f={f} flush={wide} />
          </div>
          <motion.div
            initial={wide ? { rotateY: 0 } : false}
            animate={{ rotateY: open ? swing : 0 }}
            transition={t}
            className="absolute inset-0"
            style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          >
            <Cloth f={f} label={f.name} hideLabel={open} />
            {/* the inside of the cover: endpaper, which carries the dedication once it is opened right out */}
            <span
              className="absolute inset-0 flex items-center justify-center px-[14%] text-center"
              style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "#e9e2d3" }}
            >
              {wide && f.inside === "photo" && (
                <span className="absolute inset-0">
                  <Spread f={f} half="left" />
                </span>
              )}
              {wide && f.inside !== "photo" && (
                <span className="display text-[max(11px,calc(11px*var(--fmt-scale)))] leading-[1.35] text-ink/60 italic">
                  For Ma, who kept every letter.
                </span>
              )}
            </span>
          </motion.div>
        </>
      )}
    </div>
  );
}

/** Two tidy lines, size then pages, instead of wherever a column happens to break. */
function Spec({ f, className = "" }: { f: Format; className?: string }) {
  return (
    <p className={className}>
      {f.spec.split(" · ").map((part, _, parts) => (
        <span key={part} className={`block ${parts.length > 1 ? "whitespace-nowrap" : ""}`}>
          {part}
        </span>
      ))}
    </p>
  );
}

/**
 * One format as an object on the table. Pointing at it peeks inside; clicking or tapping it
 * opens the enlarged view.
 */
function Item({ f, peek, onPeek, onOpen }: { f: Format; peek: boolean; onPeek: () => void; onOpen: (el: HTMLElement) => void }) {
  const w = `calc(${f.w}px * var(--fmt-scale))`;
  return (
    <li className="w-[max(var(--bw),132px)] shrink-0 snap-center xl:w-auto" style={{ ["--bw" as string]: w }}>
      <button
        type="button"
        data-format={f.id}
        onClick={(e) => {
          e.currentTarget.closest("li")?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
          onOpen(e.currentTarget);
        }}
        onMouseEnter={onPeek}
        onFocus={onPeek}
        aria-haspopup="dialog"
        aria-label={`${f.name}, ${f.spec}. Open a larger view`}
        className="group block cursor-pointer text-left"
      >
        <div className="flex items-end" style={{ height: `calc(${TALLEST + 24}px * var(--fmt-scale))` }}>
          <Drawing f={f} open={peek} swing={PEEK} />
        </div>
        <div className="mt-2 h-[3px] bg-ink/80" style={{ width: w }} />
        <p
          className={`display mt-4 min-h-[2.3em] text-[19px] leading-[1.15] transition-colors md:text-[21px] ${
            /* a short name never breaks: "Keepsake / zine" left one word alone under a small book */
            f.name.length <= 13 ? "whitespace-nowrap" : ""
          } ${peek ? "text-magenta" : "text-ink group-hover:text-magenta"}`}
        >
          {f.name}
        </p>
        <Spec f={f} className="mt-1.5 text-[12px] leading-[1.45] text-muted-ink" />
      </button>
    </li>
  );
}

function useViewport() {
  const read = () =>
    typeof window === "undefined" ? { w: 1440, h: 900 } : { w: window.innerWidth, h: window.innerHeight };
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const on = () => setVp(read());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

/**
 * A format, large, in front of the page: the object opens fully, with what it is for underneath.
 * Same contract as the shelf's open book: portal to <body>, the page behind made inert, Escape
 * and the arrow keys, focus handed back to the tile that opened it.
 */
function Enlarged({ f, onClose, onStep }: { f: Format; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const vp = useViewport();
  const still = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const cb = useRef({ onClose, onStep });
  cb.current = { onClose, onStep };
  // the format on show, so closing returns focus to its tile even after stepping through others
  const current = useRef(f.id);
  current.current = f.id;
  const i = FORMATS.findIndex((x) => x.id === f.id);
  const prev = FORMATS[(i - 1 + FORMATS.length) % FORMATS.length];
  const next = FORMATS[(i + 1) % FORMATS.length];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") cb.current.onClose();
      if (e.key === "ArrowRight") cb.current.onStep(1);
      if (e.key === "ArrowLeft") cb.current.onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      root?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (document.querySelector<HTMLElement>(`[data-format="${current.current}"]`) ?? opener)?.focus();
    };
  }, []);

  // One scale for the object: as large as the screen allows, leaving room for the words below.
  // A hinged cover opens out to the left of its spine, so it needs about twice its width.
  const span = hinged(f) ? 1.95 : 1;
  // a case or a box lifts its books out above itself, so leave that much headroom
  const rise = f.kind === "boxed" || f.kind === "slipcase" ? 0.4 : 0;
  const scale = Math.max(0.5, Math.min((vp.h - (vp.w >= 768 ? 330 : 300)) / (f.h * (1 + rise)), (vp.w - 56) / (f.w * span), 1.7));
  const short = vp.h < 620;
  const control = "px-2 py-2 text-[12px] tracking-[0.08em] text-paper/95 uppercase transition-colors hover:text-magenta-soft";

  return createPortal(
    <motion.div
      className={`books-scope fixed inset-0 z-[80] flex flex-col items-center overflow-y-auto px-6 ${short ? "justify-start py-16" : "justify-center"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: still ? 0 : 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="format-title"
      aria-describedby="format-use"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-ink-deep/90 backdrop-blur-[6px]"
      />
      <p className="sr-only" aria-live="polite">
        {f.name}
      </p>

      <motion.div
        key={f.id}
        className="relative flex flex-col items-center"
        initial={{ y: 40, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: still ? 0 : 0.5, ease: EASE }}
      >
        {/* the object; a hinged book sits right of centre so its opened cover lands on the left */}
        <div
          style={
            {
              ["--fmt-scale" as string]: scale,
              paddingLeft: hinged(f) ? `calc(${f.w}px * var(--fmt-scale) * 0.95)` : 0,
              paddingTop: f.h * scale * rise,
            } as CSSProperties
          }
        >
          <Drawing f={f} open swing={FULL} delay={0.25} />
        </div>

        <div className="mt-8 max-w-[34rem] text-center text-paper">
          <h2 id="format-title" className="display text-[30px] leading-[1.1] md:text-[38px]">
            {f.name}
          </h2>
          <Spec f={f} className="mt-2 text-[13px] leading-[1.5] text-paper/60 [&>span]:inline [&>span+span]:before:content-['_·_']" />
          <p id="format-use" className="mt-4 text-[16px] leading-[1.6] text-paper/85">
            {f.use}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-8 whitespace-nowrap">
          <button type="button" onClick={() => onStep(-1)} aria-label={`Previous format: ${prev.name}`} className={control}>
            &larr; {vp.w >= 768 ? prev.name : "Previous"}
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label={`Next format: ${next.name}`} className={control}>
            {vp.w >= 768 ? next.name : "Next"} &rarr;
          </button>
        </div>
      </motion.div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className={`absolute top-3 right-3 flex items-center gap-2 md:top-6 md:right-8 ${control}`}
      >
        Close
        <span aria-hidden className="text-[18px] leading-none">&times;</span>
      </button>
    </motion.div>,
    document.body,
  );
}

export function Formats() {
  const [peek, setPeek] = useState("hardcover");
  const [shown, setShown] = useState<string | null>(null);
  const format = FORMATS.find((f) => f.id === shown);
  const step = (d: 1 | -1) =>
    setShown((cur) => {
      const i = FORMATS.findIndex((f) => f.id === cur);
      return FORMATS[(i + d + FORMATS.length) % FORMATS.length].id;
    });

  return (
    <section id="formats" className="scroll-mt-[84px] bg-paper [--fmt-scale:0.72] md:[--fmt-scale:0.8] xl:[--fmt-scale:0.66]">
      <Wrap className="py-20 md:py-28">
        <Head label="Formats" title="The shape it takes." />
        <Reveal>
          {/* a table of books at their real relative sizes; scrolls sideways where the screen is narrow */}
          <ul
            className="-mx-6 mt-12 flex snap-x items-start gap-8 overflow-x-auto px-6 pb-4 md:-mx-10 md:gap-10 md:px-10 xl:mx-0 xl:grid xl:gap-6 xl:overflow-visible xl:px-0 xl:[grid-template-columns:var(--cols)]"
            style={{ ["--cols" as string]: FORMATS.map((f) => `minmax(min-content,${Math.max(f.w, 150)}fr)`).join(" ") }}
          >
            {FORMATS.map((f) => (
              <Item
                key={f.id}
                f={f}
                peek={peek === f.id}
                onPeek={() => setPeek(f.id)}
                onOpen={() => {
                  setPeek(f.id);
                  setShown(f.id);
                }}
              />
            ))}
          </ul>
        </Reveal>
      </Wrap>

      <AnimatePresence>{format && <Enlarged key="enlarged" f={format} onClose={() => setShown(null)} onStep={step} />}</AnimatePresence>
    </section>
  );
}

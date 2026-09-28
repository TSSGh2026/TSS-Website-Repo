import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BOOKS, GROUP_LABEL, type Book } from "./content";
import { EASE, startWith } from "./site";

/** Cover width as a share of the book's height (a 7:10 trim). */
const COVER = 0.7;

/** Viewport size, kept live. Only the opened book reads it; the shelf is sized in CSS. */
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
 * A book standing on the shelf, built as a real object: a spine face and a front cover face.
 * Hover and it turns a little towards you. Pick it and it lifts off the shelf, and opens in front of the page.
 *
 * Every size here is the book at full size. The shelf is scaled as a whole by CSS `zoom`
 * (see .books-shelf in styles/books.css), not by a number measured in JavaScript, because
 * the page is prerendered at 1440×900: a measured scale would paint a desktop-sized shelf
 * on a phone until React arrived.
 */
function ShelfBook({
  book,
  out,
  onOpen,
  gapBefore = 0,
}: {
  gapBefore?: number;
  book: Book;
  out: boolean;
  onOpen: () => void;
}) {
  const still = useReducedMotion();
  const [hover, setHover] = useState(false);
  const w = book.w; // spine width = the book's thickness
  const h = book.h;
  const c = book.h * COVER; // cover width

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-haspopup="dialog"
      aria-label={`Open ${book.name}`}
      className="relative block shrink-0 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta"
      style={{ width: w, height: h, marginLeft: gapBefore, transformStyle: "preserve-3d" }}
    >
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-1/2 block"
        style={{ width: c, height: h, marginLeft: -c / 2, transformStyle: "preserve-3d" }}
        initial={false}
        animate={{
          rotateY: hover && !out ? 80 : 90,
          y: out ? -h * 0.18 : hover ? -14 : 0,
          opacity: out ? 0 : 1,
        }}
        transition={{ duration: still ? 0 : 0.45, ease: EASE }}
      >
        {/* front cover, seen edge-on until the book turns */}
        <span
          className="absolute inset-0"
          style={{
            transform: `translateZ(${w / 2}px)`,
            backfaceVisibility: "hidden",
            background: `linear-gradient(90deg, rgba(0,0,0,0.32) 0 3%, transparent 4.5%), ${book.cloth}`,
          }}
        />
        {/* spine */}
        <span
          className="absolute top-0 flex items-end justify-center overflow-hidden"
          style={{
            width: w,
            height: h,
            left: (c - w) / 2,
            transform: `rotateY(-90deg) translateZ(${c / 2}px)`,
            backfaceVisibility: "hidden",
            // opaque shades of the cloth: a translucent black here would let the page show through as grey
            background: `linear-gradient(90deg, color-mix(in srgb, ${book.cloth}, white 16%) 0 2px, ${book.cloth} 4px, ${book.cloth} 82%, color-mix(in srgb, ${book.cloth}, black 28%) 94%, color-mix(in srgb, ${book.cloth}, black 45%) 100%)`,
            boxShadow: hover ? `inset 0 0 0 1.5px ${book.band}88` : "none",
          }}
        >
          <span className="absolute inset-x-[14%] top-[10px] h-[1.5px]" style={{ background: book.band, opacity: hover ? 0.95 : 0.55 }} />
          <span className="absolute inset-x-[14%] top-[16px] h-px" style={{ background: book.band, opacity: 0.3 }} />
          <span className="absolute inset-x-[14%] bottom-[12px] h-px" style={{ background: book.band, opacity: 0.3 }} />
          <span
            className="absolute inset-0 opacity-[0.18]"
            style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.11) 0 1px, transparent 1px 3px)" }}
          />
          <span
            className="kicker books-spine-type relative rotate-180 leading-none"
            style={{
              writingMode: "vertical-rl",
              letterSpacing: "0.16em",
              marginBottom: 26,
              color: hover ? "#f4f1ea" : "rgba(244,241,234,0.74)",
            }}
          >
            {book.spine}
          </span>
        </span>
      </motion.span>
    </button>
  );
}

/** The cloth of a closed cover: the book's name, as it would be foiled. */
function CoverFace({ book, scale }: { book: Book; scale: number }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden px-[10%] py-[14%] text-center"
      style={{
        backfaceVisibility: "hidden",
        background: `linear-gradient(90deg, rgba(0,0,0,0.34) 0 3%, rgba(255,255,255,0.1) 3% 3.5%, transparent 4.5%), ${book.cloth}`,
      }}
    >
      <span
        className="absolute inset-0 opacity-[0.16]"
        style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 3px)" }}
      />
      <span className="absolute inset-[6%] border" style={{ borderColor: `${book.band}66` }} />
      <span className="relative h-px w-[18%]" style={{ background: book.band, opacity: 0.5 }} />
      <span className="display relative leading-[1.05] text-[#f4f1ea] italic" style={{ fontSize: 34 * scale }}>
        {book.name}
      </span>
      <span className="relative h-px w-[30%]" style={{ background: book.band, opacity: 0.7 }} />
    </div>
  );
}

/** What the book is: its name, who it belongs to, and the one line it says. The left-hand page. */
function TitlePage({ book }: { book: Book }) {
  return (
    <>
      <p className="kicker text-[10px] text-magenta">{GROUP_LABEL[book.group]}</p>
      <p className="display mt-4 text-[17px] text-muted-ink italic">{book.name}</p>
      <h2 id="book-title" className="display mt-2 text-[27px] leading-[1.1] text-ink md:text-[30px]" style={{ textWrap: "balance" }}>
        {book.statement}
      </h2>
    </>
  );
}

/** Everything about the book, and the way to ask for it. The right-hand page. */
function DetailPage({ book, onAsk, small }: { book: Book; onAsk: () => void; small: boolean }) {
  return (
    <>
      <dl id="book-details" className={`${small ? "space-y-2.5 text-[13px]" : "space-y-3.5 text-[14px]"} leading-[1.5]`}>
        {[
          ["Who it is for", book.forWho],
          ["What we do", book.how],
          ["What you get", book.get],
          ["Format", book.format],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="kicker text-[9px] text-muted-ink">{k}</dt>
            <dd className="mt-1 text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={onAsk}
        className={`group ${small ? "mt-4" : "mt-6"} inline-flex items-center gap-3 bg-ink px-5 py-3 text-[11px] font-medium tracking-[0.06em] text-paper uppercase transition-colors duration-300 hover:bg-magenta`}
      >
        Talk to us about this book
        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </button>
    </>
  );
}

const PAPER = "linear-gradient(90deg, rgba(12,10,62,0.09), transparent 7%), #fbf8f1";
const PAPER_LEFT = "linear-gradient(270deg, rgba(12,10,62,0.1), transparent 8%), #fbf8f1";

/**
 * The picked book, lifted off the shelf and opened in front of the page.
 * Wide screens: the cover swings over to the left and becomes the title page, the details are on the right.
 * Phones: one page, the cover swings away.
 * Rendered into <body> so everything behind it (#root) can be made inert while it is open.
 */
function OpenBook({
  book,
  vp,
  onClose,
  onStep,
}: {
  book: Book;
  vp: { w: number; h: number };
  onClose: () => void;
  onStep: (d: 1 | -1) => void;
}) {
  const still = useReducedMotion();
  const wide = vp.w >= 768;
  const board = wide ? 9 : 6; // the cloth that shows around the pages of a hardcover
  const pageW = wide ? Math.min(vp.w >= 1280 ? 430 : 400, (vp.w - 140) / 2) : Math.min(360, vp.w - 44);
  const pageH = wide ? Math.min(pageW * 1.42, vp.h - 170) : Math.min(640, vp.h - 130);
  const small = pageH < 560;
  const closeRef = useRef<HTMLButtonElement>(null);
  const i = BOOKS.findIndex((b) => b.id === book.id);
  const prev = BOOKS[(i - 1 + BOOKS.length) % BOOKS.length];
  const next = BOOKS[(i + 1) % BOOKS.length];

  // latest callbacks, so the setup below runs once per opening, not on every render
  const cb = useRef({ onClose, onStep });
  cb.current = { onClose, onStep };

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    // everything behind the book goes inert: Tab cannot wander into the page
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
      // hand focus back to the book that was taken off the shelf
      opener?.focus();
    };
  }, []);

  const ask = () => {
    onClose();
    // travel to the form once the book has closed and the page is scrollable again
    window.setTimeout(() => startWith(book.id, book.ask), still ? 30 : 380);
  };

  const t = (delay = 0) => ({ duration: still ? 0 : 0.8, ease: EASE, delay: still ? 0 : delay });
  const control = "px-2 py-2 text-[12px] tracking-[0.08em] text-paper/95 uppercase transition-colors hover:text-magenta-soft";

  return createPortal(
    <motion.div
      className="books-scope fixed inset-0 z-[80] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: still ? 0 : 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-title"
      aria-describedby="book-details"
    >
      {/* the page behind, dimmed; clicking it puts the book back */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-deep/70 backdrop-blur-[3px]"
      />
      <p className="sr-only" aria-live="polite">
        {book.name}
      </p>

      <motion.div
        key={book.id}
        className="relative"
        style={{ width: wide ? pageW * 2 : pageW, height: pageH }}
        initial={{ y: 60, scale: 0.9, x: wide ? -pageW / 2 : 0 }}
        animate={{ y: 0, scale: 1, x: 0 }}
        transition={t()}
      >
        {/* the back board, in the book's cloth, showing around the pages */}
        <div
          className="absolute shadow-[0_40px_80px_-30px_rgba(6,4,26,0.8)]"
          style={{
            left: wide ? pageW : -board,
            top: -board,
            width: wide ? pageW + board : pageW + board * 2,
            height: pageH + board * 2,
            background: book.cloth,
          }}
        />
        {/* right-hand page: always there, under the cover */}
        <div
          className="absolute top-0 flex flex-col overflow-y-auto"
          style={{ left: wide ? pageW : 0, width: pageW, height: pageH, background: PAPER, padding: wide ? "9% 9% 9% 10%" : "26px 22px" }}
        >
          {!wide && (
            <div className="mb-5 border-b border-edge pb-5">
              <TitlePage book={book} />
            </div>
          )}
          <div className={wide ? "my-auto" : ""}>
            <DetailPage book={book} onAsk={ask} small={small} />
          </div>
        </div>

        {/* the cover, hinged on the spine; its own perspective, set at the spine, keeps the swing inside the book's height */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: wide ? pageW : 0,
            top: -board,
            width: pageW + board,
            height: pageH + board * 2,
            perspective: 4200,
            perspectiveOrigin: "0% 50%",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -180, opacity: wide ? 1 : [1, 1, 0] }}
            transition={t(0.35)}
          >
            <CoverFace book={book} scale={pageW / 380} />
            {/* the inside of the cover is the title page */}
            <div
              className="pointer-events-auto absolute inset-0"
              style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: book.cloth }}
            >
              {/* the endpaper, pasted inside the board. Cloth shows on the three outer edges. */}
              <div
                className="absolute flex flex-col justify-end"
                style={{ top: board, left: board, right: 0, bottom: board, background: PAPER_LEFT, padding: "13% 13% 22%" }}
              >
                {wide && <TitlePage book={book} />}
              </div>
            </div>
          </motion.div>
        </div>

        {/* previous and next sit just under the book */}
        <div
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 whitespace-nowrap"
          style={{ top: pageH + board + (wide ? 18 : 12) }}
        >
          <button type="button" onClick={() => onStep(-1)} aria-label={`Previous book: ${prev.name}`} className={control}>
            &larr; {wide ? prev.name : "Previous"}
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label={`Next book: ${next.name}`} className={control}>
            {wide ? next.name : "Next"} &rarr;
          </button>
        </div>
      </motion.div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className={`absolute top-3 right-3 flex items-center gap-2 md:top-6 md:right-8 ${control}`}
      >
        Put it back
        <span aria-hidden className="text-[18px] leading-none">&times;</span>
      </button>
    </motion.div>,
    document.body,
  );
}

export function Hero() {
  const [open, setOpen] = useState<string | null>(null);
  const vp = useViewport();
  const book = BOOKS.find((b) => b.id === open);

  const close = () => setOpen(null);
  const step = (d: 1 | -1) =>
    setOpen((cur) => {
      const i = BOOKS.findIndex((b) => b.id === cur);
      return BOOKS[(i + d + BOOKS.length) % BOOKS.length].id;
    });

  // the plank's group labels sit under their own books
  const span = (g: Book["group"]) => BOOKS.filter((b) => b.group === g).reduce((s, b) => s + b.w, 0);
  // the shelf's full-size width, from the books themselves: spines, the 2px gaps, the gap between
  // the two groups and the plank's overhang. A constant, so it is right in the prerendered HTML too.
  const shelfW = BOOKS.reduce((s, b) => s + b.w, 0) + 2 * (BOOKS.length - 1) + 20 + 44;

  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-10 pb-16 md:px-10 md:pt-12 md:pb-20">
        <div className="text-center">
          <h1
            className="display mx-auto max-w-[22ch] text-[38px] leading-[1.04] md:text-[62px]"
            style={{ textWrap: "balance" }}
          >
            <span className="block">You bring the memories.</span>{" "}
            <span className="block">
              We find the <em className="font-display font-bold italic text-magenta">story</em>.
            </span>
          </h1>
          <p
            className="mx-auto mt-5 max-w-[62ch] text-[16px] leading-[1.65] text-muted-ink md:mt-6 md:text-[18px]"
            style={{ textWrap: "pretty" }}
          >
            At The Story Shapers, we help people tell stories. Through conversations, memories, photographs, letters,
            research and a lot of questions, we turn the material of a life into a book that sounds and feels like the
            person who lived it.
          </p>
          <div className="mt-8 flex justify-center md:mt-9">
            <a
              href="#start"
              className="inline-flex items-center bg-ink px-8 py-4 text-[14px] font-medium tracking-[0.08em] text-paper uppercase transition-colors duration-300 hover:bg-magenta"
            >
              Start a conversation
            </a>
          </div>
        </div>

        {/* the shelf: nothing but books, until you pick one */}
        <div id="books" className="mt-12 flex scroll-mt-24 flex-col items-center md:mt-10">
          <div className="books-shelf-wrap" style={{ width: `calc(${shelfW}px * var(--z))` }}>
            <div className="books-shelf" style={{ width: shelfW }}>
              <div className="flex items-end" style={{ perspective: 1600, perspectiveOrigin: "50% 30%", gap: 2, paddingInline: 22 }}>
                {BOOKS.map((b, i) => (
                  <ShelfBook
                    gapBefore={i > 0 && BOOKS[i - 1].group !== b.group ? 20 : 0}
                    key={b.id}
                    book={b}
                    out={open === b.id}
                    onOpen={() => setOpen(b.id)}
                  />
                ))}
              </div>
              {/* the shelf board */}
              <div className="h-[3px] w-full bg-ink/85" />
              <div className="mx-auto h-[11px] w-[97%]" style={{ background: "linear-gradient(180deg, #0c0a3e, #06041a)" }} />
            </div>
            <div
              className="mt-3 grid text-center"
              style={{
                gridTemplateColumns: `${span("people")}fr ${span("business")}fr`,
                paddingInline: "calc(22px * var(--z))",
                columnGap: "calc(20px * var(--z))",
              }}
            >
              {(["people", "business"] as const).map((g) => (
                <div key={g}>
                  {/* a hairline bracket under each group's books */}
                  <div className="h-[6px] border-x border-b border-magenta/35" />
                  <p className="kicker mt-2 text-[9px] leading-[1.5] text-magenta tracking-[0.08em] [text-wrap:balance] sm:text-[10px] sm:whitespace-nowrap sm:tracking-[0.14em]">
                    {GROUP_LABEL[g]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-[14px] text-muted-ink italic">Take a book off the shelf to look inside.</p>
        </div>
      </div>

      <AnimatePresence>
        {book && <OpenBook key="open" book={book} vp={vp} onClose={close} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}

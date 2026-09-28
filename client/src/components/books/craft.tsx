import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PROCESS, PROCESS_INTRO } from "./content";
import { Body, H2, Kicker, Reveal, useSlot, Wrap } from "./site";

/** Where each print starts on the table, and where it lands on the spread. All in % of the stage. */
type Box = { l: number; t: number; w: number; h: number; r: number };

/** One family's material only, and only things that look like an archive: no modern photographs. */
const PRINTS: Array<{ src: string; alt: string; from: Box; to: Box }> = [
  {
    src: "/images/books/hero-archive.webp",
    alt: "Family photographs, letters and a diary spread on a table",
    from: { l: 3, t: 34, w: 38, h: 40, r: -8 },
    to: { l: 8, t: 11, w: 38, h: 62, r: 0 },
  },
  {
    src: "/images/books/portrait-hands.webp",
    alt: "Hands holding an old photograph",
    from: { l: 44, t: 4, w: 30, h: 36, r: 6 },
    to: { l: 54, t: 11, w: 38, h: 30, r: 0 },
  },
  {
    src: "/images/books/letters.webp",
    alt: "A bundle of handwritten letters",
    from: { l: 58, t: 52, w: 36, h: 32, r: 9 },
    to: { l: 54, t: 72, w: 38, h: 16, r: 0 },
  },
];

const lerp = (a: number, b: number, v: number) => a + (b - a) * v;

/** A print travels from the table to its place on the page. */
function Print({ p, done }: { p: (typeof PRINTS)[number]; done: MotionValue<number> }) {
  const left = useTransform(done, (v) => `${lerp(p.from.l, p.to.l, v)}%`);
  const top = useTransform(done, (v) => `${lerp(p.from.t, p.to.t, v)}%`);
  const width = useTransform(done, (v) => `${lerp(p.from.w, p.to.w, v)}%`);
  const height = useTransform(done, (v) => `${lerp(p.from.h, p.to.h, v)}%`);
  const rotate = useTransform(done, (v) => lerp(p.from.r, p.to.r, v));
  const border = useTransform(done, [0, 1], [6, 0]);
  const shadow = useTransform(done, [0, 1], ["0 18px 30px -16px rgba(12,10,62,0.45)", "0 0 0 0 rgba(12,10,62,0)"]);
  return (
    <motion.div className="absolute bg-white" style={{ left, top, width, height, rotate, padding: border, boxShadow: shadow }}>
      <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
    </motion.div>
  );
}

/** The table becomes the book. `done` runs 0 (scattered prints) to 1 (a typeset spread). */
function Stage({ done }: { done: MotionValue<number> }) {
  const pages = useTransform(done, [0.3, 0.7], [0, 1]);
  const words = useTransform(done, [0.7, 1], [0, 1]);
  // the two captions hand over at the midpoint, so one of them is always showing
  const before = useTransform(done, [0.42, 0.5], [1, 0]);
  const after = useTransform(done, [0.5, 0.58], [0, 1]);

  return (
    <div className="relative [container-type:inline-size]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
        <motion.div
          style={{ opacity: pages }}
          className="absolute top-[6%] right-[4%] bottom-[6%] left-[4%] grid grid-cols-2 gap-px bg-edge shadow-[0_30px_60px_-30px_rgba(12,10,62,0.45)]"
        >
          <div className="bg-white" />
          <div className="bg-white" />
        </motion.div>

        {/* left page caption */}
        <motion.p
          style={{ opacity: words }}
          className="absolute top-[76%] left-[8%] w-[38%] font-sans text-[1.9cqw] leading-[1.4] text-muted-ink italic"
        >
          The family trunk: letters, a diary, and the key to the old house.
        </motion.p>

        {/* right page: a chapter opening, set in the book face */}
        <motion.div style={{ opacity: words }} className="absolute top-[45%] left-[54%] w-[38%]">
          <p className="kicker text-[1.5cqw] tracking-[0.16em] text-magenta">Chapter four</p>
          <p className="display mt-[0.8cqw] text-[3.4cqw] leading-[1.08] text-ink">The letters from the shipyard</p>
          <p className="mt-[1cqw] font-display text-[1.9cqw] leading-[1.45] text-ink/75">
            Ma kept every one of them in a biscuit tin under the bed.
          </p>
        </motion.div>

        {PRINTS.map((p) => (
          <Print key={p.src} p={p} done={done} />
        ))}
      </div>
      <div className="relative mt-3 h-4">
        <motion.p style={{ opacity: before }} className="kicker absolute inset-0 text-[10px] text-muted-ink">
          One family's archive, as it arrived
        </motion.p>
        <motion.p style={{ opacity: after }} className="kicker absolute inset-0 text-[10px] text-magenta">
          Sample layout
        </motion.p>
      </div>
    </div>
  );
}

function Step({ c, i, p }: { c: (typeof PROCESS)[number]; i: number; p: MotionValue<number> }) {
  const on = useSlot(p, i, PROCESS.length, 0.02);
  const opacity = useTransform(on, [0, 1], [0.86, 1]);
  const bar = useTransform(on, [0, 1], [0, 1]);
  return (
    <motion.li style={{ opacity }} className="relative border-t border-edge py-6 pl-6 lg:flex lg:min-h-[26vh] lg:flex-col lg:justify-center">
      <motion.span aria-hidden style={{ scaleY: bar }} className="absolute top-0 bottom-0 left-0 w-[2px] origin-top bg-magenta" />
      <h3 className="display text-[24px] leading-[1.12] md:text-[28px]">{c.t}</h3>
      <p className="measure mt-2 text-[15px] leading-[1.6] text-muted-ink md:text-[16px]">{c.d}</p>
    </motion.li>
  );
}

/** How we make a book. The steps scroll; the archive beside them becomes a book as you read. */
export function Craft() {
  const listRef = useRef<HTMLUListElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const moving = useTransform(scrollYProgress, [0.12, 0.85], [0, 1]);
  const finished = useTransform(scrollYProgress, () => 1);

  return (
    <section id="process" className="scroll-mt-[84px] border-y border-edge bg-paper-2">
      <Wrap className="py-20 md:py-28">
        <Reveal>
          <Kicker>How we work</Kicker>
          <H2 className="mt-5 max-w-[20ch]">From the first conversation to the finished book.</H2>
          <Body className="mt-6">{PROCESS_INTRO}</Body>
        </Reveal>

        <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* the stage: pinned above the list on phones, beside it on desktop */}
          <div className="sticky top-[80px] md:top-[84px] z-10 -mx-6 bg-paper-2 px-6 pt-3 pb-4 lg:order-2 lg:top-[120px] lg:mx-0 lg:self-start lg:px-0 lg:pt-0">
            <Stage done={still ? finished : moving} />
          </div>
          <ul ref={listRef} className="lg:order-1">
            {PROCESS.map((c, i) => (
              <Step key={c.t} c={c} i={i} p={scrollYProgress} />
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}

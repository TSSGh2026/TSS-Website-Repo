import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FORMATS, type Format } from "./content";
import { EASE, Head, Reveal, Wrap } from "./site";

const TALLEST = Math.max(...FORMATS.map((f) => f.h));
/** How far an open cover swings, hinged on its spine: enough to see the page, never onto a neighbour. */
const SWING = -72;

/** What you see under the cover: a text page, a photo page, or a zine's big type. */
function Inside({ f, flush = false }: { f: Format; flush?: boolean }) {
  if (f.inside === "photo") {
    return (
      <div className="flex h-full flex-col bg-white py-[8%] pr-[8%] pl-[36%]">
        <img src="/images/books/album-together.webp" alt="" loading="lazy" className="h-[68%] w-full object-cover" />
        <div className="mt-[8%] h-[3px] w-[55%] bg-ink/60" />
        <div className="mt-[5%] h-[2px] w-[80%] bg-ink/15" />
      </div>
    );
  }
  if (f.inside === "zine") {
    return (
      <div className="flex h-full flex-col justify-center bg-[#fbf8f1] py-[12%] pr-[10%] pl-[38%]">
        <p className="display text-[calc(11px*var(--fmt-scale))] leading-[1.15] text-magenta italic">
          &ldquo;We moved with two suitcases and a pressure cooker.&rdquo;
        </p>
        <div className="mt-[10%] h-[2px] w-[40%] bg-ink/25" />
      </div>
    );
  }
  return (
    <div className={`flex h-full flex-col bg-[#fbf8f1] py-[12%] pr-[10%] ${flush ? "pl-[10%]" : "pl-[38%]"}`}>
      <p className="kicker text-[calc(6px*var(--fmt-scale))] tracking-[0.16em] text-magenta">Chapter one</p>
      <div className="mt-[8%] h-[4px] w-[70%] bg-ink/70" />
      <div className="mt-[10%] space-y-[6%]">
        {[92, 86, 95, 80, 90, 70, 88, 94, 60].map((w, i) => (
          <div key={i} className="h-[2px] bg-ink/20" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
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

/** One format as an object on the table. Open: the cover swings back on its spine to show the page. */
function Item({ f, open, onOpen }: { f: Format; open: boolean; onOpen: () => void }) {
  const still = useReducedMotion();
  const w = `calc(${f.w}px * var(--fmt-scale))`;
  const h = `calc(${f.h}px * var(--fmt-scale))`;
  const t = { duration: still ? 0 : 0.7, ease: EASE };

  return (
    <li className="w-[max(var(--bw),132px)] shrink-0 snap-center xl:w-auto" style={{ ["--bw" as string]: w }}>
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={onOpen}
        onFocus={onOpen}
        aria-pressed={open}
        aria-label={`${f.name}, ${f.spec}`}
        className="group block text-left"
      >
        <div className="flex items-end" style={{ height: `calc(${TALLEST + 24}px * var(--fmt-scale))` }}>
          <div className="relative" style={{ width: w, height: h, perspective: 900 }}>
            {f.kind === "boxed" ? (
              <>
                {/* the volumes rise out of the box one after another */}
                {["#3c1030", "#0c0a3e", "#7b1e7a"].map((c, i) => (
                  <motion.div
                    key={c}
                    initial={false}
                    animate={{ y: open ? `${-30 + i * 9}%` : "0%" }}
                    transition={{ ...t, delay: still ? 0 : i * 0.08 }}
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
                  <motion.div initial={false} animate={{ opacity: open ? 0 : 1 }} transition={t} className="absolute inset-0">
                    <Cloth f={f} label="Ebook" />
                  </motion.div>
                </div>
              </div>
            ) : f.kind === "slipcase" ? (
              <>
                {/* the book slides up out of its case */}
                <motion.div
                  initial={false}
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
                  <Inside f={f} />
                </div>
                <motion.div
                  initial={false}
                  animate={{ rotateY: open ? SWING : 0 }}
                  transition={t}
                  className="absolute inset-0"
                  style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                >
                  <Cloth f={f} label={f.name} hideLabel={open} />
                  {/* the inside of the cover: endpaper */}
                  <span
                    className="absolute inset-0"
                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "#e9e2d3" }}
                  />
                </motion.div>
              </>
            )}
          </div>
        </div>
        <div className="mt-2 h-[3px] bg-ink/80" style={{ width: w }} />
        <p
          className={`display mt-4 min-h-[2.3em] text-[19px] leading-[1.15] transition-colors md:text-[21px] ${
            /* a short name never breaks: "Keepsake / zine" left one word alone under a small book */
            f.name.length <= 13 ? "whitespace-nowrap" : ""
          } ${
            open ? "text-magenta" : "text-ink group-hover:text-magenta"
          }`}
        >
          {f.name}
        </p>
        <p className="mt-1.5 text-[12px] leading-[1.45] text-muted-ink">
          {/* size, then pages: two tidy lines instead of wherever the column happens to break */}
          {f.spec.split(" · ").map((part, _, parts) => (
            <span key={part} className={`block ${parts.length > 1 ? "whitespace-nowrap" : ""}`}>
              {part}
            </span>
          ))}
        </p>
      </button>
    </li>
  );
}

export function Formats() {
  const [open, setOpen] = useState("hardcover");
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
              <Item key={f.id} f={f} open={open === f.id} onOpen={() => setOpen(f.id)} />
            ))}
          </ul>
        </Reveal>
      </Wrap>
    </section>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQS, type Faq as FaqItem } from "./content";
import { EASE, H2, Kicker, Reveal, whatsappFor, Wrap } from "./site";

function Row({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-edge">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-6 py-5 text-left"
      >
        <span
          className={`display text-[19px] leading-[1.25] transition-colors md:text-[22px] ${
            open ? "text-magenta" : "text-ink group-hover:text-magenta"
          }`}
        >
          {item.q}
        </span>
        <span
          aria-hidden
          className={`mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[16px] leading-none transition-all duration-300 ${
            open ? "rotate-45 border-magenta text-magenta" : "border-edge text-muted-ink group-hover:border-magenta group-hover:text-magenta"
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="measure pr-10 pb-7 text-[16px] leading-[1.7] text-muted-ink">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Questions, folded: the heading stays put on the left while the list opens on the right. All start closed. */
export function Faq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="scroll-mt-[84px] border-t border-edge bg-paper">
      <Wrap className="py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Reveal className="lg:sticky lg:top-28">
              <Kicker>Questions</Kicker>
              <H2 className="mt-5">A few perfectly reasonable questions.</H2>
              <p className="mt-6 text-[16px] leading-[1.7] text-muted-ink">
                Something else on your mind?{" "}
                <a
                  href={whatsappFor(null)}
                  className="text-magenta underline decoration-magenta/40 underline-offset-[6px] transition-colors hover:decoration-magenta"
                >
                  Message us on WhatsApp
                </a>
                .
              </p>
            </Reveal>
          </div>
          <div className="border-t border-edge">
            {FAQS.map((item) => (
              <Row key={item.q} item={item} open={open === item.q} onToggle={() => setOpen(open === item.q ? null : item.q)} />
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

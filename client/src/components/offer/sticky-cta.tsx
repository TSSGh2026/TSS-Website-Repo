import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

/**
 * Mobile-only bar. Appears after the hero, hides once the form is on screen so
 * it never sits on top of the thing it points at.
 *
 * Both triggers are cheap by design. The scroll threshold reads a motion value
 * and only touches state when the boolean actually flips; the form check is an
 * IntersectionObserver. The previous version called getBoundingClientRect on
 * every scroll frame, which forces a layout on each one — the fastest way to
 * make a phone stutter on the way to the form.
 */
export function StickyCta() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  const [pastHero, setPastHero] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const pastHeroRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 560;
    if (next === pastHeroRef.current) return;
    pastHeroRef.current = next;
    setPastHero(next);
  });

  /* "change" only fires on a change, so a restored scroll position or a
     /offer#apply deep link would otherwise leave the bar hidden until the
     visitor happened to scroll. Read the position once on mount. */
  useEffect(() => {
    const next = window.scrollY > 560;
    pastHeroRef.current = next;
    setPastHero(next);
  }, []);

  useEffect(() => {
    const form = document.getElementById("apply");
    if (!form) return;
    // Bottom margin of -40% shrinks the observed area to the top 60% of the
    // viewport, matching the old `formTop > innerHeight * 0.6` threshold.
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { rootMargin: "0px 0px -40% 0px" },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !formInView;

  return (
    <motion.div
      // initial={false} so the bar never animates on load, only on threshold.
      initial={false}
      animate={{ y: visible ? "0%" : "100%" }}
      transition={
        reduced
          ? { duration: 0 }
          : // Overdamped: it must not overshoot upward, or it would open a gap
            // between the bar and the bottom of the screen.
            { type: "spring", stiffness: 320, damping: 34, mass: 0.7 }
      }
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy/95 px-4 py-3 backdrop-blur-sm md:hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10.4px] uppercase tracking-[2.08px] text-white/70">
            THE WEBSITE OFFER
          </p>
          <p className="mt-1 font-display text-[15px]">₹80,000 all in</p>
        </div>
        <a
          href="#apply"
          className="o-tap inline-flex shrink-0 items-center gap-2 rounded-lg bg-magenta px-4 py-3 text-[13px] font-medium text-white"
        >
          Apply
          <ArrowRight aria-hidden className="size-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

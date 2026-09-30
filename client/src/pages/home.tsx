import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { ProblemFraming } from "@/components/home/ProblemFraming";
import { Team } from "@/components/home/Team";
import { Work } from "@/components/home/Work";
import { Shapes } from "@/components/home/Shapes";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/layout/Footer";

/**
 * THE HOMEPAGE, AS A SCORE.
 *
 * Six acts in order, and the order is the argument:
 *
 *   the Shaping   a sentence cuts itself down to what it means
 *   the turn      the belief underneath the work, on near-black
 *   the peak      the three people, on the only light ground
 *   the work      five cases, panned sideways, with the proof in them
 *   what we do    the offer, as three stages and eighteen things
 *   the close     the page stops moving and starts responding
 *
 * Every one of them is an <Act> and publishes its own ground so the fixed nav
 * can pick its ink. Nothing here decides anything; the acts do.
 */

/**
 * Arriving at an act by name — `/#act-peak` from any other page's footer.
 *
 * Not left to the browser, and not done once. Every act is sized in `svh` and
 * set in a webfont, so the offset of the fourth one is not known until the
 * fonts have swapped in and each stage has taken its real height. A single
 * scroll on mount lands short by however much the page grew afterwards.
 *
 * So it scrolls, then scrolls again when the fonts report ready, and gives up
 * the moment the reader touches anything — a page that keeps yanking itself
 * back is worse than one that lands a few hundred pixels off.
 *
 * `#case-*` is not ours: Work.tsx opens the reader on those, and its own scroll
 * handling is what puts the rail behind it.
 */
function useActHash() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || id.startsWith("case-")) return;

    let cancelled = false;
    const stop = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    const land = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    land();
    const t = window.setTimeout(land, 120);
    document.fonts?.ready.then(() => requestAnimationFrame(land));

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);
}

export default function Home() {
  useActHash();

  return (
    <div style={{ backgroundColor: "#0C0A3E" }} className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ProblemFraming />
        {/* Origin — "What changes when we show up" — is gone, Fatema's call on
            25 Aug. It described the work rather than showing it, and it is the
            same species as every other explanatory section she cut off the
            study: the second fold, both standfirsts, the hand-off line. The
            case rail does that job now, with evidence. */}
        <Team />
        <Work />
        {/* Act five, where it has always been. The section is the same act with
            a different cut of the same offer: four disciplines rather than
            three situations, and every service named rather than eighteen of
            them. Services.tsx — Shape / Scale / Sharpen — is superseded and
            unreferenced, the way the CMS rows already are. */}
        <Shapes />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}

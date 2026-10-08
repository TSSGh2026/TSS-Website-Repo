import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CaseBody } from "./CaseBody";
import type { Case } from "@/data/cases";

const BONE = "#F4F1EA";
const NAVY = "#0C0A3E";
const ACCENT_DEEP = "#7b1e7a";

/**
 * THE CASE READER — a dialog, not a route.
 *
 * This page is one scroll score and a route would cost the reader their place
 * in it. It opens onto the bone ground: the page already uses that hard cut for
 * its human material, and several hundred words of argument read better on it
 * than on navy.
 *
 * THE THREE THINGS THAT ARE EASY TO GET WRONG HERE
 *
 * 1. Locking the page. `position: fixed` on the body collapsed scrollHeight
 *    from 12150 to 900 and scrollY to 0, so every act behind the scrim
 *    re-rendered at progress 0 and the film visible through it cut to a
 *    different scene the moment a case opened. `overflow: hidden` holds the
 *    position instead, with the scrollbar gutter reserved so the page does not
 *    jump sideways as the bar goes.
 *
 * 2. Handing focus back. `focus()` scroll-anchors the card into view and
 *    overrides the scroll restore — measured 1035px of drift on desktop and a
 *    full viewport on a phone, which lands the reader in a different act from
 *    the one they opened the case from. `preventScroll` is not optional.
 *
 * 3. Keeping focus in. Without the Tab trap, tabbing walks straight out of the
 *    dialog and into a page the reader cannot see.
 */
export function CaseReader({
  caseStudy,
  onClose,
  landOn,
}: {
  caseStudy: Case & { n: string };
  onClose: (opts?: { to?: string }) => void;
  /** An element id to land on when this closes, instead of the position the
   *  page was at when it opened. Set for a case opened cold from a shared
   *  link — see the note on goToRef. */
  landOn?: string;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Captured on mount and restored on unmount rather than read at close time:
     by the time the close handler runs the browser may already have moved it. */
  const scrollYRef = useRef(0);

  /* Where to land INSTEAD of the captured position.
     Two things set it. The link at the foot of the case, which wants to go to
     the close act rather than back to the rail — routed through the cleanup
     rather than done in the click handler because the cleanup's scrollTo runs
     last and wins, so the link's old href="#act-close" put the reader on the
     close for one frame before the restore dragged them back.
     And `landOn`, for a case opened cold from a shared link: there the captured
     position is measured before the page's images have loaded, so restoring it
     put a phone 1255px below where the work act had settled. An id resolved at
     close time is measured against the layout that actually exists by then. */
  const goToRef = useRef<string | null>(landOn ?? null);

  useEffect(() => {
    scrollYRef.current = window.scrollY;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevGutter = html.style.scrollbarGutter;
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "stable";

    panelRef.current?.focus();

    return () => {
      html.style.overflow = prevOverflow;
      html.style.scrollbarGutter = prevGutter;
      const target = goToRef.current
        ? document.getElementById(goToRef.current)
        : null;
      if (target) target.scrollIntoView({ block: "start" });
      else window.scrollTo(0, scrollYRef.current);
    };
  }, []);

  /* `closeTo` lived here — closing towards an act rather than back to the card,
     for the foot-of-the-case link that used to land on #act-close. That link
     goes to the contact form now, so nothing closes towards an act any more.
     `goToRef` is still read by the cleanup above, for `landOn`. */

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const f = root.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const c = caseStudy;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="readerTitle"
      className="fixed inset-0 z-[200]"
      data-testid="case-reader"
    >
      <div
        className="absolute inset-0 backdrop-blur-[3px] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        style={{ backgroundColor: "rgba(6,4,26,0.72)" }}
        onClick={() => onClose()}
      />

      <article
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 w-full max-w-full overflow-y-auto overscroll-contain px-[clamp(1.5rem,4vw,4rem)] pt-[clamp(2.5rem,5vw,4.5rem)] pb-[clamp(4rem,8vh,6rem)] focus:outline-none motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:duration-300 sm:w-[46rem]"
        style={{ backgroundColor: BONE, color: NAVY }}
      >
        {/* Fixed to the viewport, not floated in the text. A sticky float only
            shortens the first few line boxes, so every paragraph after them
            scrolled underneath the button — it sat on top of body copy at four
            of four sampled positions. 46px, over the 44px touch minimum. */}
        <button
          type="button"
          onClick={() => onClose()}
          aria-label="Close"
          className="fixed right-[clamp(1rem,2.4vw,1.8rem)] top-[clamp(1rem,2.4vw,1.8rem)] z-[3] grid h-[2.875rem] w-[2.875rem] place-items-center rounded-full text-[1.4rem] leading-none transition-colors duration-200 hover:bg-[rgba(12,10,62,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: BONE,
            color: NAVY,
            border: "1px solid rgba(12,10,62,0.2)",
            boxShadow: "0 2px 14px rgba(6,4,26,0.3)",
            outlineColor: ACCENT_DEEP,
          }}
          data-testid="button-close-case"
        >
          <span aria-hidden="true">×</span>
        </button>

        <CaseBody c={c} variant="dialog" />
      </article>
    </div>,
    document.body,
  );
}

import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNarrow } from "@/hooks/use-act-progress";
import { CONTACT, mailto } from "@/lib/contact";
import logoImg from "@assets/FullLogo_Transparent_NoBuffer_1772265926648.png";

/** how far down the bar the ground is sampled — inside it, not at its edge */
const PROBE = 26;
const NAVY = "#0C0A3E";
const ACCENT = "#cf81cd";

type Ground = { g: "dark" | "light"; bg: string; photo: boolean };

/**
 * WHICH GROUND IS UNDER THE BAR.
 *
 * The homepage changes ground colour underneath a fixed nav: navy, near-black,
 * bone, navy again. A bar that is white on navy disappears the moment the peak
 * pins, so it has to read what is beneath it and invert. Acts publish
 * `data-ground` and `data-bg` for exactly this (see Act.tsx).
 *
 * Returns null on any page that publishes no acts, and the bar keeps its
 * ordinary treatment there. That is deliberate rather than lazy: the scrim
 * below is painted in the CURRENT ACT'S colour, and on a page with no acts
 * there is no such colour to copy.
 *
 * THE BOX TO MEASURE IS THE STAGE, NOT THE SECTION. A pinned act's section is
 * 2.8 viewports tall but its bone stage is only ever one viewport of that — at
 * the section's tail the stage has already scrolled away and navy is showing,
 * and the bar would still be calling it bone. Where two stages overlap at a
 * seam, the LAST one in document order is the one painting on top.
 */
function useGround(pathname: string): Ground | null {
  const [ground, setGround] = useState<Ground | null>(null);
  const last = useRef<string>("");

  const paint = useCallback(() => {
    const acts = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-ground]"),
    );
    if (!acts.length) {
      last.current = "";
      setGround(null);
      return;
    }

    let g: "dark" | "light" = "dark";
    let bg = "#0C0A3E";
    for (const act of acts) {
      const box = (act.firstElementChild as HTMLElement) ?? act;
      const r = box.getBoundingClientRect();
      if (r.top <= PROBE && r.bottom > PROBE) {
        g = (act.dataset.ground as "dark" | "light") ?? "dark";
        bg = act.dataset.bg ?? "#0C0A3E";
      }
    }

    const photo = g === "light" && peakPhotoUnderBar();
    const key = `${g}|${bg}|${photo}`;
    if (key === last.current) return;
    last.current = key;
    setGround({ g, bg, photo });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [paint, pathname]);

  return ground;
}

/** how far across a wiping layer has travelled: inset(0 X% 0 0) reveals it from
 *  its left edge to (100-X)% across */
function revealedFraction(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  const m = cs.clipPath.match(/inset\([^ ]+ ([\d.]+)%/);
  if (m) return (100 - parseFloat(m[1])) / 100;
  return parseFloat(cs.opacity) > 0.5 ? 1 : 0;
}

/**
 * Is one of the peak's PHOTOGRAPHS under the bar, rather than its bone?
 *
 * The peak's light ground is bone at the intro and the convergence and a
 * full-bleed portrait in between. A navy wordmark disappears into dark hair and
 * struggles against a bright arch, so over a picture it goes back to white and
 * takes a shadow.
 *
 * Read off the DOM rather than plumbed through from Team.tsx, because the honest
 * question is not "which panel is showing" but "is there a photograph beneath
 * this pixel" — and a panel is only revealed as far as its clip has travelled,
 * so a panel showing at 12% has bone under a wordmark sitting at 5% of the
 * width and a portrait under one at 3%.
 */
function peakPhotoUnderBar(): boolean {
  const act = document.getElementById("act-peak");
  if (!act) return false;

  /* THE CONVERGENCE FIRST, AND THIS IS NOT AN OPTIMISATION.
     The peak's layers only ever RISE — a panel's clip opens and then stays
     open, and the three of them are covered by the convergence rather than
     closed. So at the end of the act all three portraits still report as fully
     revealed while what is actually on the screen is bone, and the wordmark
     spent the last quarter of the peak white-on-bone. */
  const all = act.querySelector<HTMLElement>('[data-testid="panel-shapers-all"]');
  if (all && revealedFraction(all) > 0.08) return false;

  const panels = Array.from(
    act.querySelectorAll<HTMLElement>('[data-testid^="panel-shaper-"]'),
  );

  for (const panel of panels) {
    const revealed = revealedFraction(panel);
    if (revealed <= 0) continue;

    const img = panel.querySelector("img");
    if (!img) continue;
    const r = img.getBoundingClientRect();
    if (r.top > PROBE || r.bottom <= PROBE) continue;
    /* the wordmark sits in the left gutter; if the picture reaches that far
       across and the wipe has uncovered it, there is a face under the mark */
    if (r.left <= 0.08 * window.innerWidth && revealed > 0.08) return true;
  }
  return false;
}

const LINKS = [
  { name: "Our Story", href: "/our-story" },
  { name: "Team", href: "/team" },
  { name: "Blog", href: "/blog" },
  { name: "Join the collective", href: "/join" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ground = useGround(location);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Any navigation closes it. Wouter swaps the page under a fixed overlay
     without unmounting this component, so without it the reader taps "Blog",
     the article list loads behind the menu, and the menu is still there. */
  useEffect(() => setMenuOpen(false), [location]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  const links = LINKS;

  const light = ground?.g === "light";
  const photo = ground?.photo ?? false;

  /* THE WORDMARK AND THE LINKS ARE ON DIFFERENT THINGS, and above 60rem they
     need opposite treatments. The peak's panel is a picture on the left and a
     bone column on the right, so with a portrait under the bar the mark is
     standing on a photograph and the links are standing on bone. Turning the
     whole bar white for the mark's sake made "Our Story / Team / Blog"
     invisible. Below 60rem the panel stacks and the portrait runs full width,
     so then it IS the whole bar. */
  const wide = !useNarrow(60);
  const inkOnPhoto = photo && !wide;

  /* WITH THE MENU OPEN THE GROUND IS THE MENU, not whatever act is frozen
     underneath it. The bar sits ABOVE the navy panel so the button can morph
     into its own close, which means an unforced ink would still be reading the
     peak's bone and painting a navy wordmark onto a navy sheet. */
  const ink = menuOpen || !light || inkOnPhoto ? "#FFFFFF" : "#0C0A3E";
  const onPhoto = inkOnPhoto && !menuOpen;
  const onLight = light && !menuOpen;

  return (
    <nav
      data-ground={ground?.g}
      data-peakphoto={photo ? "" : undefined}
      data-menuopen={menuOpen ? "" : undefined}
      className={cn(
        "fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-3 md:px-12 transition-colors duration-300",
        /* above the panel, not under it — see the ink note above */
        menuOpen ? "z-[210]" : "z-50",
        /* An act-scored page paints its own scrim below; anywhere else the bar
           keeps the treatment it has always had. */
        !ground &&
          (scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border py-2.5"
            : "bg-transparent border-b border-foreground/10"),
        ground && "border-b-0",
      )}
      /* The ground-less pages keep `text-foreground` from the class list — but
         an open menu overrides even there, because the navy panel is the same
         navy panel on every route. */
      style={
        ground || menuOpen
          ? {
              color: ink,
              textShadow: onPhoto ? "0 1px 6px rgba(0,0,0,0.6)" : undefined,
            }
          : undefined
      }
    >
      {/* A SCRIM, NOT A BAR, AND PAINTED IN THE GROUND'S OWN COLOUR.
          Two things have to be true at once and they pull against each other:
          copy scrolling underneath must not read through the links, and the
          strip must not look like browser chrome bolted across a poster. A
          translucent scrim cannot do both — at the alpha that actually hides a
          paragraph it is a visibly darker band, because this page has four dark
          grounds and one bone one and the scrim only ever had one colour. So it
          copies the current act's background, fills opaquely, and a mask fades
          it out 44px below the bar. Nothing to see, and nothing readable
          through it. It comes off entirely over a portrait, where all it did
          was haze the top of somebody's photograph. */}
      {ground && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[-44px] top-0 -z-10 transition-opacity duration-300"
          style={{
            backgroundColor: ground.bg,
            /* off with the menu open: the panel behind the bar is already an
               opaque sheet, and a bone scrim over it is a bright band. */
            opacity: scrolled && !photo && !menuOpen ? 1 : 0,
            WebkitMaskImage:
              "linear-gradient(#000 0%, #000 62%, rgba(0,0,0,0.5) 80%, transparent 100%)",
            maskImage:
              "linear-gradient(#000 0%, #000 62%, rgba(0,0,0,0.5) 80%, transparent 100%)",
          }}
        />
      )}

      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          setLocation("/");
          window.scrollTo(0, 0);
        }}
        className="flex items-center gap-2"
      >
        <img
          src={logoImg}
          alt="Story Shapers"
          style={{
            height: "40px",
            width: "auto",
            transition: "filter 300ms ease",
            /* A bone HALO on the light ground rather than `filter: none`. On
               bone itself the halo is invisible; over the convergence
               thumbnails — which pass directly under the bar as the peak scrolls
               out on a phone — it is the only thing keeping a navy wordmark off
               a dark portrait. Over a full-bleed photograph the mark goes back
               to white and takes a shadow instead: invisible on the dark parts
               of a picture, and the only thing holding it up on the light. */
            filter: onPhoto
              ? "invert(1) brightness(2) drop-shadow(0 1px 5px rgba(0,0,0,0.65))"
              : onLight
                ? "drop-shadow(0 0 3px rgba(244,241,234,0.95)) drop-shadow(0 1px 3px rgba(244,241,234,0.85))"
                : "invert(1) brightness(2)",
          }}
          data-testid="img-logo"
        />
      </a>

      <div className="hidden md:flex items-center gap-8">
        {links.map((link) =>
          link.href.startsWith("/") ? (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:opacity-100 opacity-80",
                !ground && "text-foreground",
              )}
              style={ground ? { color: "inherit" } : undefined}
            >
              {link.name}
            </Link>
          ) : (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:opacity-100 opacity-80",
                !ground && "text-foreground",
              )}
              style={ground ? { color: "inherit" } : undefined}
            >
              {link.name}
            </a>
          ),
        )}
      </div>

      {/* The handler this used to carry navigated to "/contact" — without the
          hash — and then tried to scroll to #talk itself on a 100ms timer. It
          dropped the reader at the top of the page, on the job-application
          form, because losing the hash also let the router's scroll-to-top run.
          The contact page lands its own hash now, so the link is just a link. */}
      <Link
        href={CONTACT.form}
        className="hidden md:flex items-center justify-center px-6 py-2.5 rounded text-sm font-medium transition-colors bg-secondary text-white border border-secondary hover:bg-[#9B3E9A] hover:border-[#9B3E9A]"
      >
        Let's Talk
      </Link>

      {/* Two strokes rather than three. The bar carries one wordmark and one
          control, and a third line buys nothing but a heavier mark against a
          page whose whole argument is restraint. `-mr-2` pulls the 44px touch
          square back so the strokes line up with the padding, not the box. */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="-mr-2 grid h-11 w-11 place-items-center rounded-full transition-colors md:hidden focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: ink, outlineColor: ink }}
        data-testid="button-menu"
      >
        <span aria-hidden="true" className="relative block h-[13.5px] w-[22px]">
          {/* both strokes live at top:0 and travel by transform, because `top`
              does not animate against `transition-transform` and the cross
              would snap into place instead of closing */}
          <Stroke open={menuOpen} closedY={0} openRotate={45} onPhoto={onPhoto} />
          <Stroke open={menuOpen} closedY={12} openRotate={-45} onPhoto={onPhoto} />
        </span>
      </button>

      {menuOpen && (
        <MobileMenu
          panelRef={panelRef}
          menuButtonRef={menuButtonRef}
          links={links}
          onClose={closeMenu}
          onNavigate={setLocation}
        />
      )}
    </nav>
  );
}

/**
 * THE MOBILE MENU.
 *
 * Below `md` the bar carried a wordmark and nothing else — no links, no
 * hamburger, no way off the page. That was survivable while the homepage was
 * short. It is not survivable now: the homepage is thirteen screens on a phone,
 * and /our-story, /team, /blog, /join and /contact had no route to them at all
 * except scrolling to the very bottom, on the one page that has a footer.
 *
 * A sheet rather than a dropdown, because the links are set at reading size and
 * a panel hanging off the bar would have covered most of the screen anyway
 * while pretending not to. The bar itself stays on top of it — see the ink note
 * in Navbar — so what the reader sees is the bar's own control opening and
 * closing, not a second piece of chrome arriving with its own close button.
 *
 * The scroll lock is `overflow: hidden` on the documentElement, the same choice
 * CaseReader makes and for the same measured reason: `position: fixed` on the
 * body collapses scrollHeight, which resets every act's progress to 0 and
 * re-cuts the film underneath.
 */
function MobileMenu({
  panelRef,
  menuButtonRef,
  links,
  onClose,
  onNavigate,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  links: { name: string; href: string }[];
  onClose: () => void;
  onNavigate: (to: string) => void;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevGutter = html.style.scrollbarGutter;
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "stable";

    /* Focus starts inside, or the first Tab leaves. See the ring note below. */
    panelRef.current?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = prevOverflow;
      html.style.scrollbarGutter = prevGutter;
    };
  }, [panelRef]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      /* THE RING IS BUILT HERE RATHER THAN LEFT TO THE BROWSER, and that is the
         whole reason this works.

         The button lives in the bar and the links live in a portal on
         document.body — which puts the panel AFTER <main> in document order. A
         trap that only intervenes at the two ends therefore never gets a turn:
         Tab went from the button into the page behind the sheet, and measurably
         so — through the hero's call to action, all five case cards and the
         close, dragging the document 6155px down as each hidden control was
         scrolled into a view nobody could see.

         So every Tab is handled: work out the next element in OUR order and go
         there. `preventScroll` on each hop, because a focus() that scrolls is
         how the drift got in. */
      const panel = panelRef.current;
      const button = menuButtonRef.current;
      if (!panel || !button) return;
      const ring = [
        button,
        ...Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button, [href], [tabindex]:not([tabindex="-1"])',
          ),
        ),
      ];
      if (ring.length < 2) return;

      e.preventDefault();
      const i = ring.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey
        ? ring[(i <= 0 ? ring.length : i) - 1]
        : ring[(i + 1) % ring.length];
      next.focus({ preventScroll: true });
    },
    [onClose, panelRef, menuButtonRef],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return createPortal(
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
      className="fixed inset-0 z-[200] flex flex-col overflow-y-auto overscroll-contain px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[5.5rem] focus:outline-none md:hidden motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
      style={{ backgroundColor: NAVY, color: "#FFFFFF" }}
      data-testid="mobile-menu"
    >
      {/* `m-auto` rather than `mt-auto`, and rather than justify-center on the
          column. Hard-bottoming the group left 386px of empty navy over the
          list on a 844px phone — nearly half the sheet — which reads as a panel
          that failed to load rather than as composition. Auto margins on a flex
          item centre it AND collapse to zero when the item is taller than the
          sheet, so a short phone scrolls from the top instead of having its
          first link clipped above the scroll origin. */}
      <div className="m-auto w-full">
        <nav>
          <ul className="m-0 list-none p-0">
            {links.map((link, i) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between gap-4 py-[1.05rem] no-underline transition-colors duration-200 hover:text-[#cf81cd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.14)",
                    color: "inherit",
                    fontFamily: "'Zodiak', Georgia, serif",
                    fontSize: "clamp(1.85rem, 8vw, 2.5rem)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                  data-testid={`link-menu-${link.href.slice(1)}`}
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.34)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* The same filled pill the close uses, because it is the same ask. */}
        <div className="mt-[2.6rem]">
          <a
            href={CONTACT.form}
            onClick={(e) => {
              e.preventDefault();
              onClose();
              onNavigate(CONTACT.form);
            }}
            className="flex min-h-12 items-center justify-center gap-[0.6rem] rounded-full px-[2rem] py-[1.05rem] no-underline transition-colors duration-200 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
            style={{
              backgroundColor: ACCENT,
              color: NAVY,
              fontFamily: "'Switzer', sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
            }}
            data-testid="link-menu-contact"
          >
            Let's Talk <span aria-hidden="true">→</span>
          </a>

          <a
            href={mailto}
            onClick={onClose}
            className="mt-[1.4rem] block text-center no-underline transition-colors duration-200 hover:text-[#cf81cd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{
              color: "rgba(255,255,255,0.62)",
              fontFamily: "'Switzer', sans-serif",
              fontSize: "0.92rem",
              overflowWrap: "anywhere",
            }}
            data-testid="link-menu-email"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Stroke({
  open,
  closedY,
  openRotate,
  onPhoto,
}: {
  open: boolean;
  closedY: number;
  openRotate: number;
  onPhoto: boolean;
}) {
  return (
    <span
      className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300"
      style={{
        transform: open
          ? `translateY(6px) rotate(${openRotate}deg)`
          : `translateY(${closedY}px)`,
        /* the same shadow the wordmark takes over a portrait, for the same
           reason: a white hairline vanishes into the light half of a face */
        boxShadow: onPhoto ? "0 1px 5px rgba(0,0,0,0.6)" : undefined,
      }}
    />
  );
}

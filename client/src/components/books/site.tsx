import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { Link } from "wouter";
import logoImg from "@assets/FullLogo_Transparent_NoBuffer_1772265926648.png";
import { mailFor, whatsappFor } from "./content";

export const EASE = [0.22, 0.61, 0.36, 1] as const;

/* ─────────────── Which book the visitor has in mind ───────────────
 * One tiny store shared by the shelf and the close, so "talk to us about this book"
 * arrives at the contact section with that book already picked. It is the value the
 * enquiry form sends. */

/** A book id from content.BOOKS, or "unsure". */
export type Choice = { id: string; ask: string | null } | null;

let choice: Choice = null;
const listeners = new Set<() => void>();

export function setChoice(next: Choice) {
  choice = next;
  listeners.forEach((l) => l());
}

export function useChoice() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => choice,
    () => null,
  );
}

/** Pick a book (by its own name, e.g. "a company history") and travel to the contact section. */
export function startWith(id: string, ask: string) {
  setChoice({ id, ask });
  document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
}

export { mailFor, whatsappFor };

/**
 * How "on" item i of n is, welded to scroll progress p (0..1): fully on while its block
 * holds the middle of the screen, handing over quickly at the seams. No timers, no observers.
 */
export function useSlot(p: MotionValue<number>, i: number, n: number, seam = 0.025) {
  const a = i / n;
  const b = (i + 1) / n;
  const input = i === 0 ? [0, b - seam, b + seam] : i === n - 1 ? [a - seam, a + seam, 1] : [a - seam, a + seam, b - seam, b + seam];
  const output = i === 0 ? [1, 1, 0] : i === n - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  return useTransform(p, input, output);
}

/* ─────────────── Type and layout ─────────────── */

/**
 * Entrances are welded to scroll, never timed: a block rises and settles as it travels
 * from the bottom of the screen to two-thirds of the way up, and runs backwards if you scroll back.
 * `delay` staggers siblings by starting them slightly later in the same stretch.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "start 62%"] });
  const k = Math.min(delay * 2, 0.5);
  const opacity = useTransform(scrollYProgress, [k, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [k, 1], [28, 0]);
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`kicker text-magenta ${className}`}>{children}</p>;
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`display text-[32px] leading-[1.08] md:text-[52px] md:leading-[1.02] ${className}`}
      style={{ textWrap: "balance" }}
    >
      {children}
    </h2>
  );
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`measure text-[17px] leading-[1.7] text-muted-ink md:text-[19px] ${className}`}>{children}</p>
  );
}

/** Section head: a label and a headline, full width. No numerals, on purpose. */
export function Head({ label, title, lead }: { label: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <Reveal>
      <Kicker>{label}</Kicker>
      <H2 className="mt-5 max-w-[22ch]">{title}</H2>
      {lead && <Body className="mt-6">{lead}</Body>}
    </Reveal>
  );
}

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-6 md:px-10 ${className}`}>{children}</div>;
}

/* ─────────────── Header and footer ───────────────
 * /books is self-contained, like /offer: its own header and footer, no site nav.
 * The logo is the one way back to the rest of the site. */

const links = [
  { label: "The books", href: "#top" },
  { label: "How we work", href: "#process" },
  { label: "Formats", href: "#formats" },
  { label: "Questions", href: "#faq" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-paper">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="flex shrink-0 flex-col" aria-label="The Story Shapers home">
          <Logo className="h-[30px] md:h-[34px]" />
          <span className="kicker mt-1 text-[9px] text-muted-ink">Books &amp; Keepsakes</span>
        </Link>
        <nav aria-label="On this page" className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="whitespace-nowrap text-[14px] text-muted-ink transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#start"
          className="kicker whitespace-nowrap border border-ink px-3.5 py-2.5 text-[10px] text-ink transition-colors hover:bg-ink hover:text-paper md:px-4 md:text-[11px]"
        >
          <span className="md:hidden">Talk to us</span>
          <span className="hidden md:inline">Start a conversation</span>
        </a>
      </div>
    </header>
  );
}

/**
 * The studio's script wordmark: the same file the site's navbar uses, drawn as a mask
 * so it takes this page's ink (or any colour passed in).
 */
export function Logo({ className = "", color = "var(--color-ink)" }: { className?: string; color?: string }) {
  return (
    <span
      role="img"
      aria-label="The Story Shapers"
      className={`block aspect-[1280/334] ${className}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${logoImg})`,
        maskImage: `url(${logoImg})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    />
  );
}

const icon = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true } as const;
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const SOCIAL = [
  {
    label: "WhatsApp",
    href: whatsappFor(null),
    glyph: (
      <svg {...icon}>
        <path d="M3.6 20.4l1.3-4.3A8.4 8.4 0 1 1 8 19.2z" {...line} />
        <path
          fill="currentColor"
          d="M9 8.3c.2-.4.5-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.5.3-1.1.5-1.7.4-2.8-.5-5.2-2.9-5.7-5.7-.1-.6.1-1.2.4-1.8z"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/the-story-shapers-collective",
    glyph: (
      <svg {...icon}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" {...line} />
        <path d="M8.2 10.6v5.6M8.2 7.9v.1M11.6 16.2v-5.6M11.6 13.2c0-1.6 1-2.6 2.3-2.6s2.1.9 2.1 2.4v3.2" {...line} />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/thestoryshapers",
    glyph: (
      <svg {...icon}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.8" {...line} />
        <circle cx="12" cy="12" r="4" {...line} />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: mailFor(null),
    glyph: (
      <svg {...icon}>
        <rect x="2.5" y="5" width="19" height="14" rx="1.8" {...line} strokeWidth={1.7} />
        <path d="M3 6l9 7 9-7" {...line} strokeWidth={1.7} />
      </svg>
    ),
  },
];

/** The last page: signed off like a letter, with the studio's script logo as the signature, then the ways to reach us. */
export function Footer() {
  return (
    <footer className="bg-paper text-ink">
      <Wrap className="flex flex-col items-center pt-20 pb-10 text-center md:pt-24">
        {/* the page signs off the way a letter does: a closing line, then the script logo as the signature */}
        <p className="display text-[22px] leading-[1.3] text-muted-ink italic md:text-[26px]">Yours in stories,</p>
        <Logo className="mt-4 h-[60px] md:mt-5 md:h-[78px]" />

        <ul className="mt-10 flex items-center gap-4">
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.href.startsWith("mailto") ? s.label : `${s.label} (opens in a new tab)`}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-edge text-ink transition-colors duration-300 hover:border-magenta hover:bg-magenta hover:text-paper"
              >
                {s.glyph}
              </a>
            </li>
          ))}
        </ul>

        <p className="kicker mt-16 w-full border-t border-edge pt-6 text-[10px] tracking-[0.12em] text-ink/75">
          &copy; 2026 The Story Shapers Collective
        </p>
      </Wrap>
    </footer>
  );
}

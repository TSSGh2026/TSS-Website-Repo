import { motion, useInView, useMotionValue, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Act, ActWrap } from "./Act";
import { HeartDoodle } from "./Doodles";
import { CONTACT, mailto, whatsappHref } from "@/lib/contact";
import fatemaFace from "@/assets/shapers/fatema-face.webp";
import shailiFace from "@/assets/shapers/shaili-face.webp";
import aakankshaFace from "@/assets/shapers/aakanksha-face.webp";

const ACCENT = "#cf81cd";
const NAVY = "#0C0A3E";
const EASE = [0.16, 1, 0.3, 1] as const;

const FACES = [
  { src: fatemaFace, name: "Fatema" },
  { src: shailiFace, name: "Shaili" },
  { src: aakankshaFace, name: "Aakanksha" },
];

/**
 * THE CLOSE — the page stops moving and starts responding.
 *
 * Three doors, deliberately: the button goes to the form, for people who would
 * rather be asked the right questions, and the two routes under the rule are for
 * people who just want to send a message. It used to be one door dressed as two
 * — a button that quietly opened a mail client, above a footer carrying the same
 * address.
 *
 * WHY THIS FRAME IS SHAPED THE WAY IT IS
 *
 * Fatema's note on the study: it looked empty. It was, measurably — 358px of
 * content in a 900px stage, 40% of its own frame, with the heading at 70px
 * against the hero's settled 128px. The last frame of the film was reading at
 * half the weight of the first. Three corrections, none of which invented copy:
 *
 *   1. the heart moved INSIDE the sentence, after the full stop, sized in `em`.
 *      Floating above a centred block it read as a thing in a gap, which was
 *      also her note on the hero's wink before that one was cut outright.
 *      This one stays: the hero's sentence had just finished cutting itself to
 *      three words and a face after the full stop was a second punchline. This
 *      heading is an invitation, and the heart is the warmth on an ask.
 *   2. the heading came up to within striking distance of the hero.
 *   3. `.close__who` under a hairline: the peak's three faces at 2.6rem, then
 *      the direct routes. The faces carry no caption on purpose; the peak
 *      introduced them three screens earlier, so at this size they are a
 *      signature rather than a second team section.
 *
 * The stage is 76svh rather than a full screen, so the footer's top edge is
 * inside the frame and the last thing you see has a bottom to it.
 */
export function CTA() {
  return (
    <Act id="act-close" kind="flow" ground="dark" bg={NAVY} stageMinH="min-h-[76svh]">
      {(progress) => <Close progress={progress} />}
    </Act>
  );
}

function Close({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <ActWrap className="max-w-[60rem] text-center">
      <div ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: "'Zodiak', serif",
            fontWeight: 400,
            fontSize: "clamp(2.9rem, 7.4vw, 6.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            textWrap: "balance",
            color: "#FFFFFF",
            margin: 0,
          }}
          data-testid="text-cta-heading"
        >
          Tell us your story.
          {/* sized in em because it punctuates a sentence now, so it has to
              scale with the type rather than with the viewport */}
          <HeartDoodle
            progress={progress}
            className="inline-block w-[0.56em] translate-y-[-0.04em] ml-[0.2em] align-baseline"
          />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.66)",
            /* BALANCED, like the heading above it, and measured rather than
               eyeballed. Left to the default wrap this broke "feels / off" at
               1440 — the two words the whole ask rests on, split across a line
               — and at 1024 and 768 it broke "tell / you" and left "you what we
               see." stranded as a four-word tail. Balance breaks after "Show
               us" at every width from 414 up and holds one shape. */
            textWrap: "balance",
            maxWidth: "34rem",
            margin: "clamp(1.6rem, 3vh, 2.4rem) auto clamp(2.4rem, 4.5vh, 3.4rem)",
          }}
          /* "Show us", not "Tell us". Fatema, 25 Aug: the block was tell-tell-
             tell — the heading, then twice more in one sentence, and the third
             one turned a warm invitation into a tic. The middle one is the one
             that gives, because "we'll tell you what we see" is the offer and
             the heading is the ask. Two now, at the two ends, which reads as
             give-and-get rather than as a stutter. */
          data-testid="text-cta-p1"
        >
          We're always up for a good one. Show us where it feels off, and we'll
          tell you what we see.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
        >
          <BigCta />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.36, ease: EASE }}
          className="mx-auto flex max-w-[42rem] flex-col items-center gap-4 border-t border-white/15 pt-[clamp(2rem,4.5vh,3rem)] mt-[clamp(2.4rem,5.5vh,3.6rem)] sm:flex-row sm:gap-[clamp(0.9rem,2vw,1.3rem)]"
        >
          <span className="inline-flex shrink-0" aria-hidden="true">
            {FACES.map((f, i) => (
              <img
                key={f.name}
                src={f.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-[2.6rem] w-[2.6rem] rounded-full object-cover"
                style={{
                  border: `2px solid ${NAVY}`,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.18)",
                  marginLeft: i === 0 ? 0 : "-0.78rem",
                }}
              />
            ))}
          </span>

          <span className="text-center sm:text-left">
            <span
              className="block"
              style={{
                fontFamily: "'Switzer', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.62)",
              }}
              data-testid="text-cta-direct"
            >
              Or reach us directly.
            </span>

            {/* Stacked below 34rem, separator hidden with them: wrapped, the
                middle dot stranded on the end of the first line like a typo,
                and it was only ever standing in for the word "or". */}
            <span className="mt-0.5 flex flex-col items-center sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-[0.85rem]">
              <Route href={mailto} testId="link-cta-email">
                {CONTACT.email}
              </Route>
              {whatsappHref && (
                <>
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline"
                    style={{ color: "rgba(255,255,255,0.34)" }}
                  >
                    ·
                  </span>
                  <Route
                    href={whatsappHref}
                    external
                    testId="link-cta-whatsapp"
                  >
                    {CONTACT.whatsappLabel}
                  </Route>
                </>
              )}
            </span>
          </span>
        </motion.div>
      </div>
    </ActWrap>
  );
}

/**
 * The page's two calls to action match, and they are the only filled blocks on
 * it. Chrome stays outlined; asking for the conversation does not — an outlined
 * pill on the last frame of a film was the least committed moment on the page.
 *
 * The bloom follows the pointer. Touch fires neither pointermove nor hover, so
 * on a phone the last frame had nothing happening on it at all; there it rests
 * lit and centred, and presses down instead.
 */
function BigCta() {
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);

  return (
    <Link
      href={CONTACT.form}
      className="group relative isolate inline-flex items-center gap-[0.7rem] overflow-hidden rounded-full transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white active:scale-[0.975]"
      style={{
        padding: "1.25rem 2.4rem",
        backgroundColor: ACCENT,
        color: NAVY,
        fontFamily: "'Switzer', sans-serif",
        fontSize: "1.02rem",
        fontWeight: 600,
        textDecoration: "none",
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        gx.set(e.clientX - r.left);
        gy.set(e.clientY - r.top);
      }}
      data-testid="button-start-a-conversation"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-64 w-64 rounded-full opacity-45 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100"
        style={{
          left: gx,
          top: gy,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.55), transparent 62%)",
        }}
      />
      Start a conversation <span aria-hidden="true">→</span>
    </Link>
  );
}

function Route({
  href,
  external,
  testId,
  children,
}: {
  href: string;
  external?: boolean;
  testId?: string;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    fontFamily: "'Switzer', sans-serif",
    fontSize: "0.98rem",
    fontWeight: 500,
    color: "#FFFFFF",
    textDecoration: "none",
    padding: "0.4rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.32)",
  };
  const className =
    "inline-block transition-colors duration-200 hover:border-b-[#cf81cd] focus-visible:border-b-[#cf81cd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      style={style}
      data-testid={testId}
    >
      {children}
    </a>
  ) : (
    <a href={href} className={className} style={style} data-testid={testId}>
      {children}
    </a>
  );
}

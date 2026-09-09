import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Act } from "./Act";
import { useNarrow } from "@/hooks/use-act-progress";
import { CrewDoodle } from "./Doodles";
import fatemaPanel from "@/assets/shapers/fatema-panel.webp";
import shailiPanel from "@/assets/shapers/shaili-panel.webp";
import aakankshaPanel from "@/assets/shapers/aakanksha-panel.webp";
import fatemaFace from "@/assets/shapers/fatema-face.webp";
import shailiFace from "@/assets/shapers/shaili-face.webp";
import aakankshaFace from "@/assets/shapers/aakanksha-face.webp";

const BONE = "#F4F1EA";
const NAVY = "#0C0A3E";
const ACCENT_DEEP = "#7b1e7a";

/**
 * THE PEAK — three people, met one at a time, then together.
 *
 * The only light ground on the page and the only faces on it. Everything before
 * this is type on navy; the cut to bone is the loudest thing the page does, and
 * it is spent on the one claim the business actually rests on.
 *
 * WHY THE PANELS WIPE AND DO NOT FADE
 *
 * Fading two full-screen layers through each other put a two-eyed portrait on
 * the screen with "Shaili Contractor" and "Aakanksha Singh Devi" on one baseline
 * and both bios interleaved — a fifth of a thumb swipe, sitting on the climax of
 * the page. Making the layers opaque does NOT fix it: a layer that is fading in
 * is translucent while it does so, whatever is painted on it, so the one beneath
 * still reads through. Any opacity cross-fade between two full-bleed layers
 * shows both.
 *
 * A clip wipe never does. Every pixel belongs to exactly one panel at every
 * moment, and an edge travelling across the frame suits a typographic poster
 * better than a dissolve anyway.
 *
 * THE STACK IS THE MECHANISM
 *
 * Four opaque layers that only ever rise: intro at z-1, the three panels at z-2,
 * the convergence at z-4. The intro is COVERED rather than cross-faded — fading
 * it out under a half-opaque panel put its sentence through Fatema's name.
 *
 * WHERE THE COPY LIVES
 *
 * Here, not in the CMS. The CMS team records carry `whatSheBrings` and
 * `decisionsLed`, and the lines below are a rewrite of both that Fatema approved
 * on the study — wiring this to the CMS today would put the older, longer copy
 * back on the page. The portraits are the same story: these are purpose-cut at
 * 4:5 with a chosen focus point, and the CMS holds one 2MB uncropped JPEG and
 * one 800x800. Re-wiring is a decision for after the rework lands, and it needs
 * the CMS rows updated first.
 */

/**
 * `focus` is the vertical object-position of the panel photograph, and it is not
 * a taste knob — it is the only thing standing between the phone layout and a
 * headless torso.
 *
 * The phone picture box is landscape and the photographs are 4:5, so
 * object-cover fills the width and crops the height — and left to itself it
 * crops from the CENTRE, which is a band through the middle of a standing
 * portrait. Aakanksha's arrived as her waist, Shaili's cut at the eyes.
 *
 * The three photographs are framed differently enough that no single value
 * serves all of them: Shaili's and Aakanksha's heads start at the top of their
 * frames, Fatema's a fifth of the way down.
 *
 * It costs nothing on a wide screen. At lg the box is 42% x 100svh, TALLER than
 * 4:5, so the crop runs horizontally and the vertical value is inert.
 */
const SHAPERS = [
  {
    name: "Fatema Hanif",
    panel: fatemaPanel,
    face: fatemaFace,
    /* seated and further back, with the whole top fifth of the frame above her
       head — the only one that has to be pushed down to fill the box */
    focus: "50% 30%",
    does: "Positioning, go-to-market, creator programs and multi-market expansion. Builds marketing functions from scratch and makes brand strategy and business reality point the same way.",
    brands:
      "Headout · Singapore Tourism Board · Coca-Cola · LBB · Art Fervour · SOCIAL",
  },
  {
    name: "Shaili Contractor",
    panel: shailiPanel,
    face: shailiFace,
    /* a close-up that starts at the top of the frame */
    focus: "50% 0%",
    does: "Content strategy, brand narrative and editorial systems. Moves teams off scattered, ad-hoc content and onto structured storytelling that compounds into recall.",
    brands: "Heinz · Google Pixel · Bajaj · General Mills · LBB · Headout",
  },
  {
    name: "Aakanksha Singh Devi",
    panel: aakankshaPanel,
    face: aakankshaFace,
    /* standing, full-length — the middle of this frame is her waist, so the
       crop takes the top of the frame and stops at her hands */
    focus: "50% 0%",
    does: "Brand narrative, voice and editorial positioning. Makes brands sound like themselves, consistently, at every stage of growth.",
    brands:
      "LBB · Headout · Cadbury's · Singapore Tourism Board · Columbia Asia",
  },
];

/**
 * intro | 01 | 02 | 03 | all three.
 *
 * Slots OVERLAP by one fade length, and each rises over its own first fade and
 * is covered over its own last. Butted up with a hold at full, two panels sat at
 * opacity 1 together and the later one simply covered the earlier: a hard cut
 * wearing a crossfade's clothes.
 */
const FADE = 0.05;
const SLOTS: [number, number][] = [
  [-0.2, 0.12],
  [0.07, 0.34],
  [0.29, 0.56],
  [0.51, 0.79],
  [0.74, 1.3],
];

export function Team() {
  /* shorter on a phone, for the reason set out on the hero's span: a pinned
     act's span is scroll cost, not content */
  const narrow = useNarrow(40);

  return (
    <Act
      id="act-peak"
      kind="pin"
      span={narrow ? 2.7 : 3.4}
      ground="light"
      bg={BONE}
      stagePad=""
      stageClassName="overflow-hidden"
    >
      {(progress) => <Peak progress={progress} />}
    </Act>
  );
}

function Peak({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();

  /* THE PEAK HAS TO STOP BEING A PEAK WITH MOTION OFF.
     Four absolutely-positioned layers inside a 100svh box that wipe past each
     other: with no wipe and no pin they sit on top of one another and only the
     last is ever visible. Three portraits and three bios would not exist at all
     for anyone browsing with reduced motion, which is most of the section. */
  if (reduced) {
    return (
      <div className="w-full" style={{ backgroundColor: BONE, color: NAVY }}>
        <Intro stacked />
        {SHAPERS.map((s, i) => (
          <ShaperPanel key={s.name} shaper={s} index={i} progress={progress} stacked />
        ))}
        <Convergence progress={progress} stacked />
      </div>
    );
  }

  return (
    <div
      className="relative h-svh w-full overflow-hidden"
      style={{ backgroundColor: BONE, color: NAVY }}
    >
      <Intro />
      {SHAPERS.map((s, i) => (
        <ShaperPanel key={s.name} shaper={s} index={i} progress={progress} />
      ))}
      <Convergence progress={progress} />
    </div>
  );
}

/**
 * Rises and then HOLDS. Its opacity ramp completes before progress reaches 0 —
 * `(0 + 0.20) / 0.05` is already 4 — so in practice it is simply on from the
 * first frame, and panel 01 covers it. Kept as a constant rather than a
 * transform because pretending otherwise would suggest there is a fade here to
 * tune, and there is not.
 */
function Intro({ stacked }: { stacked?: boolean }) {
  return (
    <div
      className={
        (stacked
          ? "static px-6 py-[clamp(3rem,9vh,5.5rem)] sm:px-10 lg:px-20 "
          : "absolute inset-0 z-[1] px-6 sm:px-10 lg:px-20 ") +
        "grid place-items-center"
      }
      style={{ backgroundColor: BONE }}
    >
      <div className="grid w-full max-w-[46rem] justify-items-center">
        {/* draws on entry, not on act progress — see Doodles.tsx */}
        <CrewDoodle className="mb-8 w-[clamp(12rem,26vw,21rem)]" />
        {/* the act's heading. It was a div, which left the peak contributing
            three h3s — the Shapers' names — with no h2 above them anywhere on
            the page. Same size, same weight, same colour. */}
        <h2
          className="mb-[1.4rem]"
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: ACCENT_DEEP,
            /* an h2 arrives with the serif face and a UA margin, and this label
               is neither */
            margin: 0,
          }}
        >
          The Shapers
        </h2>
        {/* 30rem broke this into six lines of three words and it read as a poem
            rather than as a claim. Wide enough for three. */}
        <p
          className="m-0 max-w-[42rem] text-center"
          style={{
            fontFamily: "'Zodiak', Georgia, serif",
            fontSize: "clamp(1.7rem, 3.2vw, 2.7rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}
          data-testid="text-peak-intro"
        >
          We've built teams and fixed broken brand systems from inside
          fast-scaling companies. But we are storytellers first.
        </p>
      </div>
    </div>
  );
}

function ShaperPanel({
  shaper,
  index,
  progress,
  stacked,
}: {
  shaper: (typeof SHAPERS)[number];
  index: number;
  progress: MotionValue<number>;
  stacked?: boolean;
}) {
  const [start, end] = SLOTS[index + 1];

  const v = useTransform(progress, [start, start + FADE], [0, 1], { clamp: true });
  const clipPath = useTransform(v, (q) => `inset(0 ${((1 - q) * 100).toFixed(2)}% 0 0)`);
  const opacity = useTransform(v, (q) => (q > 0 ? 1 : 0));
  /* a slow push in across the panel's whole life, so a held portrait is never
     completely static */
  const scale = useTransform(progress, [start, end], [1.06, 1], { clamp: true });

  return (
    <motion.article
      className={
        (stacked
          ? "static border-t border-[rgba(12,10,62,0.14)] "
          : "absolute inset-0 z-[2] ") +
        /* content-center: two auto rows in a full-screen box get the slack
           SHARED between them, so a tall phone grew both the picture row and
           the text row and left bone holes above the name and under the client
           list. Centred, the pair keeps its natural height and the slack goes
           to the margins, where it reads as air. No effect at lg, which is one
           row of two columns. */
        "grid content-center grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]"
      }
      style={{
        backgroundColor: BONE,
        ...(stacked ? null : { opacity, clipPath }),
      }}
      data-testid={`panel-shaper-${index + 1}`}
    >
      {/* THE PHONE PHOTOGRAPH IS INSET, AND BOTH INSETS ARE LOAD-BEARING.
          Down the top, because the nav is fixed, 65px and never hides, so a
          picture that starts at the top of the stage spends its first quarter
          behind a bar — which is most of a head. In from the sides, because
          full-bleed is what forces the crop: cover scales a 4:5 portrait to the
          box's WIDTH, so at 375px the image lands 469px tall and a 218px box
          keeps under half of it. A narrower plate zooms less and therefore
          shows MORE of the person. Full-bleed column again at lg, where the box
          is taller than 4:5 and the crop runs harmlessly across the sides. */}
      <div
        /* The 65px is padding rather than part of the centring on purpose: the
           plate centres in what is LEFT of the row, so it can never drift up
           under the nav however short the screen gets. */
        className={
          (stacked
            ? ""
            : "flex items-center justify-center px-[1.35rem] pt-[65px] " +
              "sm:justify-start sm:px-6 lg:block lg:px-0 lg:pt-0 ") +
          "relative"
        }
        style={{ backgroundColor: BONE }}
      >
      <div
        className={
          (stacked
            ? "aspect-[4/5] "
            : "h-[33svh] w-[76%] max-w-[19rem] " +
              "sm:h-[42svh] sm:w-full sm:max-w-[22rem] " +
              "lg:h-svh lg:w-full lg:max-w-none ") +
          "relative overflow-hidden"
        }
        style={{ backgroundColor: "#ded8cc" }}
      >
        <motion.img
          src={shaper.panel}
          alt={shaper.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{
            objectPosition: shaper.focus,
            /* the push-in grows from the focal point rather than from the middle
               of the box. Around the centre, 1.06 lifts the top edge by 3% of
               the frame, which on a top-anchored crop takes the top of the head
               off for the first half of the panel's life. */
            transformOrigin: shaper.focus,
            filter: "grayscale(1) contrast(1.04)",
            ...(stacked ? null : { scale }),
          }}
        />
      </div>
      </div>

      {/* the paddings and gaps here are tighter than they look like they need to
          be, and they are what pays for the photograph: nav 65 + picture 218 +
          this block has to clear 660svh on the shortest phone still in use */}
      <div className="grid content-start px-[1.35rem] py-[1.1rem] sm:px-6 sm:py-8 lg:content-center lg:px-[clamp(2rem,5vw,5rem)] lg:py-12">
        <div
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "0.74rem",
            fontWeight: 500,
            letterSpacing: "0.2em",
            color: ACCENT_DEEP,
          }}
        >
          {`0${index + 1} / 03`}
        </div>
        <h3
          className="mt-[0.6rem] mb-0 sm:mt-[0.9rem]"
          style={{
            fontFamily: "'Zodiak', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4.6vw, 3.9rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
          }}
          data-testid={`text-shaper-name-${index + 1}`}
        >
          {shaper.name}
        </h3>
        <p
          className="mt-[0.85rem] max-w-[26rem] sm:mt-[1.4rem]"
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "clamp(0.98rem, 1.35vw, 1.18rem)",
            lineHeight: 1.44,
            color: "#3a3556",
          }}
        >
          {shaper.does}
        </p>
        <div
          className="mt-[1rem] max-w-[26rem] border-t border-[rgba(12,10,62,0.16)] pt-[0.7rem] sm:mt-8 sm:pt-[1.1rem]"
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "0.88rem",
            lineHeight: 1.55,
            color: "#5a5473",
          }}
        >
          {/* #8a84a0 measured 3.16:1 at 10.9px on bone against 4.5:1 required,
              and washed out badly enough to read as a printing fault rather
              than as restraint. */}
          <b
            className="mb-[0.45rem] block font-normal"
            style={{
              fontFamily: "'Switzer', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6e6885",
            }}
          >
            Has done it for
          </b>
          {shaper.brands}
        </div>
      </div>
    </motion.article>
  );
}

function Convergence({
  progress,
  stacked,
}: {
  progress: MotionValue<number>;
  stacked?: boolean;
}) {
  const [start] = SLOTS[4];
  const v = useTransform(progress, [start, start + FADE], [0, 1], { clamp: true });
  const clipPath = useTransform(v, (q) => `inset(0 ${((1 - q) * 100).toFixed(2)}% 0 0)`);
  const opacity = useTransform(v, (q) => (q > 0 ? 1 : 0));

  return (
    <motion.div
      className={
        (stacked
          ? "static px-6 py-[clamp(3rem,9vh,5.5rem)] sm:px-10 lg:px-20 "
          : "absolute inset-0 z-[4] px-6 sm:px-10 lg:px-20 ") +
        "grid place-items-center"
      }
      style={{
        backgroundColor: BONE,
        ...(stacked ? null : { opacity, clipPath }),
      }}
      data-testid="panel-shapers-all"
    >
      <div className="w-full max-w-[62rem] text-center">
        <div className="mb-[2.4rem] flex justify-center gap-[clamp(1rem,2.4vw,2rem)]">
          {/* Every one of these is cut to frame at 4:5 already. No
              object-position: a second framing decision applied on top of the
              first is how a crop ends up right on one screen and wrong on the
              next. */}
          {SHAPERS.map((s) => (
            <div
              key={s.name}
              className="h-[clamp(6.4rem,11.5vw,9.6rem)] w-[clamp(5rem,9vw,7.5rem)] overflow-hidden rounded-[2px]"
            >
              <img
                src={s.face}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(1) contrast(1.04)" }}
              />
            </div>
          ))}
        </div>
        {/* the second break is phone-only: at 375px "briefed." fell to a line of
            its own, and text-wrap:balance cannot reflow across an explicit <br>.
            The space after it is what a wide screen reads. */}
        <p
          className="m-0"
          style={{
            fontFamily: "'Zodiak', Georgia, serif",
            fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
            lineHeight: 1.16,
            letterSpacing: "-0.025em",
          }}
          data-testid="text-peak-line"
        >
          You work with us directly.
          <br />
          Not someone
          <br className="sm:hidden" /> we've briefed.
        </p>
      </div>
    </motion.div>
  );
}

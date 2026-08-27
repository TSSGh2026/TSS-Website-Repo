import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Link } from "wouter";
import { Act, ActLabel, ActWrap } from "./Act";
import { CONTACT } from "@/lib/contact";

const DEEP = "#09072B";
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * WHAT WE DO — three stages, eighteen things, and the two answers a reader
 * cannot buy without.
 *
 * NO LONGER CMS-DRIVEN. This section used to read /api/cms/services with the
 * constant below as a fallback. Fatema cut that tie on 26 Aug: the CMS rows are
 * being rewritten for the new design anyway, and until they are, anything they
 * served would fight the copy here. The peak's bios and the case studies went
 * the same way. The rows still exist and are still editable in /admin — they
 * simply are not read, which is the honest version of the same divergence
 * already recorded for the peak.
 *
 * THE TITLES ARE ONE WORD EACH. "Shape your story / Scale your story /
 * Sharpen your story" ended three display headings with the same two words, and
 * the section heading already establishes whose story is being talked about.
 * The verb is the only part that differs, so the verb is all that is left. The
 * subtitle underneath carries the meaning the trailing words used to.
 *
 * THE SUBTITLES NAME A SITUATION, NOT A STEP.
 *
 * A client arrives already inside one of these three and can take it on its
 * own; they are three doors, not one corridor. The 01/02/03 numbering that used
 * to sit in the left column said the opposite — see the note on Row.
 */
const LABEL = "Services";
const HEADING = "How we work with you.";

/* Half of these eighteen are execution — performance marketing, content
   operations, digital PR, social — but every one is a bare noun phrase, and a
   noun cannot say whether we advise on a thing or run it. That is what the
   second sentence of each subtitle is for: "We run the channels that make it
   travel" sits directly above the six items it is describing, so the answer
   arrives where the doubt does. A paragraph under the heading was tried on
   26 Aug and cut the same day for cluttering the section.

   The word "strategy" appeared in SIX of the eighteen and now appears in three:
   "Brand strategy audit" and "Content strategy audit" lost a word that added
   nothing, and "Repositioning strategy" is just repositioning. Six of eighteen
   was enough to answer "are you only strategy?" with a yes this business never
   meant. */
const STAGES = [
  {
    id: "shape",
    subtitle: "The story isn't clear yet. We find it, and build what carries it.",
    title: "Shape",
    items: [
      "Market & category research",
      "Product-market fit narrative",
      "Go-to-market strategy",
      "Brand voice & messaging document",
      "Content strategy",
      "Social starter kit",
    ],
  },
  {
    id: "scale",
    subtitle: "The story works. We run the channels that make it travel.",
    title: "Scale",
    items: [
      "Multi-channel content",
      "SEO/AEO content & strategy",
      "Performance marketing",
      "Social media marketing",
      "Customer retention marketing",
      "Content operations",
    ],
  },
  {
    id: "sharpen",
    subtitle: "The story has stopped landing. We find out why, and fix it.",
    title: "Sharpen",
    items: [
      "Brand audit",
      "Content audit",
      "Repositioning",
      "Digital PR",
      "Brand partnerships",
      "Brand retrospective",
    ],
  },
];

/**
 * The eighteen things used to be a faint list at 0.74 white and 15px, which is
 * how a full service offer ends up looking like small print. Each one now gets
 * an accent rule of its own and enough weight to be read as a line item —
 * eighteen ruled entries is what "full-stack" looks like without anyone having
 * to claim it.
 */
export function Services() {
  return (
    <Act id="services" kind="flow" ground="dark" bg={DEEP}>
      {(progress) => <Do progress={progress} />}
    </Act>
  );
}

function Do({ progress }: { progress: MotionValue<number> }) {
  const headRef = useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, margin: "-80px" });

  const rows = STAGES;

  return (
    <ActWrap>
      <div ref={headRef}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <ActLabel className="mb-[1.1rem]" data-testid="text-services-label">
            {LABEL}
          </ActLabel>

          {/* THE GAP IS IN THE INLINE STYLE, NOT A CLASS, AND THAT IS THE FIX.

              This carried `mb-[clamp(2.2rem,4.5vh,3.4rem)]` next to an inline
              `margin: 0`. Inline wins, so the computed margin-bottom was 0 and
              the heading sat -8px from the first rule — overlapping it. The
              intent was written down ("with it gone the heading owns that
              space") and had never once rendered.

              Everything about this element's spacing now lives in one place, so
              a class and a style cannot silently disagree again. */}
          <h2
            style={{
              fontFamily: "'Zodiak', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
              textWrap: "balance",
              color: "#FFFFFF",
              marginTop: 0,
              marginBottom: "clamp(2.2rem, 4.5vh, 3.4rem)",
            }}
            data-testid="text-services-heading"
          >
            {HEADING}
          </h2>

        </motion.div>
      </div>

      <div className="grid">
        {rows.map((row, i) => (
          <Row key={row.id} row={row} index={i} progress={progress} />
        ))}
      </div>
    </ActWrap>
  );
}

function Row({
  row,
  index,
  progress,
}: {
  row: { id: string; title: string; subtitle: string; items: string[] };
  index: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();

  /* windows sit around p 0.26-0.62: this is a FLOW act, so progress runs across
     the section's whole visible life and 0.5 is the moment it is centred */
  const q = useTransform(progress, [0.26 + 0.085 * index, 0.37 + 0.085 * index], [0, 1], {
    clamp: true,
  });
  const y = useTransform(q, (v) => (1 - v) * 16);

  return (
    <motion.div
      className="group grid grid-cols-1 items-start gap-x-[clamp(1rem,3vw,3rem)] gap-y-[0.9rem] border-t border-white/[0.13] py-[clamp(1.6rem,3vh,2.4rem)] last:border-b md:grid-cols-[1fr_1.5fr]"
      style={reduced ? undefined : { opacity: q, y }}
      data-testid={`services-row-${index + 1}`}
    >
      {/* THE 01/02/03 THAT USED TO SIT HERE IS GONE, AND MUST NOT COME BACK.

          Numbering three things makes them a sequence — step one, then two,
          then three — and these are not stages of one engagement. They are
          three situations a company is already in when it arrives, any one of
          which can be bought on its own. The numerals were quietly answering
          "can I just take go-to-market?" with no, which is the opposite of the
          truth, and they were the single biggest reason this section read as
          all-or-nothing. The subtitle under each title does the job the numeral
          was pretending to. */}
      <h3
        style={{
          fontFamily: "'Zodiak', Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
          lineHeight: 1.18,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          margin: 0,
        }}
        data-testid={`text-services-title-${index + 1}`}
      >
        {row.title}
        {/* inside the h3 rather than a sibling, so the title column is one
            block and the items column stays aligned to the top of both. Set
            plainly, at the same size as an item: it is the reader working out
            whether this row is about them, not a piece of display copy. */}
        <span
          className="mt-[0.5rem] block"
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "clamp(0.88rem, 1.1vw, 0.97rem)",
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: "0",
            color: "rgba(255,255,255,0.60)",
          }}
          data-testid={`text-services-subtitle-${index + 1}`}
        >
          {row.subtitle}
        </span>
      </h3>

      {/* two columns per stage above 46rem, so a service reads as a short menu
          rather than as a scroll of its own. Full width on a phone, where the
          title block sits above it rather than beside it. */}
      <ul className="m-0 grid list-none grid-cols-1 gap-x-[1.8rem] gap-y-[0.7rem] p-0 sm:grid-cols-2">
        {row.items.map((item, j) => (
          <Item
            key={item}
            label={item}
            progress={progress}
            at={0.29 + 0.085 * index + 0.016 * j}
          />
        ))}
      </ul>

      <StageCta
        row={row}
        progress={progress}
        at={0.29 + 0.085 * index + 0.016 * row.items.length}
      />
    </motion.div>
  );
}

/**
 * The way out of a stage.
 *
 * This section had no action in it at all. Three rows, each one naming a
 * different thing that might be wrong — "the story isn't clear yet", "it has
 * stopped landing" — and then nothing to do about it. A reader who recognises
 * their own situation here is the most persuaded they will be anywhere on the
 * page, and the only thing on offer was to keep scrolling.
 *
 * `?stage=` rides along so the enquiry arrives knowing which door it came
 * through. Shape and Sharpen are near-opposite problems, and knowing which one
 * a person picked is most of the first reply.
 *
 * A text link, not a filled pill. The closing act's button is the only filled
 * block on the page and it stays that way — three magenta buttons up here would
 * outshout the one that matters and turn a menu into a pitch.
 */
function StageCta({
  row,
  progress,
  at,
}: {
  row: { id: string; title: string };
  progress: MotionValue<number>;
  at: number;
}) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1], { clamp: true });

  return (
    <motion.div
      className="mt-[1.4rem]"
      style={reduced ? undefined : { opacity }}
    >
      <Link
        href={`/contact?stage=${row.id}#talk`}
        className="group/cta inline-flex items-baseline gap-[0.45rem] no-underline transition-colors duration-200"
        style={{
          fontFamily: "'Switzer', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 500,
          color: "#cf81cd",
          borderBottom: "1px solid rgba(207,129,205,0.35)",
          paddingBottom: "0.15rem",
        }}
        data-testid={`link-stage-cta-${row.id}`}
      >
        Start with {row.title}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/cta:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

/**
 * A rule, not a bullet. It sits on the item's own baseline grid and reads as an
 * index entry rather than as a list of features.
 *
 * The six inside a stage come up one after another, the same way the pillars do
 * under the hero — a service is a list, and a list that arrives as one block is
 * a paragraph pretending to be one.
 */
function Item({
  label,
  progress,
  at,
}: {
  label: string;
  progress: MotionValue<number>;
  at: number;
}) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1], { clamp: true });

  return (
    <motion.li
      className="grid grid-cols-[1.1rem_minmax(0,1fr)] items-baseline gap-[0.75rem] transition-colors duration-200 text-white/90 group-hover:text-white"
      style={{
        fontSize: "clamp(0.96rem, 1.14vw, 1.08rem)",
        lineHeight: 1.45,
        ...(reduced ? null : { opacity }),
      }}
    >
      <span
        aria-hidden="true"
        className="block h-px w-full -translate-y-[0.34em] bg-[#cf81cd] opacity-70 transition-opacity duration-200 group-hover:opacity-100"
      />
      {label}
    </motion.li>
  );
}

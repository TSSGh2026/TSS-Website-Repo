import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Link } from "wouter";
import { Act, ActLabel, ActWrap } from "./Act";
import { DISCIPLINES, type Discipline as Shape } from "@/data/services";

const DEEP = "#09072B";
const ACCENT = "#cf81cd";
const SERIF = "'Zodiak', Georgia, serif";
const SANS = "'Switzer', sans-serif";

/**
 * ACT FIVE — THE OFFER, cut by discipline and cut SHORT.
 *
 * Four disciplines, three services under each. Twelve on the page, not
 * forty-four.
 *
 * WHY TWELVE, AND WHY THIS IS NOT A LAYOUT DECISION.
 *
 * The brief for this section named forty-four services, and three different
 * layouts of all forty-four were built and all three failed in the same way:
 * unskimmable, and — Fatema's words — "if you're everything to everybody then
 * you're nothing to anybody."
 *
 * She is right, and the page had already said so two acts earlier. The turn
 * reads "Most marketing problems aren't just execution problems. They are
 * primarily story problems." A section that then lists forty-four deliverables
 * is arguing with the act above it: one says we find what is actually wrong,
 * the other says we will take any brief. The rail between them agrees with the
 * first — Tuisa, Social, LBB, CCPL and Headout are positioning and narrative
 * problems, not procurement.
 *
 * So the constraint is the fix. Three per discipline, named literally, and a
 * link out to /services for everything else. The disciplines and the three
 * live in data/services.ts, which /services reads too.
 *
 * WHAT THE EARLIER ATTEMPTS GOT WRONG, so none of it comes back:
 *
 *   NOTHING IS BEHIND ANYTHING. Four cards that opened a panel on click failed
 *   the only test that matters — the reader did not know they were clickable.
 *
 *   NO NUMERALS. "01 02 03 04" reads as step one, then two, then three.
 *
 *   NO COUNTS. "12 services / 11 services" is an inventory, and an uneven one.
 *
 *   NO DASHES. An accent hairline in front of every item is a texture, and at
 *   this many it is a tacky one. White space and alignment do the same work.
 */

const LABEL = "Services";
const HEADING = "The many shapes a story can take.";

export function Shapes() {
  return (
    <Act id="services" kind="flow" ground="dark" bg={DEEP}>
      {(progress) => <Body progress={progress} />}
    </Act>
  );
}

function Body({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();

  const label = useTransform(progress, [0.08, 0.16], [0, 1], { clamp: true });
  const head = useTransform(progress, [0.13, 0.28], [0, 1], { clamp: true });
  const headY = useTransform(head, (v) => (1 - v) * 18);

  return (
    <ActWrap>
      <motion.div style={reduced ? undefined : { opacity: label }}>
        <ActLabel className="mb-[1.1rem]" data-testid="text-services-label">
          {LABEL}
        </ActLabel>
      </motion.div>

      <motion.h2
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)",
          lineHeight: 1.06,
          letterSpacing: "-0.025em",
          textWrap: "balance",
          color: "#FFFFFF",
          marginTop: 0,
          marginBottom: "clamp(2.6rem, 5.5vh, 4rem)",
          ...(reduced ? null : { opacity: head, y: headY }),
        }}
        data-testid="text-services-heading"
      >
        {HEADING}
      </motion.h2>

      <div className="grid grid-cols-1 gap-y-[clamp(2.4rem,4.5vh,3.2rem)] sm:grid-cols-2 lg:grid-cols-4">
        {DISCIPLINES.map((s, i) => (
          <Discipline key={s.id} shape={s} index={i} progress={progress} />
        ))}
      </div>

      <Close progress={progress} />
    </ActWrap>
  );
}

/**
 * One discipline.
 *
 * A name, the thing it is for, and three services set large enough to be read
 * as three decisions rather than as the top of a list. Nothing marks an entry
 * as an entry except that it sits on its own line under a heading, which is
 * how an index has always worked.
 *
 * The rule sits on the LEFT of every column but the first, so it reads as a
 * gutter between columns rather than as a box around each one. Stacked on a
 * phone it becomes a rule on top, which is the same rule doing the same job in
 * the only direction left.
 */
function Discipline({
  shape,
  index,
  progress,
}: {
  shape: Shape;
  index: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();

  const at = 0.28 + 0.07 * index;
  const opacity = useTransform(progress, [at, at + 0.11], [0, 1], { clamp: true });
  const y = useTransform(opacity, (v) => (1 - v) * 16);

  return (
    <motion.div
      className={
        "border-t border-white/[0.13] pt-[1.5rem] sm:border-t-0 sm:pt-0 " +
        (index % 2 === 1 ? "sm:border-l sm:pl-[clamp(1.2rem,2.4vw,2rem)] " : "") +
        (index % 2 === 0 ? "sm:pr-[clamp(1.2rem,2.4vw,2rem)] " : "") +
        (index > 0
          ? "lg:border-l lg:pl-[clamp(1.2rem,2.2vw,2rem)] "
          : "lg:border-l-0 lg:pl-0 ") +
        "lg:pr-[clamp(1rem,1.8vw,1.6rem)]"
      }
      style={reduced ? undefined : { opacity, y }}
      data-testid={`services-group-${shape.id}`}
    >
      <h3
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)",
          lineHeight: 1.08,
          letterSpacing: "-0.022em",
          color: "#FFFFFF",
          margin: 0,
        }}
        data-testid={`text-services-title-${shape.id}`}
      >
        {shape.label}
      </h3>

      <p
        style={{
          fontFamily: SANS,
          fontSize: "clamp(0.88rem, 1.05vw, 0.96rem)",
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.58)",
          margin: "0.8rem 0 1.7rem",
          textWrap: "pretty",
        }}
        /* Two lines' worth whether it needs two or not, in the four-column
           band only: there, without it, the four lists began at three
           different heights. Stacked on a phone there is no band to align,
           and the reserved line was ~45px of dead air under three of the four
           disciplines. */
        className="lg:min-h-[3em]"
        data-testid={`text-services-line-${shape.id}`}
      >
        {shape.line}
      </p>

      <ul className="m-0 grid list-none gap-[0.85rem] p-0">
        {shape.lead.map((item) => (
          <li
            key={item}
            style={{
              fontFamily: SANS,
              fontSize: "clamp(1rem, 1.18vw, 1.1rem)",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.92)",
              textWrap: "pretty",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * The ways out. Two, and they are not equals.
 *
 * "See everything we do" goes to /services, where the full catalogue lives —
 * the homepage names the flagship three per discipline and sends the reader who
 * is looking for a specific deliverable somewhere that has it. The contact link
 * stays for the reader who already knows.
 *
 * Text links, not filled pills: the closing act's button is the only filled
 * block on this page and it stays that way. The catalogue link is the quieter
 * of the two, white rather than accent, because the conversation is still the
 * point of the page.
 */
function Close({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, [0.58, 0.68], [0, 1], { clamp: true });

  return (
    <motion.div
      className="mt-[clamp(2.6rem,5vh,3.6rem)] flex flex-wrap items-baseline gap-x-[2.2rem] gap-y-[1.1rem]"
      style={reduced ? undefined : { opacity }}
    >
      <TextLink href="/services" color="rgba(255,255,255,0.9)" rule="rgba(255,255,255,0.3)" testId="link-services-all">
        See everything we do
      </TextLink>
      <TextLink href="/contact#talk" color={ACCENT} rule="rgba(207,129,205,0.35)" testId="link-services-cta">
        Tell us what you're working on
      </TextLink>
    </motion.div>
  );
}

function TextLink({
  href,
  color,
  rule,
  testId,
  children,
}: {
  href: string;
  color: string;
  rule: string;
  testId: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group/cta inline-flex items-baseline gap-[0.45rem] no-underline transition-colors duration-200"
      style={{
        fontFamily: SANS,
        fontSize: "0.95rem",
        fontWeight: 500,
        color,
        borderBottom: `1px solid ${rule}`,
        paddingBottom: "0.15rem",
      }}
      data-testid={testId}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-1">
        →
      </span>
    </Link>
  );
}

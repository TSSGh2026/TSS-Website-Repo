import { type MotionValue } from "framer-motion";
import { Link } from "wouter";
import { Act, ActLabel, ActWrap } from "./Act";
import { DISCIPLINES, type Discipline as Shape } from "@/data/services";

const DEEP = "#09072B";
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

/**
 * The section paints whole. Fatema, 30 Sep: the columns arriving one by one
 * on scroll, with the link fading in after them, made the reader wait for a
 * menu they wanted to take in at a glance. Nothing here is tied to scroll
 * progress any more; the Act still sets the ground colour and the id.
 */
function Body(_: { progress: MotionValue<number> }) {
  return (
    <ActWrap>
      <ActLabel className="mb-[1.1rem]" data-testid="text-services-label">
        {LABEL}
      </ActLabel>

      <h2
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
        }}
        data-testid="text-services-heading"
      >
        {HEADING}
      </h2>

      <div className="grid grid-cols-1 gap-y-[clamp(2.4rem,4.5vh,3.2rem)] sm:grid-cols-2 lg:grid-cols-4">
        {DISCIPLINES.map((s, i) => (
          <Discipline key={s.id} shape={s} index={i} />
        ))}
      </div>

      <Close />
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
function Discipline({ shape, index }: { shape: Shape; index: number }) {
  return (
    <div
      className={
        "border-t border-white/[0.13] pt-[1.5rem] sm:border-t-0 sm:pt-0 " +
        (index % 2 === 1 ? "sm:border-l sm:pl-[clamp(1.2rem,2.4vw,2rem)] " : "") +
        (index % 2 === 0 ? "sm:pr-[clamp(1.2rem,2.4vw,2rem)] " : "") +
        (index > 0
          ? "lg:border-l lg:pl-[clamp(1.2rem,2.2vw,2rem)] "
          : "lg:border-l-0 lg:pl-0 ") +
        "lg:pr-[clamp(1rem,1.8vw,1.6rem)]"
      }
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
    </div>
  );
}

/**
 * One way out, and it is prominent: "See everything we do", to /services.
 * Fatema's call on 30 Sep, over the earlier pair of quiet text links. The
 * homepage names the flagship three per discipline; this button is how a
 * reader looking for anything else gets to it. A filled block in the accent
 * the navbar's Let's Talk uses, so it reads as the section's action at a
 * glance rather than as a line of body copy.
 */
function Close() {
  return (
    <div className="mt-[clamp(2.6rem,5vh,3.6rem)]">
      <Link
        href="/services"
        className="group/cta inline-flex items-center gap-[0.6rem] rounded bg-secondary no-underline transition-colors duration-200 hover:bg-[#9B3E9A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        style={{
          fontFamily: SANS,
          fontSize: "1rem",
          fontWeight: 500,
          color: "#FFFFFF",
          padding: "0.95rem 1.6rem",
        }}
        data-testid="link-services-all"
      >
        See everything we do
        <span aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}

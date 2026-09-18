import { useQuery } from "@tanstack/react-query";
import { imageSrc, fallbackToOriginal } from "@/lib/image-src";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { useEffect } from "react";

const BG = "#0C0A3E";
const ACCENT = "#7B1E7A";
const ACCENT_HOVER = "#9B3E9A";
const BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.6)";
const CARD = "#151340";

type HeroBlock = { eyebrow?: string; headlineLine1?: string; headlineLine2?: string; headlineLine2Italic?: boolean; subtext?: string; portrait?: string };
type AboutBlock = { label?: string; title?: string; paragraphs?: string[]; tags?: string[] };
type StatsBlock = { items?: { value: string; label: string }[] };

type PortfolioSummary = {
  id: number;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  hero: HeroBlock;
  stats: StatsBlock;
  about: AboutBlock;
};

export default function TeamPage() {
  const { data: members, isLoading } = useQuery<PortfolioSummary[]>({
    queryKey: ["/api/portfolios/summaries"],
  });

  useEffect(() => {
    document.title = "Our Team — The Story Shapers";
  }, []);

  return (
    <div style={{ backgroundColor: BG, color: "#FFFFFF", minHeight: "100vh", fontFamily: "'Switzer', sans-serif" }} data-testid="page-team">
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "9rem 1.5rem 5rem", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED, marginBottom: "1.5rem" }}>
          The Collective
        </div>
        <h1 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
          Meet the team.
        </h1>
        {/* Was "Three senior strategists." A hardcoded count on a page that is
            about to hold six people is a claim that goes stale the day a fourth
            face lands, so the number is gone and the second sentence — which is
            Fatema's and still true — stays exactly as it was. */}
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: MUTED, maxWidth: "560px", margin: "0 auto" }}>
          Senior strategists, and the specialists they work with. One shared belief: that the best brand work happens when strategy, content, and editorial thinking move together.
        </p>
      </section>

      {/* MOVEMENT ONE — THE SHAPERS.
          Card chrome, portfolio links, full weight. These three are on every
          engagement, and the page has to say so before it says anything else. */}
      <section
        style={{ padding: "0 1.5rem 0", maxWidth: "1100px", margin: "0 auto" }}
        aria-labelledby="movement-shapers"
      >
        <MovementLabel id="movement-shapers">The Shapers</MovementLabel>
        {isLoading ? (
          <div style={{ textAlign: "center", color: MUTED, fontFamily: "'Switzer', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", padding: "4rem 0" }}>
            LOADING…
          </div>
        ) : (
          // Three across from tablet up, stacked on a phone. The column count
          // used to be an inline repeat(3, 1fr), which held at every width and
          // squeezed all three cards into a 390px screen — headlines came out a
          // word per line. It stays in the class list precisely so it can be
          // overridden by breakpoint; an inline grid-template-columns cannot be.
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1.25rem" }}>
            {(members || []).map((member, idx) => (
              <MemberCard key={member.slug} member={member} idx={idx} />
            ))}
          </div>
        )}
      </section>

      {/* MOVEMENT TWO — THE SPECIALISTS. */}
      <Specialists />

      <Footer />
    </div>
  );
}

/**
 * The small uppercase rule that names a movement. Both movements carry one, so
 * neither reads as the page's default state with the other appended to it.
 *
 * An h2, and that is structural rather than cosmetic. As a div it contributed
 * nothing to the outline, which ran h1 "Meet the team" then three founder h2s
 * then the specialists' h3s — so a screen reader announced Ahalya, Sreepathy and
 * Raayeed as children of Aakanksha's card. Two parallel movements read as one
 * founder with three people filed underneath her, which is the exact opposite of
 * what the section is for. With the labels as the only h2s, each movement owns
 * its own branch and the people inside it sit at the same depth.
 */
function MovementLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        margin: "0 0 2rem",
        fontFamily: "'Switzer', sans-serif",
        fontSize: "0.6rem",
        fontWeight: 400,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>{children}</span>
      <span style={{ flex: 1, height: "1px", backgroundColor: BORDER }} aria-hidden="true" />
    </h2>
  );
}

/**
 * PLACEHOLDER DATA. Every word below is invented to size the layout and none of
 * it is a claim about anybody. It is here so the design can be judged before the
 * real submissions arrive, and it is the first thing to delete when they do —
 * see `.design/team-expansion/PROFILE-BRIEF.md` for what was asked of them.
 *
 * Hardcoded rather than wired to the CMS on purpose. The portfolios table has no
 * create route and no "add member" button in the dashboard — the founders' three
 * rows were seeded straight into the database — so a CMS-backed specialist is a
 * separate piece of work, and guessing at the shape of that data before the
 * layout is settled is how you end up migrating it twice.
 */
type Specialist = {
  name: string;
  discipline: string;
  does: string;
  portrait?: string;
};

const SPECIALISTS: Specialist[] = [
  {
    name: "Ahalya",
    discipline: "Design and art direction",
    does: "Turns written positioning into a visual system that holds up across every format a brand has to live in.",
  },
  {
    name: "Sreepathy",
    discipline: "Motion and film",
    does: "Builds the moving pieces, from brand films to the short cuts that carry a campaign after launch.",
  },
  {
    name: "Raayeed",
    discipline: "Photography and production",
    does: "Shoots the original material a brand needs so its pages stop leaning on stock.",
  },
];

/**
 * MOVEMENT TWO — THE SPECIALISTS.
 *
 * WHY THIS TIER IS A ROW AND NOT A SMALLER CARD
 *
 * The first build of this section differentiated the specialists from the
 * founders entirely by SUBTRACTION: no card, no border, no link, no client list,
 * smaller photograph. Every single difference was something taken away, and a
 * design review put the obvious to it — nothing that is only ever less reads as
 * a different KIND of thing. It reads as a lesser one. These are three real
 * people who agreed to be featured, and "principals, and then the staff" is the
 * one sentence this page must not accidentally say.
 *
 * So the tier changes grammar instead of dropping weight. The founders are
 * portrait-above-text in a bordered card; the specialists are a horizontal index
 * — photograph left, craft and name and line beside it, a hairline between
 * entries. Landscape against portrait, a rule against a border. It is legible at
 * a glance as a different form rather than a shrunken one, and the weight
 * difference falls out of the form rather than being the point of it.
 *
 * It also fixes three things the column version could not. The rows span the
 * container, so there are no interior columns to disagree with the card grid
 * above. The line gets a real measure instead of the 28 characters it had in a
 * 47%-wide phone column. And a fourth, fifth or sixth specialist is simply
 * another row, where the old flex layout would have thrown a partial last row to
 * opposite edges of the container.
 *
 * WHY THE DISCIPLINE IS THE LOUDEST THING IN THE ROW
 *
 * It is the reason the tier exists — the one element that says this is a
 * different category of person rather than a junior version of the category
 * above. In the first build it was set at 0.55rem, the smallest type on the page,
 * so the load-bearing information was also the least visible. It now leads the
 * row at 0.7rem with the name beneath it.
 *
 * WHY THERE IS STILL NO CLIENT LIST HERE
 *
 * A brands line is the heaviest credibility element on the founders' side and
 * the main thing giving those cards their authority. Granting it here would pull
 * the two tiers level again. If a specialist's client list is strong enough to
 * need publishing, that is an argument for giving them a full card, not for
 * thickening this one.
 */
function Specialists() {
  return (
    <section
      style={{ padding: "7.5rem 1.5rem 7rem", maxWidth: "1100px", margin: "0 auto" }}
      aria-labelledby="movement-specialists"
      data-testid="section-specialists"
    >
      <MovementLabel id="movement-specialists">The Specialists</MovementLabel>

      {/* THE STANDFIRST, AND WHAT IT LEARNED.
          Two earlier drafts both failed the same way. "Every engagement runs
          through the three above ... these are the people we bring in" made the
          founders the agent and the specialists the object. Rewriting it to
          "each of these specialists owns a craft the work depends on" fixed the
          grammar and kept the disease: it was still a sentence whose job was to
          rank, and Fatema called it — a reader does not need the pecking order
          explained to them on the way in.

          The premise underneath both drafts was wrong. They existed to defend
          the homepage's "You work with us directly. Not someone we've briefed."
          against the arrival of three more faces, by establishing who was
          permanent. But that promise is about not being handed to a stranger,
          and the strongest answer to it is not a hierarchy — it is that none of
          these people are strangers to each other. One collective on the brief
          keeps the promise better than a ranking ever did.

          Left-aligned under the label rather than centred between the movements.
          Centred Zodiak at 620px is the most declarative treatment this site
          has, and the page was spending it twice in one scroll. */}
      <p
        style={{
          fontFamily: "'Zodiak', serif",
          fontSize: "clamp(1.15rem, 1.9vw, 1.4rem)",
          lineHeight: 1.5,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "rgba(255,255,255,0.85)",
          maxWidth: "600px",
          margin: "0 0 3.5rem",
          /* Without this the last line was the word "on." by itself. Balanced,
             the three lines even out and the sentence stops ending on a widow. */
          textWrap: "balance",
        }}
        data-testid="text-specialists-hinge"
      >
        The collective that holds your story together. One team on the brief, from the thinking to the making.
      </p>

      <div>
        {SPECIALISTS.map((s, idx) => (
          <SpecialistRow key={s.name} specialist={s} idx={idx} />
        ))}
      </div>
    </section>
  );
}

function SpecialistRow({ specialist, idx }: { specialist: Specialist; idx: number }) {
  /* The house pattern — five components under components/offer/ gate their
     entrance animations on this and this page did not. A row that starts at
     opacity 0 and never animates is a row that is never read. */
  const reduced = useReducedMotion();
  const key = specialist.name.toLowerCase();

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      /* A rule between entries rather than around them. The founders' cards are
         bordered on all four sides; an index is ruled between its items, and the
         distinction is doing real work here. */
      style={{
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr)",
        gap: "clamp(1.25rem, 3vw, 2.25rem)",
        alignItems: "start",
        padding: "2rem 0",
        borderTop: idx === 0 ? "none" : `1px solid ${BORDER}`,
      }}
      data-testid={`specialist-entry-${key}`}
    >
      {/* 4:5 at 120px lands 150 tall against the founders' 337x253. Smaller on
          every axis, which the column version was not — at 220 wide it was 275
          tall, 22px TALLER than a founder's photograph, and on a page read by
          scrolling the eye takes height for weight. */}
      <div
        className="w-[88px] sm:w-[120px]"
        style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: "2px", flexShrink: 0 }}
      >
        {specialist.portrait ? (
          <img
            src={imageSrc(specialist.portrait, "lg")}
            onError={fallbackToOriginal(specialist.portrait)}
            alt={specialist.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
            data-testid={`img-specialist-${key}`}
          />
        ) : (
          /* The awaiting-a-photograph state, and it has to survive being seen:
             three of these are live from the day the tier ships until the last
             submission lands. An initial set in the page's own serif reads as a
             held place; a grey box reads as a bug.

             The tint came down from 0.16 to 0.10 because at the old value three
             of these were the most saturated fields on a page built on restraint
             — a held place should recede, not advertise. The initial went up from
             0.28 to 0.40 alpha, which takes it from 2.42:1 to 3.67:1 and over the
             3:1 floor for large text. aria-hidden because a screen reader
             announcing "A" before "Ahalya" is noise; the name follows in text. */
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(123,30,122,0.10)",
              display: "grid",
              placeItems: "center",
            }}
            data-testid={`placeholder-specialist-${key}`}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "'Zodiak', serif",
                fontSize: "1.9rem",
                lineHeight: 1,
                fontWeight: 400,
                color: "rgba(255,255,255,0.40)",
              }}
            >
              {specialist.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div>
        {/* No reserved second line any more. The old two-line minHeight existed
            to keep names aligned across a row of columns; rows have no
            neighbours to align with, so a discipline that wraps costs nothing
            and the dead air under the short ones is gone. */}
        <div
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            lineHeight: 1.4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
            marginBottom: "0.5rem",
          }}
          data-testid={`text-specialist-discipline-${key}`}
        >
          {specialist.discipline}
        </div>

        <h3
          style={{
            fontFamily: "'Zodiak', serif",
            fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
            lineHeight: 1.2,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            margin: "0 0 0.6rem",
          }}
          data-testid={`text-specialist-name-${key}`}
        >
          {specialist.name}
        </h3>

        {/* Clamped to three lines, because PROFILE-BRIEF.md tells all three of
            them "past about 25 words it clamps" and until now that was simply not
            true — a long submission would have grown the row instead. */}
        <p
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.6,
            color: MUTED,
            margin: 0,
            maxWidth: "48ch",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
          data-testid={`text-specialist-does-${key}`}
        >
          {specialist.does}
        </p>
      </div>
    </motion.article>
  );
}

function MemberCard({ member, idx }: { member: PortfolioSummary; idx: number }) {
  const reduced = useReducedMotion();
  const portrait = (member.hero as HeroBlock).portrait;
  const subtext = (member.hero as HeroBlock).subtext;

  // Where to crop each portrait. The card is 4:3 and the source photos are tall,
  // so only about half of each image's height survives — which half has to be
  // chosen per photo or a face ends up sliced.
  //
  // Aakanksha's is a full-length shot: her face sits roughly a quarter of the way
  // down a 3000x4500 frame, and "center center" started the visible window at
  // exactly that point, cutting her off at the eyes. A Y percentage of 16 opens
  // the window at about 8% of the image instead, which clears the top of her head.
  const photoPosition =
    member.slug === "aakanksha" ? "center 16%" :
    member.slug === "shaili" ? "center calc(50% + 35px)" :
    "center calc(50% + 15px)";

  // Panning alone still left her much further away than the other two, which are
  // head-and-shoulders: three cards in a row, one of them a full-length shot,
  // reads as a mistake. Scaling in about her face brings her to the same distance.
  // The source is 3000x4500, so there is far more resolution here than the card
  // needs even after the zoom. The card already clips.
  const photoZoom = member.slug === "aakanksha" ? 1.45 : 1;

  // A portfolio is worth linking to when there is something on it. Stats and
  // about paragraphs are the two blocks the summary endpoint exposes, and every
  // founder record carries both several times over.
  const hasPortfolio = Boolean(
    (member.stats as StatsBlock)?.items?.length ||
      (member.about as AboutBlock)?.paragraphs?.length,
  );

  return (
    <motion.div
      /* Gated, like the specialist rows and like the five components under
         components/offer/. It was unconditional here, which is the one way an
         entrance animation can cost a reader the content entirely. */
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: CARD,
        borderRadius: "16px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
      }}
      data-testid={`member-card-${member.slug}`}
    >
      {/* Photo */}
      <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", flexShrink: 0 }}>
        {portrait ? (
          <img
            /* "lg" and not "full": this card crops to 4:3 and then zooms into
               Aakanksha's by 1.45, so what it is short of is WIDTH, and a
               longest-edge cap caps the height of a tall photograph. See
               lib/image-src.ts. fallbackToOriginal covers a portrait uploaded
               since the last build, which has no static copy yet. */
            src={imageSrc(portrait, "lg")}
            onError={fallbackToOriginal(portrait)}
            alt={member.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: photoPosition, transform: `scale(${photoZoom})`, transformOrigin: "center 25%" }}
            data-testid={`img-member-${member.slug}`}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(123,30,122,0.15)" }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
        <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
          {member.name}
        </div>

        {/* h3, not h2. The movement labels are the page's two h2s now, so a
            founder headline at that level would sit BESIDE its own section
            heading rather than inside it — and the specialists' h3s would file
            themselves under the last founder. Same size, same weight, same
            face; only the outline changes. */}
        <h3 style={{ fontFamily: "'Zodiak', serif", fontSize: "1.15rem", lineHeight: 1.25, fontWeight: 400, letterSpacing: "-0.01em", margin: 0 }} data-testid={`text-member-name-${member.slug}`}>
          {(member.hero as HeroBlock).headlineLine1 || member.name}
          {(member.hero as HeroBlock).headlineLine2 && (
            <>
              {" "}
              <span style={{
                fontStyle: (member.hero as HeroBlock).headlineLine2Italic ? "italic" : "normal",
                color: (member.hero as HeroBlock).headlineLine2Italic ? "#FFAEDA" : "inherit",
              }}>
                {(member.hero as HeroBlock).headlineLine2}
              </span>
            </>
          )}
        </h3>

        {subtext && (
          <p style={{ fontSize: "0.8rem", lineHeight: 1.55, color: MUTED, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties} data-testid={`text-member-subtext-${member.slug}`}>
            {subtext}
          </p>
        )}

        {/* Rendered unconditionally until now, which was safe only because every
            row in the table happened to be a founder with a full portfolio
            behind it. The moment a card exists for someone who has sent a photo
            and two lines and nothing else, an unconditional link promises a
            page that is empty when you get there. Both movements can grow, so
            the guard belongs here rather than in the caller. */}
        {hasPortfolio && (
        <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
          <Link
            href={`/${member.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "'Switzer', sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#FFAEDA",
              textDecoration: "none",
              gap: "0.3rem",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            data-testid={`link-view-portfolio-${member.slug}`}
          >
            View full portfolio →
          </Link>
        </div>
        )}
      </div>
    </motion.div>
  );
}

import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { SectionLabel } from "./SectionAnimations";
import { GradientBlobs, teamBlobs } from "./GradientBlobs";
import { useCmsSettings, useCmsTeam } from "@/hooks/use-cms";
import teamFatema from "@assets/54b8c761-3071-4f74-8057-1840518e15a6_1772266999973.jpg";
import teamShaili from "@assets/Shaili-brand-deck_1772267064740.jpeg";
import teamAakanksha from "@assets/IMG_20260302_230326_1772542685201.jpg";

const defaultImageMap: Record<string, string> = {
  "Fatema Hanif": teamFatema,
  "Shaili Contractor": teamShaili,
  "Aakanksha Singh Devi": teamAakanksha,
};

const KNOWN_PORTFOLIO_SLUGS = new Set(["fatema", "shaili", "aakanksha"]);

function getPortfolioSlug(memberName: string): string | null {
  if (!memberName) return null;
  const firstName = memberName.trim().split(/\s+/)[0]?.toLowerCase() || "";
  return KNOWN_PORTFOLIO_SLUGS.has(firstName) ? firstName : null;
}

const hardcodedTeam = [
  {
    name: "Fatema Hanif",
    image: teamFatema,
    decisionsLed: "Positioning · Go-to-market · Creator programs · Multi-market expansion",
    contextsNavigated: "",
    brandsLabel: "Brands",
    brands: "Headout · Singapore Tourism Board · Coca-Cola · LBB · Art Fervour · SOCIAL",
    whatSheBrings: [
      "Specialises in making sure brand strategy and business reality point in the same direction. She has built marketing functions from scratch, scaled creator programs across markets, and driven brand transformations for startups and global companies.",
    ],
  },
  {
    name: "Shaili Contractor",
    image: teamShaili,
    decisionsLed: "Content strategy · Brand narrative · Editorial systems",
    contextsNavigated: "",
    brandsLabel: "Brands",
    brands: "Heinz · Google Pixel · Bajaj · General Mills · LBB · Headout",
    whatSheBrings: [
      "Builds content systems that create compounding brand equity — not just output. She moves teams from scattered, ad-hoc content to structured storytelling that builds recall and credibility over time.",
    ],
  },
  {
    name: "Aakanksha Singh Devi",
    image: teamAakanksha,
    decisionsLed: "Brand narrative · Voice · Editorial positioning",
    contextsNavigated: "",
    brandsLabel: "Brands",
    brands: "LBB · Headout · Cadbury's · Singapore Tourism Board · Columbia Asia",
    whatSheBrings: [
      "Makes brands sound like themselves — clearly, consistently, at every stage of growth. She moves teams from inconsistent messaging to a coherent voice that holds across every channel.",
    ],
  },
];

const cardColors = [
  { bg: "#0C0A3E", text: "#FFFFFF", accent: "#2A2870", overlayDark: false },
  { bg: "#0C0A3E", text: "#FFFFFF", accent: "#2A2870", overlayDark: false },
  { bg: "#0C0A3E", text: "#FFFFFF", accent: "#2A2870", overlayDark: false },
];

type TeamMember = {
  name: string;
  image: string;
  decisionsLed: string;
  contextsNavigated: string;
  brandsLabel: string;
  brands: string;
  whatSheBrings: string[];
};

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [frontCardIndex, setFrontCardIndex] = useState<number | null>(null);

  const { data: settings } = useCmsSettings();
  const { data: cmsTeamData } = useCmsTeam();

  const teamSettings = settings?.team;

  const team: TeamMember[] = cmsTeamData
    ? cmsTeamData.map((m: any) => ({
        name: m.name,
        image: m.image?.startsWith("/") ? m.image : (defaultImageMap[m.name] || m.image),
        decisionsLed: m.decisionsLed || "",
        contextsNavigated: "",
        brandsLabel: "Brands",
        brands: m.brands || "",
        whatSheBrings: m.whatSheBrings || [],
      }))
    : hardcodedTeam;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [expandedIndex]);

  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const fanProgress = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);

  const desktopFanConfigs = [
    { rotate: -10, x: -240, y: 20 },
    { rotate: 0, x: 0, y: -10 },
    { rotate: 10, x: 240, y: 20 },
  ];

  const tabletFanConfigs = [
    { rotate: -8, x: -190, y: 15 },
    { rotate: 0, x: 0, y: -8 },
    { rotate: 8, x: 190, y: 15 },
  ];

  const handleCardClick = useCallback((index: number) => {
    setExpandedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedIndex(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-2 md:px-4 lg:px-6 py-4"
      style={{ backgroundColor: "#0C0A3E" }}
      data-testid="team-section"
    >
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#0E0C45",
          borderRadius: "20px",
          minHeight: "auto",
          padding: "clamp(2rem, 4vw, 4rem)",
        }}
      >
        <GradientBlobs blobs={teamBlobs} />
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          {isMobile ? (
            <>
              <div className="mb-6">
                <SectionLabel isInView={isInView} testId="text-team-label">{teamSettings?.label ?? "The Shapers"}</SectionLabel>
                <h2
                  className="mb-4"
                  style={{
                    color: "#FFFFFF",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                  data-testid="text-team-heading"
                >
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                      fontWeight: 400,
                    }}
                  >
                    {teamSettings?.headingLine1 ?? "Three senior marketers."}{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      opacity: 0.75,
                    }}
                  >
                    {teamSettings?.headingLine2 ?? "45+ years of combined experience."}
                  </span>
                </h2>
                <div className="space-y-4">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
                      color: "rgba(255, 255, 255, 0.85)",
                      lineHeight: 1.8,
                    }}
                    data-testid="text-team-intro-1"
                  >
                    {teamSettings?.intro ?? "We've owned revenue targets, built teams, and fixed broken brand systems inside fast-scaling companies. We know what it takes to execute — not just advise."}
                  </p>
                </div>
              </div>
              <MobileCards onCardClick={handleCardClick} team={team} />
            </>
          ) : (
            <div className="flex items-start gap-8 lg:gap-12">
              <div className="w-[42%] shrink-0 sticky" style={{ top: "clamp(2rem, 4vw, 4rem)" }}>
                <SectionLabel isInView={isInView} testId="text-team-label">{teamSettings?.label ?? "The Shapers"}</SectionLabel>
                <h2
                  className="mb-5"
                  style={{
                    color: "#FFFFFF",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                  data-testid="text-team-heading"
                >
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                      fontWeight: 400,
                    }}
                  >
                    {teamSettings?.headingLine1 ?? "Three senior marketers."}{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      opacity: 0.75,
                    }}
                  >
                    {teamSettings?.headingLine2 ?? "45+ years of combined experience."}
                  </span>
                </h2>
                <div className="space-y-4">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(0.8rem, 1.1vw, 0.95rem)",
                      color: "rgba(255, 255, 255, 0.85)",
                      lineHeight: 1.8,
                    }}
                    data-testid="text-team-intro-1"
                  >
                    {teamSettings?.intro ?? "We've owned revenue targets, built teams, and fixed broken brand systems inside fast-scaling companies. We know what it takes to execute — not just advise."}
                  </p>
                </div>
                <div className="mt-6">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    DRAG OR CLICK A CARD
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <DesktopFanCards
                  fanProgress={fanProgress}
                  desktopFanConfigs={desktopFanConfigs}
                  tabletFanConfigs={tabletFanConfigs}
                  onCardClick={handleCardClick}
                  frontCardIndex={frontCardIndex}
                  setFrontCardIndex={setFrontCardIndex}
                  team={team}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expandedIndex !== null && (
          <TeamModal
            member={team[expandedIndex]}
            index={expandedIndex}
            colors={cardColors[expandedIndex]}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function TeamModal({
  member,
  index,
  colors,
  onClose,
}: {
  member: TeamMember;
  index: number;
  colors: (typeof cardColors)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const modalBg = "#0C0A3E";
  const modalText = "#FFFFFF";
  const modalAccent = "rgba(255, 255, 255, 0.5)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(12, 10, 62, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
      data-testid={`modal-team-${index}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: modalBg,
          color: modalText,
          borderRadius: "20px",
          border: `1px solid rgba(255, 255, 255, 0.15)`,
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col md:flex-row">
          <div
            className="md:w-2/5 relative"
            style={{
              minHeight: "300px",
              maxHeight: "500px",
              overflow: "hidden",
            }}
          >
            <img
              src={member.image}
              alt={member.name}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                borderRadius: "20px 20px 0 0",
              }}
              className="md:!rounded-l-[20px] md:!rounded-r-none"
            />
            <div
              className="md:hidden"
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, transparent 50%, ${modalBg} 100%)`,
                borderRadius: "20px 20px 0 0",
              }}
            />
          </div>

          <div
            className="md:w-3/5 p-6 md:p-8 flex flex-col"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    color: modalAccent,
                    opacity: 0.7,
                    letterSpacing: "0.2em",
                  }}
                >
                  SHAPER
                </span>
                <h3
                  className="mt-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.85rem, 1.3vw, 1.05rem)",
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                  data-testid={`modal-team-name-${index}`}
                >
                  {member.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  opacity: 0.7,
                  background: "none",
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  borderRadius: "6px",
                  padding: "0.4rem 0.75rem",
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                }}
                data-testid={`button-close-modal-${index}`}
              >
                CLOSE ×
              </button>
            </div>

            <ModalSection label="What she brings" accent={modalAccent}>
              {member.whatSheBrings.map((line, idx) => (
                <p
                  key={idx}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                    lineHeight: 1.8,
                    opacity: 0.85,
                    marginBottom: idx < member.whatSheBrings.length - 1 ? "0.5rem" : 0,
                  }}
                >
                  {line}
                </p>
              ))}
            </ModalSection>

            <ModalSection label="Decisions led" accent={modalAccent}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  opacity: 0.85,
                }}
              >
                {member.decisionsLed}
              </p>
            </ModalSection>

            <ModalSection label={member.brandsLabel} accent={modalAccent}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                  opacity: 0.8,
                }}
              >
                {member.brands}
              </p>
            </ModalSection>

            {getPortfolioSlug(member.name) && (
              <Link
                href={`/${getPortfolioSlug(member.name)}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  backgroundColor: "#7B1E7A",
                  padding: "0.7rem 1rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  marginTop: "0.5rem",
                }}
                data-testid={`link-portfolio-${index}`}
              >
                View portfolio →
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModalSection({
  label,
  accent,
  children,
  last = false,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : "1.25rem" }}>
      <span
        className="block mb-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
          opacity: 0.7,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function DesktopFanCards({
  fanProgress,
  desktopFanConfigs,
  tabletFanConfigs,
  onCardClick,
  frontCardIndex,
  setFrontCardIndex,
  team,
}: {
  fanProgress: any;
  desktopFanConfigs: { rotate: number; x: number; y: number }[];
  tabletFanConfigs: { rotate: number; x: number; y: number }[];
  onCardClick: (index: number) => void;
  frontCardIndex: number | null;
  setFrontCardIndex: (index: number | null) => void;
  team: TeamMember[];
}) {
  const [isTablet, setIsTablet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const configs = isTablet ? tabletFanConfigs : desktopFanConfigs;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ height: "500px", perspective: "1200px" }}
    >
      {team.map((member, i) => {
        const config = configs[i];
        const stackOffset = (i - 1) * 6;
        const baseZ = team.length - i;
        const zIndex = frontCardIndex === i ? 10 : baseZ;

        return (
          <FanCard
            key={i}
            member={member}
            index={i}
            fanProgress={fanProgress}
            targetRotate={config.rotate}
            targetX={config.x}
            targetY={config.y}
            stackOffset={stackOffset}
            zIndex={zIndex}
            onCardClick={onCardClick}
            isFront={frontCardIndex === i}
            onBringToFront={() => setFrontCardIndex(i)}
            containerRef={containerRef}
          />
        );
      })}
    </div>
  );
}

function FanCard({
  member,
  index,
  fanProgress,
  targetRotate,
  targetX,
  targetY,
  stackOffset,
  zIndex,
  onCardClick,
  isFront,
  onBringToFront,
  containerRef,
}: {
  member: TeamMember;
  index: number;
  fanProgress: any;
  targetRotate: number;
  targetX: number;
  targetY: number;
  stackOffset: number;
  zIndex: number;
  onCardClick: (index: number) => void;
  isFront: boolean;
  onBringToFront: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const colors = cardColors[index];
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const wasDraggedRef = useRef(false);

  const rotateZ = useTransform(fanProgress, [0, 1], [0, targetRotate]);
  const x = useTransform(fanProgress, [0, 1], [0, targetX]);
  const y = useTransform(fanProgress, [0, 1], [stackOffset, targetY]);
  const scale = useTransform(fanProgress, [0, 1], [0.95, 1]);
  const cardOpacity = useTransform(
    fanProgress,
    [0, 0.2 + index * 0.15, 0.4 + index * 0.15],
    [index === 0 ? 1 : 0.3, index === 0 ? 1 : 0.8, 1]
  );

  const cardW = "clamp(220px, 18vw, 280px)";
  const cardH = "clamp(320px, 42vh, 400px)";

  const overlayGradient = `linear-gradient(180deg, transparent 20%, rgba(12,10,62,0.6) 60%, rgba(12,10,62,0.92) 100%)`;

  return (
    <motion.div
      className="absolute group"
      style={{
        x,
        y,
        rotateZ,
        scale,
        opacity: cardOpacity,
        zIndex,
        width: cardW,
        height: cardH,
        transformOrigin: "center bottom",
        cursor: "grab",
        borderRadius: "16px",
        overflow: "hidden",
        border: isFront ? `2px solid rgba(255, 255, 255, 0.35)` : `1px solid rgba(255, 255, 255, 0.15)`,
        boxShadow: isFront ? "0 30px 80px rgba(0,0,0,0.6)" : "0 20px 60px rgba(0,0,0,0.4)",
      }}
      drag
      dragConstraints={containerRef}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragStart={(_, info) => {
        dragStartRef.current = { x: info.point.x, y: info.point.y };
        wasDraggedRef.current = false;
        onBringToFront();
      }}
      onDrag={(_, info) => {
        if (dragStartRef.current) {
          const dx = Math.abs(info.point.x - dragStartRef.current.x);
          const dy = Math.abs(info.point.y - dragStartRef.current.y);
          if (dx > 5 || dy > 5) {
            wasDraggedRef.current = true;
          }
        }
      }}
      onDragEnd={() => {
        dragStartRef.current = null;
      }}
      onClick={() => {
        if (!wasDraggedRef.current) {
          onCardClick(index);
        }
        wasDraggedRef.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick(index);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Drag or click to read more about ${member.name}`}
      data-testid={`card-team-${index}`}
      whileHover={{ scale: 1.03 }}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlayGradient,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.5,
            marginBottom: "0.5rem",
          }}
          data-testid={`text-team-name-${index}`}
        >
          {member.name}
        </h3>
        <span
          className="inline-block transition-all duration-300 group-hover:translate-x-1"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.55rem",
            color: "rgba(255, 255, 255, 0.6)",
            opacity: 0.7,
            letterSpacing: "0.1em",
          }}
        >
          READ MORE →
        </span>
      </div>
    </motion.div>
  );
}

function MobileCards({ onCardClick, team }: { onCardClick: (index: number) => void; team: TeamMember[] }) {
  return (
    <div className="flex flex-col gap-5 mt-4">
      {team.map((member, i) => {
        const colors = cardColors[i];
        return (
          <MobileCard
            key={i}
            member={member}
            index={i}
            colors={colors}
            onCardClick={onCardClick}
          />
        );
      })}
    </div>
  );
}

function MobileCard({
  member,
  index,
  colors,
  onCardClick,
}: {
  member: TeamMember;
  index: number;
  colors: (typeof cardColors)[0];
  onCardClick: (index: number) => void;
}) {
  const overlayGradient = `linear-gradient(180deg, transparent 20%, rgba(12,10,62,0.6) 60%, rgba(12,10,62,0.92) 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      style={{
        height: "420px",
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid rgba(255, 255, 255, 0.15)`,
        position: "relative",
      }}
      onClick={() => onCardClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`Read more about ${member.name}`}
      data-testid={`card-team-mobile-${index}`}
    >
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlayGradient,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.5,
            marginBottom: "0.5rem",
          }}
          data-testid={`text-team-name-mobile-${index}`}
        >
          {member.name}
        </h3>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.55rem",
            color: "rgba(255, 255, 255, 0.6)",
            opacity: 0.7,
          }}
        >
          READ MORE →
        </span>
      </div>
    </motion.div>
  );
}

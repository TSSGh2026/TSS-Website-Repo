import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { imageSrc, fallbackToOriginal } from "@/lib/image-src";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { Navbar } from "@/components/layout/Navbar";
import { CONTACT } from "@/lib/contact";
import logoImg from "@assets/FullLogo_Transparent_NoBuffer_1772265926648.png";

type CTA = { label: string; href: string };
type Hero = { eyebrow?: string; headlineLine1?: string; headlineLine2?: string; headlineLine2Italic?: boolean; subtext?: string; portrait?: string; ctas?: CTA[] };
type BrandsBlock = { title?: string; items?: { name: string; logo?: string }[] };
type StatsBlock = { label?: string; title?: string; items?: { value: string; label: string; context?: string }[] };
type CaseStudy = { tag?: string; cardTitle?: string; modalTitle?: string; image?: string; situation?: string; whatIBuilt?: string; whatChanged?: string; metrics?: { value: string; label: string }[] };
type CaseStudiesBlock = { label?: string; title?: string; items?: CaseStudy[] };
type Testimonial = { quote?: string; name?: string; role?: string; avatar?: string };
type AboutBlock = { label?: string; title?: string; paragraphs?: string[]; pullQuote?: string; tags?: string[]; photo?: string; secondaryPhoto?: string };
type FooterBlockX = { tagline?: string; email?: string; copyright?: string; links?: { label: string; href: string }[] };
type WorkCard = { eyebrow?: string; title?: string; price?: string; description?: string; ctaLabel?: string; ctaHref?: string };
type WorkBlock = { title?: string; subtitle?: string; cards?: WorkCard[] };
type FooterBlock = FooterBlockX;

type Portfolio = {
  id: number;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  hero: Hero;
  brands: BrandsBlock;
  stats: StatsBlock;
  caseStudies: CaseStudiesBlock;
  testimonials: Testimonial[];
  about: AboutBlock;
  workWithMe: WorkBlock;
  footer: FooterBlock;
};

const BG = "#0C0A3E";
const ACCENT = "#7B1E7A";
const ACCENT_HOVER = "#9B3E9A";
const BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.6)";
const CARD = "#151340";

export default function PortfolioPage() {
  const [matchA, paramsA] = useRoute("/:slug");
  const slug = matchA ? paramsA?.slug : undefined;

  const { data: portfolio, isLoading, error } = useQuery<Portfolio>({
    queryKey: [`/api/cms/portfolios/${slug}`],
    enabled: !!slug,
    retry: false,
  });

  const [openCase, setOpenCase] = useState<number | null>(null);

  useEffect(() => {
    if (portfolio) {
      document.title = portfolio.metaTitle || `${portfolio.name} — The Story Shapers`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && portfolio.metaDescription) desc.setAttribute("content", portfolio.metaDescription);
    }
  }, [portfolio]);

  useEffect(() => {
    document.body.style.overflow = openCase !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openCase]);

  if (isLoading) {
    return <div style={{ minHeight: "100vh", backgroundColor: BG, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Switzer', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em" }}>LOADING…</div>;
  }
  if (error || !portfolio) {
    return <div style={{ minHeight: "100vh", backgroundColor: BG, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Portfolio not found</div>;
  }

  const { hero, brands, stats, caseStudies, testimonials, about, workWithMe, footer } = portfolio;

  return (
    <div style={{ backgroundColor: BG, color: "#FFFFFF", minHeight: "100vh", fontFamily: "'Switzer', sans-serif" }} data-testid={`portfolio-${portfolio.slug}`}>
      <Navbar />

      {/* BACK BUTTON */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "5.5rem 1.5rem 0" }}>
        <Link
          href="/team"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "'Switzer', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MUTED,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = MUTED)}
          data-testid="link-back-to-team"
        >
          ← Back to team
        </Link>
      </div>

      {/* HERO */}
      <section style={{ padding: "8rem 1.5rem 5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            {hero.eyebrow && (
              <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED, marginBottom: "1.5rem" }} data-testid="text-hero-eyebrow">
                {hero.eyebrow}
              </div>
            )}
            <h1 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(2.4rem, 5vw, 4.4rem)", lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "1.5rem" }} data-testid="text-hero-headline">
              <span>{hero.headlineLine1 || `${portfolio.name}.`}</span>
              {hero.headlineLine2 ? (
                <>
                  <br />
                  <span style={{ fontStyle: hero.headlineLine2Italic ? "italic" : "normal", color: hero.headlineLine2Italic ? "#FFAEDA" : "inherit" }}>
                    {hero.headlineLine2}
                  </span>
                </>
              ) : !hero.headlineLine1 ? (
                <>
                  <br />
                  <span style={{ fontStyle: "italic", color: "#FFAEDA" }}>A Story Shapers portfolio.</span>
                </>
              ) : null}
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: MUTED, maxWidth: "640px", marginBottom: "2.5rem" }} data-testid="text-hero-subtext">
              {hero.subtext || "Portfolio details are being prepared. Check back soon, or get in touch to hear about recent work."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {(hero.ctas || []).map((cta, i) => (
                <a key={i} href={cta.href} target={cta.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Switzer', sans-serif",
                    fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase",
                    padding: "0.95rem 1.5rem", borderRadius: "6px",
                    backgroundColor: i === 0 ? ACCENT : "transparent",
                    color: "#FFFFFF",
                    border: i === 0 ? `1px solid ${ACCENT}` : `1px solid ${BORDER}`,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { if (i === 0) (e.currentTarget as HTMLElement).style.backgroundColor = ACCENT_HOVER; }}
                  onMouseLeave={(e) => { if (i === 0) (e.currentTarget as HTMLElement).style.backgroundColor = ACCENT; }}
                  data-testid={`button-hero-cta-${i}`}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
          {hero.portrait && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
              style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: "16px", border: `1px solid ${BORDER}`, backgroundColor: CARD }}>
              <img src={imageSrc(hero.portrait, "lg")} onError={fallbackToOriginal(hero.portrait)} alt={portfolio.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} data-testid="img-hero-portrait" />
            </motion.div>
          )}
        </div>
      </section>

      {/* BRANDS MARQUEE */}
      {brands.items && brands.items.length > 0 && (
        <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "2.5rem 0", overflow: "hidden", backgroundColor: "#0a0833" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
              {brands.title || "Brands"}
            </div>
          </div>
          <div style={{ display: "flex", overflow: "hidden", maskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)" }}>
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", gap: "3rem", paddingRight: "3rem", flexShrink: 0 }}>
              {[...brands.items, ...brands.items].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", whiteSpace: "nowrap", color: MUTED, fontSize: "1rem" }} data-testid={`text-brand-${i}`}>
                  {b.logo && <img src={imageSrc(b.logo, "sm")} onError={fallbackToOriginal(b.logo)} alt="" style={{ width: 18, height: 18, objectFit: "contain", opacity: 0.8 }} />}
                  <span>{b.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CASE STUDIES (with interleaved testimonials) */}
      {caseStudies.items && caseStudies.items.length > 0 ? (
        <section id="work" style={{ padding: "5rem 1.5rem 6rem", maxWidth: "1280px", margin: "0 auto" }}>
          {caseStudies.label && (
            <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem" }}>
              {caseStudies.label}
            </div>
          )}
          <h2 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.2, fontWeight: 400, marginBottom: "3rem", maxWidth: "760px" }} data-testid="text-cases-title">
            {caseStudies.title || "Selected work"}
          </h2>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {caseStudies.items.map((c, i) => {
              const t = testimonials?.[i];
              return (
                <div key={i} style={{ display: "grid", gap: "1.25rem" }}>
                  <motion.button initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
                    onClick={() => setOpenCase(i)}
                    style={{
                      textAlign: "left", padding: 0, backgroundColor: CARD, border: `1px solid ${BORDER}`,
                      borderRadius: "12px", color: "#FFFFFF", cursor: "pointer", transition: "all 0.2s",
                      display: "grid", gridTemplateColumns: c.image ? "1fr" : "1fr", overflow: "hidden",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,174,218,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                    data-testid={`case-card-${i}`}
                  >
                    {c.image && (
                      <div style={{ width: "100%", aspectRatio: "16/6", overflow: "hidden", borderBottom: `1px solid ${BORDER}` }}>
                        <img src={imageSrc(c.image, "full")} onError={fallbackToOriginal(c.image)} alt={c.cardTitle || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} data-testid={`img-case-${i}`} />
                      </div>
                    )}
                    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>
                        {c.tag}
                      </div>
                      <div style={{ fontFamily: "'Zodiak', serif", fontSize: "1.4rem", lineHeight: 1.3, fontWeight: 400 }}>
                        {c.cardTitle}
                      </div>
                      {c.metrics && c.metrics.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "0.5rem" }}>
                          {c.metrics.map((m, mi) => (
                            <div key={mi}>
                              <div style={{ fontFamily: "'Zodiak', serif", fontSize: "1.4rem", color: "#FFAEDA" }}>{m.value}</div>
                              <div style={{ fontSize: "0.75rem", color: MUTED }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFAEDA", marginTop: "0.5rem" }}>
                        Read full case →
                      </span>
                    </div>
                  </motion.button>

                  {t && t.quote && (
                    <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                      style={{ padding: "1.75rem 2rem", borderLeft: `3px solid ${ACCENT}`, margin: "0 0 0 1rem", backgroundColor: "rgba(123,30,122,0.08)", borderRadius: "0 12px 12px 0" }}
                      data-testid={`testimonial-${i}`}
                    >
                      <p style={{ fontFamily: "'Zodiak', serif", fontSize: "1.05rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: "1rem", color: "rgba(255,255,255,0.92)" }}>
                        "{t.quote}"
                      </p>
                      <footer style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        {t.avatar ? (
                          <img src={imageSrc(t.avatar, "sm")} onError={fallbackToOriginal(t.avatar)} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Switzer', sans-serif", fontSize: "0.65rem", color: "#fff" }}>
                            {(t.name || "").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{t.name}</div>
                          <div style={{ fontSize: "0.7rem", color: MUTED }}>{t.role}</div>
                        </div>
                      </footer>
                    </motion.blockquote>
                  )}
                </div>
              );
            })}

            {/* Any extra testimonials beyond case-study count appear after the last case */}
            {testimonials && testimonials.length > caseStudies.items.length &&
              testimonials.slice(caseStudies.items.length).map((t, i) => (
                <motion.blockquote key={`extra-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                  style={{ padding: "1.75rem 2rem", borderLeft: `3px solid ${ACCENT}`, margin: "0 0 0 1rem", backgroundColor: "rgba(123,30,122,0.08)", borderRadius: "0 12px 12px 0" }}
                  data-testid={`testimonial-extra-${i}`}
                >
                  <p style={{ fontFamily: "'Zodiak', serif", fontSize: "1.05rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: "1rem", color: "rgba(255,255,255,0.92)" }}>
                    "{t.quote}"
                  </p>
                  <footer style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Switzer', sans-serif", fontSize: "0.65rem", color: "#fff" }}>
                      {(t.name || "").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: "0.7rem", color: MUTED }}>{t.role}</div>
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
          </div>
        </section>
      ) : (
        <section id="work" style={{ padding: "5rem 1.5rem 6rem", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem" }}>
            Selected work
          </div>
          <h2 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.2, fontWeight: 400, marginBottom: "1rem" }}>
            Case studies coming soon.
          </h2>
          <p style={{ color: MUTED, fontSize: "1rem", maxWidth: "560px" }}>
            New work is being prepared for this portfolio. In the meantime, get in touch to hear about recent projects.
          </p>
        </section>
      )}

      {/* ABOUT */}
      {about && about.paragraphs && about.paragraphs.length > 0 ? (
        <section id="about" style={{ padding: "6rem 1.5rem", maxWidth: "1080px", margin: "0 auto" }}>
          {about.label && (
            <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem" }}>
              {about.label}
            </div>
          )}
          <h2 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.2, fontWeight: 400, marginBottom: "2.5rem" }} data-testid="text-about-title">
            {about.title}
          </h2>
          <div className={about.photo ? "grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-12 items-start" : "grid grid-cols-1 gap-12 items-start"}>
            <div>
              {about.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.85)", marginBottom: "1.25rem" }} data-testid={`text-about-paragraph-${i}`}>
                  {p}
                </p>
              ))}
              {about.pullQuote && (
                <blockquote style={{ borderLeft: `3px solid ${ACCENT}`, padding: "0.5rem 0 0.5rem 1.25rem", margin: "2rem 0", fontFamily: "'Zodiak', serif", fontStyle: "italic", fontSize: "1.25rem", lineHeight: 1.5, color: "#FFAEDA" }} data-testid="text-about-pullquote">
                  "{about.pullQuote}"
                </blockquote>
              )}
              {about.tags && about.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem" }}>
                  {about.tags.map((t, i) => (
                    <span key={i} style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.5rem 0.85rem", borderRadius: "999px", border: `1px solid ${BORDER}`, color: MUTED }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {about.photo && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: "12px", border: `1px solid ${BORDER}` }}>
                  <img src={imageSrc(about.photo, "lg")} onError={fallbackToOriginal(about.photo)} alt={portfolio.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} data-testid="img-about-photo" />
                </div>
                {about.secondaryPhoto && (
                  <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: "12px", border: `1px solid ${BORDER}` }}>
                    <img src={imageSrc(about.secondaryPhoto, "lg")} onError={fallbackToOriginal(about.secondaryPhoto)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} data-testid="img-about-secondary" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section id="about" style={{ padding: "6rem 1.5rem", maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, marginBottom: "1rem" }}>
            About
          </div>
          <h2 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.2, fontWeight: 400, marginBottom: "1rem" }}>
            More about {portfolio.name} is on the way.
          </h2>
          <p style={{ color: MUTED, fontSize: "1rem", maxWidth: "560px" }}>
            A fuller bio is being written. In the meantime, see the homepage for context on the collective.
          </p>
        </section>
      )}

      {/* WORK WITH ME */}
      {workWithMe && workWithMe.cards && workWithMe.cards.length > 0 && (
        <section style={{ padding: "5rem 1.5rem", borderTop: `1px solid ${BORDER}`, backgroundColor: "#0a0833" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.2, fontWeight: 400, marginBottom: "1rem" }} data-testid="text-work-title">
              {workWithMe.title}
            </h2>
            {workWithMe.subtitle && (
              <p style={{ fontSize: "1.05rem", color: MUTED, marginBottom: "3rem", maxWidth: "720px", lineHeight: 1.6 }}>
                {workWithMe.subtitle}
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {workWithMe.cards.map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{ padding: "2rem", backgroundColor: CARD, borderRadius: "12px", border: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: "0.85rem" }}
                  data-testid={`work-card-${i}`}>
                  {card.eyebrow && (
                    <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#FFAEDA" }}>
                      {card.eyebrow}
                    </div>
                  )}
                  <h3 style={{ fontFamily: "'Zodiak', serif", fontSize: "1.35rem", lineHeight: 1.3 }}>{card.title}</h3>
                  {card.price && <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.7rem", color: MUTED, letterSpacing: "0.05em" }}>{card.price}</div>}
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(255,255,255,0.78)", flex: 1 }}>{card.description}</p>
                  {card.ctaHref && (
                    <a href={card.ctaHref} target={card.ctaHref.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFAEDA", textDecoration: "none", marginTop: "0.5rem" }}
                      data-testid={`button-work-cta-${i}`}>
                      {card.ctaLabel || "Get in touch →"}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!workWithMe || !workWithMe.cards || workWithMe.cards.length === 0 ? (
        <section style={{ padding: "5rem 1.5rem", borderTop: `1px solid ${BORDER}`, backgroundColor: "#0a0833", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Zodiak', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.2, fontWeight: 400, marginBottom: "1rem" }}>
            Want to work with {portfolio.name}?
          </h2>
          <p style={{ color: MUTED, fontSize: "1rem", marginBottom: "1.5rem", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            Tell us what you're working on and we'll come back with how we'd approach it.
          </p>
          {/* Was "Get in touch →" pointing at bare /contact — a third phrase for
              the one action the rest of the site calls "Start a conversation",
              landing on the job-application form rather than the client one. */}
          <a href={CONTACT.form} style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.95rem 1.5rem", borderRadius: "6px", backgroundColor: ACCENT, color: "#FFFFFF", border: `1px solid ${ACCENT}`, textDecoration: "none", display: "inline-block" }}
            data-testid="button-work-fallback-contact">
            Start a conversation →
          </a>
        </section>
      ) : null}

      {/* FOOTER — matches homepage footer */}
      <footer
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#0C0A3E",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "#FFFFFF",
        }}
        data-testid="footer"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-[1]">
          <img
            src={logoImg}
            alt="The Story Shapers"
            style={{ height: "32px", width: "auto", filter: "invert(1) brightness(2)", marginBottom: "1rem", display: "inline-block" }}
            data-testid="img-footer-logo"
          />
          {footer.tagline && (
            <div style={{ fontFamily: "'Zodiak', serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", fontStyle: "italic", marginBottom: "1rem" }} data-testid="text-footer-tagline">
              {footer.tagline}
            </div>
          )}
          <a
            href={`mailto:${footer.email || "hello@storyshaperscollective.com"}`}
            style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "block", marginBottom: footer.links && footer.links.length ? "1rem" : "1.5rem" }}
            data-testid="link-footer-email"
          >
            {footer.email || "hello@storyshaperscollective.com"}
          </a>
          {footer.links && footer.links.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {footer.links.map((l, i) => (
                <a key={i} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                  data-testid={`link-footer-${i}`}>
                  {l.label}
                </a>
              ))}
            </div>
          )}
          <p style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem", opacity: 0.4 }}>
            {footer.copyright || "© 2026 The Story Shapers. All rights reserved."}
          </p>
        </div>
      </footer>

      {/* CASE STUDY MODAL */}
      <AnimatePresence>
        {openCase !== null && caseStudies.items && caseStudies.items[openCase] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpenCase(null)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflowY: "auto" }}
            data-testid="case-modal">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: BG, color: "#fff", maxWidth: "780px", width: "100%", maxHeight: "90vh", overflowY: "auto", borderRadius: "12px", border: `1px solid ${BORDER}`, padding: "2.5rem", position: "relative" }}>
              <button onClick={() => setOpenCase(null)} aria-label="Close"
                style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", padding: "0.5rem" }}
                data-testid="button-close-case-modal">×</button>
              {(() => {
                const c = caseStudies.items![openCase];
                return (
                  <>
                    {c.tag && <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#FFAEDA", marginBottom: "1rem" }}>{c.tag}</div>}
                    <h3 style={{ fontFamily: "'Zodiak', serif", fontSize: "1.8rem", lineHeight: 1.25, marginBottom: "2rem", fontWeight: 400 }}>{c.modalTitle || c.cardTitle}</h3>
                    {c.situation && (
                      <CaseBlock label="The situation">{c.situation}</CaseBlock>
                    )}
                    {c.image && (
                      <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: "8px", marginBottom: "1.5rem", border: `1px solid ${BORDER}` }}>
                        <img src={imageSrc(c.image, "full")} onError={fallbackToOriginal(c.image)} alt={c.cardTitle || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    {c.whatIBuilt && (
                      <CaseBlockHtml label="What I built">{c.whatIBuilt}</CaseBlockHtml>
                    )}
                    {c.whatChanged && (
                      <CaseBlock label="What changed">{c.whatChanged}</CaseBlock>
                    )}
                    {c.metrics && c.metrics.length > 0 && (
                      <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                        {c.metrics.map((m, mi) => (
                          <div key={mi} style={{ padding: "1rem", borderRadius: "8px", border: `1px solid ${BORDER}`, backgroundColor: CARD }}>
                            <div style={{ fontFamily: "'Zodiak', serif", fontSize: "1.5rem", color: "#FFAEDA" }}>{m.value}</div>
                            <div style={{ fontSize: "0.75rem", color: MUTED, marginTop: "0.25rem" }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CaseBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>{children}</p>
    </div>
  );
}

function CaseBlockHtml({ label, children }: { label: string; children: string }) {
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(children);
  if (!looksLikeHtml) {
    return <CaseBlock label={label}>{children}</CaseBlock>;
  }
  const sanitized = DOMPurify.sanitize(children, { ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "code", "pre"], ALLOWED_ATTR: ["href", "target", "rel"] });
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div className="portfolio-rich" style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }} dangerouslySetInnerHTML={{ __html: sanitized }} />
    </div>
  );
}

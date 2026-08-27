import { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { apiRequest } from "@/lib/queryClient";
import { useCmsSettings } from "@/hooks/use-cms";
import { CONTACT, mailto, whatsappHref } from "@/lib/contact";

/**
 * The way out of the form, for the people who were never going to fill it.
 *
 * These two addresses lived only on the homepage's closing act. So the site's
 * whole conversion path — hero button, navbar, closing act, every card that
 * says "talk to us" — delivered a reader to this page and then offered exactly
 * one way to speak to anyone: fill four fields and wait. Someone who wants to
 * ask one quick question, or who simply does not trust a form, had to go back
 * to the homepage and scroll to the bottom to find an email address.
 *
 * It sits OUTSIDE the submitted/unsubmitted branch on purpose, so it is also
 * the answer to "message received, now what" — the offer page already does
 * this, and it is the better pattern: a form is a slow channel, and the people
 * most worth talking to are usually the least patient.
 *
 * Quiet on purpose. The form stays the primary action; this is the escape
 * hatch, not a competing offer.
 */
function DirectRoutes() {
  return (
    <div
      className="mt-6 flex flex-col items-start gap-1"
      style={{ fontFamily: "'Switzer', sans-serif" }}
      data-testid="contact-direct-routes"
    >
      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
        Rather not fill a form? Reach us directly.
      </span>
      <span className="flex flex-col items-start gap-x-[0.85rem] gap-y-0.5 sm:flex-row sm:flex-wrap sm:items-baseline">
        <a
          href={mailto}
          style={{
            fontSize: "0.92rem",
            color: "rgba(255,255,255,0.9)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            paddingBottom: "0.1rem",
          }}
          data-testid="link-contact-email"
        >
          {CONTACT.email}
        </a>
        {whatsappHref && (
          <>
            <span
              aria-hidden="true"
              className="hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.34)" }}
            >
              ·
            </span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.92rem",
                color: "rgba(255,255,255,0.9)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: "0.1rem",
              }}
              data-testid="link-contact-whatsapp"
            >
              {CONTACT.whatsappLabel}
            </a>
          </>
        )}
      </span>
    </div>
  );
}

/**
 * Which service door the reader came through, if they came through one.
 *
 * Read off `?stage=` — the Services section on the homepage sends
 * /contact?stage=shape#talk and friends, so the enquiry arrives knowing
 * whether this is a Shape problem or a Sharpen one.
 *
 * The allowlist is the point. This value is rendered on the page and posted
 * into an email and a Slack message, and the query string is attacker-supplied:
 * anyone can send someone a /contact?stage=<whatever> link. Mapping three known
 * ids to three known labels means an unknown value is simply nothing, rather
 * than arbitrary text arriving in Fatema's inbox wearing the site's voice.
 */
const STAGE_LABELS: Record<string, string> = {
  shape: "Shape",
  scale: "Scale",
  sharpen: "Sharpen",
};

function stageFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("stage");
  return (raw && STAGE_LABELS[raw]) || null;
}

function SectionDivider() {
  return (
    <div
      className="my-16 md:my-20"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
      <span
        style={{
          fontFamily: "'Switzer', sans-serif",
          fontSize: "0.5rem",
          color: "rgba(255, 255, 255, 0.25)",
          letterSpacing: "0.3em",
        }}
      >
        &#9830;
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "'Switzer', sans-serif",
  fontSize: "0.9rem",
  color: "#FFFFFF",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "8px",
  padding: "0.85rem 1rem",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s, background-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Switzer', sans-serif",
  fontSize: "0.6rem",
  color: "rgba(255, 255, 255, 0.65)",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  display: "block",
  marginBottom: "0.5rem",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical" as const,
};

function FormInput({ label, name, type = "text", placeholder, required = true, testId }: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  testId: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        onFocus={e => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
        }}
        data-testid={testId}
      />
    </div>
  );
}

function FormTextarea({ label, name, placeholder, required = true, testId }: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  testId: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        style={textareaStyle}
        onFocus={e => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
        }}
        data-testid={testId}
      />
    </div>
  );
}

export default function Contact() {
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [talkSubmitted, setTalkSubmitted] = useState(false);
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [talkSubmitting, setTalkSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Read once on mount rather than per render: the query string does not change
     without a navigation, and a navigation remounts this page. */
  const [stage] = useState(stageFromUrl);
  const { data: settings } = useCmsSettings();
  const cms = settings?.contact as {
    joinHeadingMain?: string;
    joinHeadingItalic?: string;
    joinIntro?: string;
    joinSuccessTitle?: string;
    joinSuccessBody?: string;
    talkHeadingMain?: string;
    talkHeadingItalic?: string;
    talkIntro?: string;
    talkSuccessTitle?: string;
    talkSuccessBody?: string;
  } | undefined;

  /**
   * Landing on the section the link asked for.
   *
   * This page carries two forms: "Let's Talk" for clients, "Join the
   * Collective" for people who want to work here. Client intent is now first,
   * so a bare /contact lands on the right one — but the hash still has to work,
   * because /join sends applicants to #join and the whole site's conversion
   * path sends clients to #talk.
   *
   * The previous version fired once on mount, on a 300ms timer, with smooth
   * behaviour, and it silently failed on every in-app click: the scroll was
   * requested (scrollIntoView really was called on #talk) and then lost, while
   * the reader sat at the top of the application form. A single deferred smooth
   * scroll is the fragile part — it animates across a route change, and
   * anything that touches the scroll position while it is in flight cancels it.
   *
   * So: jump rather than glide, and check the landing more than once instead of
   * assuming a single request wins. Arriving at a page is not a moment to
   * animate anyway — a smooth scroll here means watching the job form slide
   * past on the way down.
   *
   * Keyed on `location` because a client-side navigation remounts nothing on a
   * hash-only change and the mount-once version could not see it.
   */
  const [location] = useLocation();
  useEffect(() => {
    /* Give up the moment the reader takes over — a retry that fights a real
       scroll is worse than a missed landing. */
    let reader = false;
    let done = false;
    const yieldToReader = () => {
      reader = true;
    };
    const opts = { passive: true } as const;
    window.addEventListener("wheel", yieldToReader, opts);
    window.addEventListener("touchstart", yieldToReader, opts);
    window.addEventListener("keydown", yieldToReader);

    /* Timers rather than animation frames, and three of them.
       0ms because on an in-app click the hash is not on the URL yet when this
       effect runs — the router commits React's render before it writes the
       address, so reading the hash synchronously here finds nothing. That one
       missing tick is what made the button look like it worked: the URL ended
       up right, and nothing had scrolled. The later two are for the layout
       settling underneath the landing, mostly images arriving.
       Not requestAnimationFrame: it does not fire at all in a background tab,
       which is exactly where a middle-click or a restored session lands. */
    const attempt = () => {
      if (done || reader) return;
      const id = window.location.hash.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      if (Math.abs(el.getBoundingClientRect().top) > 2) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    };
    const timers = [0, 120, 400].map((d) => window.setTimeout(attempt, d));

    return () => {
      done = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", yieldToReader);
      window.removeEventListener("touchstart", yieldToReader);
      window.removeEventListener("keydown", yieldToReader);
    };
  }, [location]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setJoinSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    formData.forEach((val, key) => { data[key] = val as string; });
    try {
      await apiRequest("POST", "/api/forms/submit", { formType: "join", data });
      setJoinSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setJoinSubmitting(false);
    }
  };

  const handleTalkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTalkSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    formData.forEach((val, key) => { data[key] = val as string; });
    try {
      await apiRequest("POST", "/api/forms/submit", { formType: "talk", data });
      setTalkSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setTalkSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh" }}>
      <Navbar />

      <div
        className="relative px-2 md:px-4 lg:px-6 pt-24 pb-4"
        style={{ backgroundColor: "#0C0A3E" }}
      >
        <div
          style={{
            backgroundColor: "#0C0A3E",
            borderRadius: "20px",
            padding: "clamp(2rem, 5vw, 5rem)",
          }}
        >
          <div className="max-w-[800px] mx-auto">
            {/* The page had no h1 anywhere — it opens on a back link and then
                two numbered cards, so its two headings were both h2 under
                nothing. Named rather than styled, because what the page needs
                is a title and not a hero; the same thing the homepage does with
                its own h1 behind the film. */}
            <h1 className="sr-only">Contact The Story Shapers</h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-12 group"
                style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontSize: "0.65rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                data-testid="link-back-home"
              >
                <span style={{ transition: "transform 0.2s", display: "inline-block" }} className="group-hover:-translate-x-1">
                  &larr;
                </span>
                BACK TO HOME
              </Link>
            </motion.div>

            <motion.div
              id="talk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Switzer', sans-serif",
                      fontSize: "0.5rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontWeight: 600,
                    }}
                  >
                    01
                  </span>
                </div>
                <h2
                  style={{
                    color: "#FFFFFF",
                    lineHeight: 1.15,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Zodiak', serif",
                      fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                      fontWeight: 400,
                    }}
                  >
                    {cms?.talkHeadingMain ?? "Let's"}{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Switzer', sans-serif",
                      fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      opacity: 0.8,
                    }}
                  >
                    {cms?.talkHeadingItalic ?? "Talk"}
                  </span>
                </h2>
              </div>

              <p
                className="mb-8"
                style={{
                  fontFamily: "'Zodiak', serif",
                  fontSize: "clamp(0.88rem, 1.15vw, 0.98rem)",
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 2,
                }}
              >
                {cms?.talkIntro ?? "Got a challenge that needs clarity? Tell us what you're working on and we'll figure out how we can help."}
              </p>

              {talkSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "14px",
                    padding: "2.5rem 2rem",
                    textAlign: "center",
                  }}
                  data-testid="text-talk-success"
                >
                  <p
                    style={{
                      fontFamily: "'Zodiak', serif",
                      fontSize: "1.1rem",
                      color: "#FFFFFF",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {cms?.talkSuccessTitle ?? "Message received."}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Switzer', sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {cms?.talkSuccessBody ?? "We'll be in touch soon to start the conversation."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleTalkSubmit} data-testid="form-talk">
                  {/* Carried from the Services stage they clicked. Shown as
                      well as sent — a field that reaches her inbox should not
                      be one the sender never saw. */}
                  {stage && (
                    <>
                      <input type="hidden" name="stage" value={stage} />
                      <p
                        className="mb-4"
                        style={{
                          fontFamily: "'Switzer', sans-serif",
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.6)",
                        }}
                        data-testid="text-talk-stage"
                      >
                        Starting with{" "}
                        <span style={{ color: "#cf81cd" }}>{stage}</span>.
                      </p>
                    </>
                  )}
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "14px",
                      padding: "1.75rem",
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <FormInput
                        label="Your Name"
                        name="name"
                        placeholder="Full name"
                        testId="input-talk-name"
                      />
                      <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        testId="input-talk-email"
                      />
                    </div>

                    <div className="mb-5">
                      <FormInput
                        label="Company / Brand"
                        name="company"
                        placeholder="Your company or brand name"
                        required={false}
                        testId="input-talk-company"
                      />
                    </div>

                    <div className="mb-6">
                      <FormTextarea
                        label="What are you working on?"
                        name="message"
                        placeholder="Tell us about your challenge, project, or what you're trying to figure out..."
                        testId="input-talk-message"
                      />
                    </div>

                    {error && (
                      <p style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.8rem", color: "#f87171", marginBottom: "0.75rem" }}>{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={talkSubmitting}
                      style={{
                        fontFamily: "'Switzer', sans-serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        color: "#FFFFFF",
                        backgroundColor: "#7B1E7A",
                        border: "none",
                        borderRadius: "8px",
                        padding: "1rem 2.5rem",
                        cursor: talkSubmitting ? "wait" : "pointer",
                        transition: "all 0.2s",
                        width: "100%",
                        opacity: talkSubmitting ? 0.7 : 1,
                      }}
                      onMouseEnter={e => { if (!talkSubmitting) e.currentTarget.style.backgroundColor = "#9B3E9A"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#7B1E7A"; }}
                      data-testid="button-submit-talk"
                    >
                      {talkSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                  </div>
                </form>
              )}

              <DirectRoutes />
            </motion.div>

            <SectionDivider />

            <motion.div
              id="join"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Switzer', sans-serif",
                      fontSize: "0.5rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontWeight: 600,
                    }}
                  >
                    02
                  </span>
                </div>
                <h2
                  style={{
                    color: "#FFFFFF",
                    lineHeight: 1.15,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Zodiak', serif",
                      fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                      fontWeight: 400,
                    }}
                  >
                    {cms?.joinHeadingMain ?? "Join the"}{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Switzer', sans-serif",
                      fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      opacity: 0.8,
                    }}
                  >
                    {cms?.joinHeadingItalic ?? "Collective"}
                  </span>
                </h2>
              </div>

              <p
                className="mb-8"
                style={{
                  fontFamily: "'Zodiak', serif",
                  fontSize: "clamp(0.88rem, 1.15vw, 0.98rem)",
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 2,
                }}
              >
                {cms?.joinIntro ?? "Fill the form thoughtfully. Tell us what you're good at, what you want to do more of, and how you like to work."}
              </p>

              {joinSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "14px",
                    padding: "2.5rem 2rem",
                    textAlign: "center",
                  }}
                  data-testid="text-join-success"
                >
                  <p
                    style={{
                      fontFamily: "'Zodiak', serif",
                      fontSize: "1.1rem",
                      color: "#FFFFFF",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {cms?.joinSuccessTitle ?? "Thank you for reaching out."}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Switzer', sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {cms?.joinSuccessBody ?? "We'll review your submission and get back to you shortly."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleJoinSubmit} data-testid="form-join">
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "14px",
                      padding: "1.75rem",
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <FormInput
                        label="Your Name"
                        name="name"
                        placeholder="Full name"
                        testId="input-join-name"
                      />
                      <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        testId="input-join-email"
                      />
                    </div>

                    <div className="mb-5">
                      <FormTextarea
                        label="What are you good at?"
                        name="expertise"
                        placeholder="Your core expertise and skills — brand strategy, content, SEO, community, etc."
                        testId="input-join-expertise"
                      />
                    </div>

                    <div className="mb-5">
                      <FormTextarea
                        label="What do you want to do more of?"
                        name="aspirations"
                        placeholder="The kind of work that lights you up..."
                        testId="input-join-aspirations"
                      />
                    </div>

                    <div className="mb-6">
                      <FormTextarea
                        label="How do you like to work?"
                        name="workstyle"
                        placeholder="Your ideal working rhythm, collaboration style, availability..."
                        testId="input-join-workstyle"
                      />
                    </div>

                    {error && (
                      <p style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.8rem", color: "#f87171", marginBottom: "0.75rem" }}>{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={joinSubmitting}
                      style={{
                        fontFamily: "'Switzer', sans-serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        color: "#FFFFFF",
                        backgroundColor: "#7B1E7A",
                        border: "none",
                        borderRadius: "8px",
                        padding: "1rem 2.5rem",
                        cursor: joinSubmitting ? "wait" : "pointer",
                        transition: "all 0.2s",
                        width: "100%",
                        opacity: joinSubmitting ? 0.7 : 1,
                      }}
                      onMouseEnter={e => { if (!joinSubmitting) e.currentTarget.style.backgroundColor = "#9B3E9A"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#7B1E7A"; }}
                      data-testid="button-submit-join"
                    >
                      {joinSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            <div style={{ height: "4rem" }} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

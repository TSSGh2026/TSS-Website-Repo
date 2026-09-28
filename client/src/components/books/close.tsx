import { useEffect, useRef, useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/queryClient";
import { BOOKS, EMAIL, PHONE } from "./content";
import { mailFor, Reveal, setChoice, useChoice, whatsappFor, Wrap } from "./site";

const CHOICES: Array<{ id: string; label: string; ask: string | null }> = [
  ...BOOKS.map((b) => ({ id: b.id, label: b.name, ask: b.ask })),
  { id: "unsure", label: "Not sure yet", ask: null },
];

const field =
  "w-full border-b border-paper/25 bg-transparent py-3 text-[16px] text-paper placeholder:text-paper/50 outline-none transition-colors focus:border-magenta-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta-soft aria-[invalid=true]:border-[#ff9bd0]";

type Errors = Partial<Record<"name" | "reach", string>>;

function validate(name: string, reach: string): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Your name, please.";
  const r = reach.trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r);
  const phone = r.replace(/\D/g, "").length >= 8;
  if (!email && !phone) errors.reach = "An email address or a phone number with its country code.";
  return errors;
}

/** The close. Say who you are and what you have in mind; or skip the form and message us. */
export function Close() {
  const choice = useChoice();
  const ask = choice?.ask ?? null;
  const [name, setName] = useState("");
  const [reach, setReach] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  // once sent, the form is replaced; move focus to the thank-you so it is read out and in view
  useEffect(() => {
    if (done) sentRef.current?.focus();
  }, [done]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const found = validate(name, reach);
    setErrors(found);
    if (Object.keys(found).length) {
      // take the visitor to the first field that needs them
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    setFailed(false);
    setSending(true);
    try {
      /* The site's generic submissions endpoint: saved to form_submissions, then the
         notification email and Slack. `data` is a jsonb bag, so every value is a plain
         string. Non-offer forms are emailed key by key in this order, so the keys are
         written to read well as labels. */
      const book = CHOICES.find((c) => c.id === choice?.id);
      const r = reach.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r);
      await apiRequest("POST", "/api/forms/submit", {
        formType: "books",
        data: {
          book: book ? book.label : "Not chosen",
          name: name.trim(),
          // `email` is the key the notification email sets as reply-to, so a reply goes straight to them
          ...(isEmail ? { email: r } : { phone: r }),
          story: note.trim(),
          referrer: document.referrer || "direct",
        },
      });
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="start" className="relative scroll-mt-[84px] overflow-hidden bg-ink-deep text-paper">
      <div aria-hidden className="books-grain pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-screen" />
      <Wrap className="relative pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <Reveal>
            <p className="kicker text-magenta-soft">Start a conversation</p>
            <h2 className="display mt-6 text-[36px] leading-[1.06] md:text-[60px] md:leading-[1.02]" style={{ textWrap: "balance" }}>
              Tell us whose story it is.
            </h2>
            <p className="measure mt-6 text-[17px] leading-[1.7] text-paper/65 md:text-[19px]">
              A parent, a family, a founder or a company. After a first conversation, you will know what the
              book could be.
            </p>
            <div className="mt-10 space-y-2 text-[15px] text-paper/60">
              <p>
                Or message us directly:{" "}
                <a href={whatsappFor(ask)} className="text-paper underline decoration-paper/30 underline-offset-4 hover:text-magenta-soft">
                  WhatsApp
                </a>{" "}
                &middot;{" "}
                <a href={mailFor(ask)} className="text-paper underline decoration-paper/30 underline-offset-4 hover:text-magenta-soft">
                  Email
                </a>
              </p>
              <p className="text-paper/45">
                {PHONE} &middot; {EMAIL}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            {done ? (
              <div ref={sentRef} tabIndex={-1} className="scroll-mt-[84px] border border-paper/15 p-6 outline-none md:p-9" role="status">
                <p className="kicker text-[10px] text-magenta-soft">Sent</p>
                <p className="display mt-4 text-[30px] leading-[1.15] md:text-[36px]">Thank you, {name.trim().split(" ")[0]}.</p>
                <p className="mt-4 text-[16px] leading-[1.7] text-paper/70">
                  Your note is with us, and we will be in touch at {reach.trim()}.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={send} noValidate className="border border-paper/15 p-6 md:p-9">
                <fieldset>
                  <legend className="kicker text-[10px] text-paper/55">What do you have in mind?</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {CHOICES.map((c) => {
                      const on = choice?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setChoice(on ? null : { id: c.id, ask: c.ask })}
                          className={`border px-3.5 py-2 text-[14px] transition-colors duration-300 ${
                            on
                              ? "border-magenta-soft bg-magenta-soft text-ink"
                              : "border-paper/25 text-paper/80 hover:border-paper/60 hover:text-paper"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="kicker text-[10px] text-paper/55">Your name</span>
                    <input
                      className={`${field} scroll-mt-[120px]`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "err-name" : undefined}
                    />
                    {errors.name && (
                      <span id="err-name" className="mt-2 block text-[13px] text-[#ff9bd0]">
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="kicker text-[10px] text-paper/55">Email or phone</span>
                    <input
                      className={`${field} scroll-mt-[120px]`}
                      value={reach}
                      onChange={(e) => setReach(e.target.value)}
                      aria-invalid={Boolean(errors.reach)}
                      aria-describedby={errors.reach ? "err-reach" : undefined}
                    />
                    {errors.reach && (
                      <span id="err-reach" className="mt-2 block text-[13px] text-[#ff9bd0]">
                        {errors.reach}
                      </span>
                    )}
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className="kicker text-[10px] text-paper/55">Whose story, and why now?</span>
                  <textarea
                    rows={3}
                    className={`${field} resize-none`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={BOOKS.find((b) => b.id === choice?.id)?.example ?? "Tell us whose story it is, and why you're thinking about it now."}
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="group mt-9 inline-flex w-full items-center justify-between gap-3 bg-paper px-7 py-5 text-[13px] font-medium tracking-[0.06em] text-ink uppercase transition-colors duration-300 hover:bg-magenta-soft disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:justify-start"
                >
                  {sending ? "Sending" : "Send"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </button>
                {failed && (
                  <p role="alert" className="mt-4 text-[13px] leading-[1.5] text-[#ff9bd0]">
                    That didn't go through. Try once more, or write to {EMAIL} or WhatsApp us.
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

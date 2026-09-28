import { Link } from "wouter";
import { CtaButton } from "../cta-button";
import { Highlight } from "../highlight";
import { Reveal } from "../reveal";
import { Section } from "../section";

/**
 * The subtext, on its own. One sentence, one button, one line of fine print.
 */
export function TheOfferLine() {
  return (
    <Section eyebrow="THE OFFER" className="bg-navy-lift">
      <Reveal>
        <p className="o-display max-w-[30ch] text-[30px] leading-[1.16] [text-wrap:pretty] sm:text-[40px] md:text-[50px]">
          We shape your brand’s story
          <span className="font-body font-light text-white/70">
            {" "}
            and build you a high-functioning website around it at{" "}
            {/* The price is the whole offer — it gets the same drawn rule as
                the 45+ years in "Why us", and nothing else on the page does. */}
            <Highlight>₹80,000*</Highlight> all in.
          </span>
        </p>
      </Reveal>

      <Reveal delay={3}>
        <div className="mt-12 flex flex-col items-start gap-5 md:mt-14 md:flex-row md:items-center md:gap-8">
          <CtaButton />
          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[1.6px] text-white/45">
            *Up to five pages, live in 10 working days
            <span className="mx-2 text-white/25">·</span>
            <Link href="/offer/terms" className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/80">
              Terms
            </Link>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

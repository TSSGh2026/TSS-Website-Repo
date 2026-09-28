import { Link, useLocation } from "wouter";
import logoImg from "@assets/FullLogo_Transparent_NoBuffer_1772265926648.png";
import { CONTACT, mailto } from "@/lib/contact";

const NAVY = "#0C0A3E";
const MONO = "ui-monospace, monospace";

/**
 * The three portfolio pages, which are prerendered routes (see PORTFOLIO_SLUGS
 * in App.tsx and the route list in script/prerender.ts) and until now had one
 * way in from the entire site: a card on /team. Names spelled as the homepage's
 * peak spells them, because a person's name reading two ways on one site is the
 * kind of small wrongness a reader notices without being able to name.
 */
const SHAPERS = [
  { slug: "fatema", name: "Fatema Hanif" },
  { slug: "shaili", name: "Shaili Contractor" },
  { slug: "aakanksha", name: "Aakanksha Singh Devi" },
];

/**
 * The site footer.
 *
 * THE CLOSE IS THE INVITATION; THIS IS THE MAP. Every item here has to be
 * somewhere to GO. That is the rule the previous version broke.
 *
 * WHAT WAS WRONG WITH IT (Fatema, 25 Aug: "the footer is repeating the same
 * thing that's already there in the last section"). Measured rather than
 * argued, with live/footermap.mjs:
 *
 *   - a column headed START SOMETHING held two things. One was the email,
 *     printed 258px below the close's own print of it. The other was "Tell us
 *     your story" pointing at `#act-close` — a footer link that scrolls the
 *     reader BACKWARDS into the section they just left. It was the only item
 *     in the footer that was not a destination.
 *   - meanwhile SIX real pages had no link here at all: /team, /contact,
 *     /offer, and all three Shaper portfolios. The contact page is where the
 *     close's own button goes, and the three portfolios had exactly one route
 *     in from anywhere on the site — a card on /team.
 *   - and "The Shapers" pointed at `#act-peak` while the nav's "Team" pointed
 *     at `/team`. One idea, two destinations: from /blog the footer threw you
 *     to the homepage and scrolled instead of to the page about the team.
 *
 * So the third column stopped being a second call to action and became the
 * people, which is the one thing this site claims and the one thing that was
 * buried. The strapline directly above it says "you work with the people who
 * do the work"; these three pages are that sentence's evidence.
 *
 * THE ADDRESS STAYS, and it is the one repeat left. /contact is a form and
 * prints no address anywhere, so on the eight pages that have no close above
 * them this is the only place the email exists. It moved out of a column with
 * a heading over it — which is what made it read as a second ask — and sits
 * under the logo as what it is, contact information rather than a pitch.
 *
 * ON EVERY PAGE, NOT JUST THE HOMEPAGE. It began as home-only, which left
 * /our-story, /blog, /join, /contact and every article ending in nothing at all
 * — and on a phone, where the bar had no menu either, that was a page with no
 * way off it.
 *
 * Which makes the in-page links the one thing to be careful about. "The work"
 * is an act on the homepage rather than a route of its own, so it is
 * `#act-proof` while you are standing on it and `/#act-proof` when you are
 * not. Home reads that hash on arrival — see pages/home.tsx.
 */
export function Footer() {
  const [location] = useLocation();
  const onHome = location === "/";
  /* a bare hash scrolls; a hash on a path navigates first and then scrolls */
  const act = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <footer
      data-ground="dark"
      data-bg={NAVY}
      style={{
        backgroundColor: NAVY,
        color: "#FFFFFF",
        borderTop: "1px solid rgba(255,255,255,0.12)",
      }}
      className="px-[clamp(1.5rem,5vw,5rem)] pt-[clamp(3rem,8vh,5.5rem)] pb-[clamp(2rem,5vh,3rem)]"
      data-testid="footer"
    >
      <div className="mx-auto w-full max-w-[78rem]">
        {/* TWO COLUMNS EVEN AT 375, which the previous version could not do.
            What stopped it was hello@storyshaperscollective.com sitting inside
            a 150px column and running off the right of the screen. The address
            is not in a column any more — it is under the logo in a block that
            spans the full width — so the two LISTS can sit side by side, and
            the footer stops being 755px of a 660px phone. Measured: 599px,
            which is shorter than the SEVEN-link version it replaced. */}
        <div className="grid grid-cols-2 gap-x-[clamp(1rem,5vw,4rem)] gap-y-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <img
              src={logoImg}
              alt="The Story Shapers"
              style={{ height: "30px", width: "auto", filter: "invert(1) brightness(2)" }}
              data-testid="img-footer-logo"
            />
            <p
              className="mt-[1.4rem] mb-0 max-w-[24rem]"
              style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(255,255,255,0.62)" }}
            >
              A senior-led, full-service marketing collective. You work with the
              people who do the work.
            </p>
            {/* No heading over it, deliberately. Under START SOMETHING it read
                as a second call to action 258px below the first one; on its own
                under the logo it reads as an address. */}
            <a
              href={mailto}
              className="mt-[1.1rem] inline-block transition-colors duration-200 hover:text-[#cf81cd]"
              style={{
                color: "rgba(255,255,255,0.84)",
                textDecoration: "none",
                fontSize: "0.94rem",
                overflowWrap: "anywhere",
              }}
              data-testid="link-footer-email"
            >
              {CONTACT.email}
            </a>
          </div>

          <div>
            <K>The site</K>
            <ul className="m-0 grid list-none gap-[0.6rem] p-0">
              <Item href="/our-story">Our Story</Item>
              {/* /team, not #act-peak — the same destination the nav's "Team"
                  uses. Two names for one idea is survivable; two DESTINATIONS
                  for it is a reader landing somewhere they did not choose. */}
              <Item href="/team">Team</Item>
              <Item href={act("act-proof")}>The work</Item>
              <Item href="/books">Books &amp; biographies</Item>
              <Item href="/blog">Blog</Item>
              <Item href="/contact">Contact</Item>
              <Item href="/join">Join the collective</Item>
            </ul>
          </div>

          <div>
            <K>The Shapers</K>
            <ul className="m-0 grid list-none gap-[0.6rem] p-0">
              {SHAPERS.map((s) => (
                <Item key={s.slug} href={`/${s.slug}`}>
                  {s.name}
                </Item>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap justify-between gap-x-[1.4rem] gap-y-[0.6rem] pt-[1.4rem]"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.52)",
          }}
        >
          <span>© 2026 The Story Shapers</span>
          <span>Shaped in India, read everywhere.</span>
        </div>
      </div>
    </footer>
  );
}

function K({ children }: { children: string }) {
  return (
    <div
      className="mb-4"
      style={{
        fontFamily: MONO,
        fontSize: "0.66rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {children}
    </div>
  );
}

function Item({ href, children }: { href: string; children: string }) {
  const style = {
    color: "rgba(255,255,255,0.84)",
    textDecoration: "none",
    fontSize: "0.94rem",
    /* `anywhere`, not `break-word`. The address is one unbreakable token, and a
       grid track sizes itself to its MIN-CONTENT — which under break-word is
       still the whole string, so the column refused to shrink and the email ran
       off the right of a 768px screen. `anywhere` is the one value that also
       lowers min-content. */
    overflowWrap: "anywhere",
  } as const;
  const className = "transition-colors duration-200 hover:text-[#cf81cd]";

  /* wouter for real routes, a plain anchor for the in-page ones and mailto —
     routing "#act-peak" through the router navigates to a path that does not
     exist and the reader lands on a 404 instead of three screens up */
  const internal = href.startsWith("/");

  return (
    <li className="min-w-0">
      {internal ? (
        <Link href={href} className={className} style={style}>
          {children}
        </Link>
      ) : (
        <a href={href} className={className} style={style}>
          {children}
        </a>
      )}
    </li>
  );
}

import headoutImg from "@/assets/cases/headout.webp";
import lbbImg from "@/assets/cases/lbb.webp";
import lbbSiteBangaloreImg from "@/assets/cases/lbb-site-bangalore.webp";
import lbbSiteMumbaiImg from "@/assets/cases/lbb-site-mumbai.webp";
import tuisaImg from "@/assets/cases/tuisa.webp";
import tuisaArchiveImg from "@/assets/cases/tuisa-archive.webp";
import tuisaSiteHomeImg from "@/assets/cases/tuisa-site-home.webp";
import tuisaSiteVisitImg from "@/assets/cases/tuisa-site-visit.webp";
import socialImg from "@/assets/cases/social.webp";
import ccplImg from "@/assets/cases/ccpl.webp";
import ccplMatchImg from "@/assets/cases/ccpl-match.webp";
import ccplSidelinesImg from "@/assets/cases/ccpl-sidelines.webp";
import ccplStageImg from "@/assets/cases/ccpl-stage.webp";
import socialDeckHandsImg from "@/assets/cases/social-deck-hands.jpg";
import socialDeckMarksImg from "@/assets/cases/social-deck-marks.jpg";
import socialDeckScreenImg from "@/assets/cases/social-deck-screen.jpg";
import headoutSiteParisImg from "@/assets/cases/headout-site-paris.webp";
import postcardPerumalImg from "@/assets/cases/postcard-maison-perumal.webp";
import postcardBungalowImg from "@/assets/cases/postcard-calcutta-bungalow.webp";
import postcardAmarKhamarImg from "@/assets/cases/postcard-amar-khamar.webp";
import kellyAwayImg from "@/assets/cases/kelly-post-away.webp";
import kellyAceImg from "@/assets/cases/kelly-post-ace.webp";
import kellyCatsImg from "@/assets/cases/kelly-post-cats.webp";
import kellyZoomiesImg from "@/assets/cases/kelly-post-zoomies.webp";
import { CASE_SLUGS } from "@shared/work";

/**
 * THE CASE STUDIES.
 *
 * Copy lives here and nowhere else, so a change is one edit rather than a hunt
 * through markup. The shape is deliberately the shape of a CMS record: the site
 * still has no home for case studies in the CMS, and this is what that
 * collection would look like if it existed.
 *
 * A case has two parts. The card fields are what the homepage rail and the
 * /work list show. `full` is the page at /work/<slug>.
 *
 * NOTHING HERE IS INVENTED. Every fact has a source, named in the comment above
 * each record: a published account of the work, the founders' own published
 * portfolio pages, the client's live site, or coverage linked from the page.
 * Where two sources disagree, or a fact is not yet confirmed, it is listed in
 * ~/tss-case-studies/OPEN-QUESTIONS.md and kept off the page or kept as the
 * more modest of the two.
 *
 * HEADOUT AND LITTLE BLACK BOOK are work the three founders led inside those
 * companies, in senior roles, before the collective. Fatema's call on 9 Oct:
 * the pages do not label that or explain it. What they must still do is stay
 * true sentence by sentence: they say who led what "at Headout", they never
 * call either company a client, and they never say The Story Shapers was hired.
 */

export type CaseSection = {
  /** a small label above the title, for whose work a section is */
  kicker?: string;
  title: string;
  paras?: string[];
  /** concrete things, each one something a reader could point at */
  items?: [string, string][];
};

export type CasePicture = {
  img: string;
  alt: string;
  caption?: string;
  /** a screenshot of a page: shown at its own shape, from the top, so the
   *  site's own header is not cropped off */
  shot?: boolean;
  /** which edge of the picture the crop keeps, where the middle is wrong */
  anchor?: "right";
};

export type CaseFull = {
  /** for the page title: "<Client> Case Study: <service>" */
  service: string;
  /** one plain sentence: what was done, for whom */
  standfirst: string;
  /** who, what, when, and which of us */
  facts: { k: string; v: string; href?: string; people?: { name: string; href: string }[] }[];
  hero?: CasePicture;
  sections: CaseSection[];
  /** shown full width after the section at this index */
  /** `shape` is the frame every picture in the row is cropped to: "wide" is
   *  16:10 for screenshots, "slide" is 16:9, "square" is a social post. One
   *  picture runs the full width; four squares run four across. */
  /** `after: -1` puts the row directly under the facts, where a page has no
   *  single picture to lead with */
  pictures?: { after: number; items: CasePicture[]; shape?: "wide" | "slide" | "square" };
  /** coverage or published work, linked, so the claim can be checked */
  ran?: { title: string; items: { outlet: string; title: string; href: string }[] };
  /** grouped, so a page covering several pieces of work can put each figure
   *  under the piece it belongs to */
  results?: { title: string; groups: { who?: string; items: { fig: string; lab: string }[] }[] };
  /** whose numbers these are, and which part of them is ours */
  attribution?: string;
  quote?: { text: string; who: string; role: string; context: string };
};

export type Case = {
  id: string;
  /** the one word the card's footer carries */
  kind: string;
  client: string;
  /** the short name for the card footer, where the full one wraps */
  shortClient?: string;
  cat: string;
  /** the card's loud number */
  fig: string;
  figLab: string;
  /** the card's one line: the thing that was actually wrong */
  q: string;
  img: string;
  imgAlt: string;
  /** the /work list's summary */
  synopsis: string;
  /** a longer piece about the same work, elsewhere on the site */
  story?: { href: string; label: string };
  full: CaseFull;
};

const FATEMA = { name: "Fatema Hanif", href: "/fatema" };
const SHAILI = { name: "Shaili Contractor", href: "/shaili" };
const AAKANKSHA = { name: "Aakanksha Singh Devi", href: "/aakanksha" };

export const CASES: Case[] = [
  /* Sources: the three founders' published portfolio records (/fatema, /shaili,
     /aakanksha), which is where every figure and role below comes from. The
     old page's 2,000+ collaborations a quarter, 10x output "with the same
     team" and 15% of revenue from search are not in any of the three records
     in that form, so they are off the page and the card until confirmed. */
  {
    id: "headout",
    kind: "Marketplace",
    client: "Headout",
    cat: "Travel marketplace · 188+ cities",
    fig: "700+",
    figLab: "creator collaborations a quarter, up from under 50",
    q: "A creator programme run by hand, at under 50 collaborations a quarter, rebuilt to run itself at more than 700.",
    img: headoutImg,
    imgAlt: "The Headout app open on a phone, browsing experiences in London",
    synopsis:
      "How Headout’s creator programme went from under 50 collaborations a quarter to more than 700, how its content for France, Italy and Switzerland was built, and the system its content team works to.",
    full: {
      service: "Content, Creators and Search",
      standfirst:
        "Headout is a marketplace for travel experiences in more than 188 cities. This is the work behind three parts of it: a creator programme that runs itself, the content for three European markets, and the system its whole content team works to.",
      facts: [
        { k: "Brand", v: "Headout, a marketplace of 40,000+ travel experiences" },
        { k: "The work", v: "Creator partnerships, market content and the content system" },
        { k: "Led by", v: "", people: [FATEMA, SHAILI, AAKANKSHA] },
      ],
      hero: {
        img: headoutImg,
        alt: "The Headout app open on a phone, browsing experiences in London",
      },
      sections: [
        {
          kicker: "Led by Fatema Hanif",
          title: "Creator partnerships",
          paras: [
            "Headout’s creator programme was run by hand and produced fewer than 50 collaborations a quarter.",
            "Fatema redesigned it as a self-serve system across 40,000+ experiences in more than 188 cities. Creators apply, are vetted, book an experience, make their content and come back for the next one, without anyone at Headout managing each step.",
            "The programme went from under 50 collaborations a quarter to more than 700, at a cost below one dollar per thousand views.",
          ],
        },
        {
          kicker: "Led by Shaili Contractor",
          title: "France, Italy and Switzerland",
          paras: [
            "Shaili led Headout’s content teams for France, and for Italy and Switzerland.",
            "France started from nothing: a new domain, new sites for each city and new editorial standards. Every page had two jobs, to rank on Google and to turn a reader into a booking. Italy and Switzerland followed the same model.",
            "Key French cities reached the first page of Google within three months of launch.",
          ],
        },
        {
          kicker: "Led by Aakanksha Singh Devi",
          title: "The content system",
          paras: [
            "Headout had content in every market and no shared system. There was no tone of voice, no style guide and no standard format, and a batch of pages took about 12 days to turn around.",
            "Aakanksha wrote the tone of voice and the style guide, standardised the formats for product pages and search pages, added editorial review, and worked with the technology and AI teams to build AI-assisted workflows for a content team of more than 60.",
          ],
        },
      ],
      pictures: {
        after: 1,
        shape: "wide",
        items: [
          {
            img: headoutSiteParisImg,
            alt: "Headout’s Paris page, listing tours, attractions and shows in the city",
            caption: "Headout’s Paris page.",
            shot: true,
          },
        ],
      },
      results: {
        title: "What came of it",
        groups: [
          {
            who: "Creator partnerships",
            items: [
              { fig: "700+", lab: "creator collaborations a quarter, up from under 50" },
              { fig: "<$1", lab: "per thousand views on creator content" },
            ],
          },
          {
            who: "France, Italy and Switzerland",
            items: [
              { fig: "2,000+", lab: "content pages across France, Italy and Switzerland" },
              { fig: "3 months", lab: "for key French cities to reach the first page of Google" },
            ],
          },
        ],
      },
      quote: {
        text: "Working with Shaili on the France market at Headout was genuinely one of the highlights of my time as GM.",
        who: "Jean Peltier",
        role: "GM France, Italy and Switzerland, Headout",
        context: "On Shaili’s work at Headout",
      },
    },
  },

  /* Sources: the three founders' published portfolio records. The earlier
     card said 60M+ monthly users, which does not match Aakanksha's published
     5M+ monthly readers; the card and the page now both use the portfolio
     figures, each with a name on it. The question is in OPEN-QUESTIONS.md. */
  {
    id: "lbb",
    kind: "Platform",
    client: "Little Black Book",
    cat: "City discovery platform · 8 cities",
    fig: "8 cities",
    figLab: "from a platform that started in one",
    q: "Every restaurant and shop in India was already listed. Readers came to LBB to learn which were good.",
    img: lbbImg,
    imgAlt: "A Little Black Book discovery collage of shops, homes and city landmarks",
    synopsis:
      "How a Delhi discovery platform grew to eight cities, and the editorial teams, standards and formats that kept each city local.",
    full: {
      service: "City Editorial and Commerce",
      standfirst:
        "Little Black Book grew from a Delhi discovery platform into eight cities. This is the editorial work behind that growth: the city launches, the teams and the standards that kept each city local.",
      facts: [
        { k: "Brand", v: "Little Black Book (LBB), city discovery and shopping, now part of Nykaa" },
        { k: "The work", v: "City launches, editorial leadership and editorial operations" },
        { k: "Led by", v: "", people: [AAKANKSHA, SHAILI, FATEMA] },
      ],
      hero: {
        img: lbbSiteBangaloreImg,
        alt: "Little Black Book’s Bangalore page, with a search bar for stores, experiences and restaurants above four featured posts",
        caption: "LBB Bangalore in January 2019.",
        shot: true,
      },
      sections: [
        {
          title: "The idea",
          paras: [
            "By the time LBB was growing, every restaurant, shop and event in India was already listed somewhere. Finding options was easy. Knowing which were any good was hard, and that judgement is what readers came back to LBB for.",
          ],
        },
        {
          kicker: "Led by Aakanksha Singh Devi",
          title: "From one city to eight",
          paras: [
            "LBB began in Delhi. Bangalore was its first new city, with no audience, no name recognition and no model to copy.",
            "Aakanksha built the Bangalore edition from scratch, then took the model to Mumbai, Pune, Goa, Hyderabad, Chennai and Kolkata. She hired and led the city teams, wrote the tone of voice and the editorial system, added travel as a category, and extended the work across discovery, shopping, video and search.",
          ],
        },
        {
          kicker: "Led by Shaili Contractor",
          title: "Mumbai and the homepage",
          paras: [
            "Shaili was the editor in charge of LBB Mumbai, leading a team of seven across content, strategy and operations, and ran LBB Delhi for a period.",
            "She worked directly with the founder on what the homepage and the app showed each day, using reader data to decide what went first, and built recurring formats the platform could keep running. She also managed push notifications and the India-wide content plan.",
          ],
        },
        {
          kicker: "Led by Fatema Hanif",
          title: "Kolkata",
          paras: [
            "Fatema led LBB Kolkata. She built the editorial workflows and the standards for the city, and the plan for what the Kolkata edition covered.",
          ],
        },
      ],
      pictures: {
        after: 2,
        shape: "wide",
        items: [
          {
            img: lbbSiteMumbaiImg,
            alt: "Little Black Book’s Mumbai page, with featured posts on fashion, travel and a treasure hunt in Colaba",
            caption: "LBB Mumbai in December 2018.",
            shot: true,
          },
        ],
      },
      results: {
        title: "What came of it",
        groups: [
          {
            who: "From one city to eight",
            items: [
              { fig: "8 cities", lab: "from a platform that started in one" },
              { fig: "5M+", lab: "monthly readers, about 85% of them arriving through search" },
            ],
          },
          {
            who: "Mumbai",
            items: [
              { fig: "15×", lab: "growth in content output at LBB Mumbai" },
              { fig: "40%", lab: "more page traffic" },
            ],
          },
          {
            who: "Features and readership",
            items: [
              { fig: "1,000+", lab: "features published" },
              { fig: "20%", lab: "growth in local readership, month on month" },
            ],
          },
        ],
      },
    },
  },

  /* Sources: the live site at tuisajewels.com, which we wrote and built (the
     two screenshots are of it), its About page for the family history, and the
     positioning as it has stood on our homepage since August. The lineage is
     "nearly six centuries" in Tuisa's own words; the painting the motifs come
     from is one eighteenth-century work from within it. The card says the
     first and the page says both. */
  {
    id: "tuisa",
    kind: "D2C jewellery",
    client: "Tuisa",
    cat: "D2C · fine jewellery",
    fig: "600 years",
    figLab: "of a family of painters, behind a new jewellery house",
    q: "The category offers three obvious positions, and every one of them is an argument you lose.",
    img: tuisaImg,
    imgAlt: "A Tuisa diamond necklace worn with a pink silk sari",
    synopsis:
      "A new fine jewellery house in Kathmandu. We defined what it stands for, wrote and built its website, and planned how it earns trust before it spends on advertising.",
    full: {
      service: "Brand Positioning and Website",
      standfirst:
        "We decided what a new fine jewellery house in Kathmandu stands for, then wrote and built the website that brings people into its boutique.",
      facts: [
        { k: "Client", v: "Tuisa, fine jewellery, Kathmandu" },
        { k: "Our role", v: "Positioning, website copy and build" },
        { k: "When", v: "2026. Website live since August" },
        { k: "Led by", v: "", people: [AAKANKSHA, FATEMA] },
      ],
      hero: {
        img: tuisaSiteHomeImg,
        shot: true,
        alt: "The Tuisa website’s home page: the line Brilliance, Redefined beside a model wearing a diamond necklace, with a Book an Appointment button",
        caption: "The home page of tuisajewels.com, which we wrote and built.",
      },
      sections: [
        {
          title: "The brief",
          paras: [
            "Tuisa is a new jewellery house in Kathmandu that works in lab-grown diamonds. It was founded by a family of Chitrakars, painters and photographers whose line goes back nearly six centuries.",
            "It needed to decide what it stood for, and to find a way to earn trust for an expensive purchase, before spending anything on advertising.",
          ],
        },
        {
          title: "What we saw",
          paras: [
            "The category offers three ready-made positions, and each one is a losing argument.",
            "Lead with lab-grown and the brand becomes a debate about carat and price, against whoever is cheaper. Heritage on its own reads as traditional: bought for a wedding, worn once, kept in a locker. Modern design on its own is easy to copy.",
          ],
        },
        {
          title: "What we did",
          items: [
            ["Decided what Tuisa stands for: contemporary heritage", "Heritage gives someone a reason to keep a piece. Contemporary design gives them a reason to wear it. We used the pair as a test for what gets made: a piece has to work with a sari and with a dress, on a working day and at an occasion."],
            ["Built the story on one painting", "The motifs come from a single eighteenth-century family painting of a mother and daughter. Its foliage and vines became the patterns used across the brand."],
            ["Wrote and built the website", "Three pages: Home, Our Story and Visit Us. There is no online shop. The site exists to bring someone into the Kathmandu boutique, so every page leads to booking an appointment."],
            ["Put trust ahead of advertising", "Fine jewellery is a large purchase, and people do not make it from an advertisement for a brand they have never heard of. The plan starts with the founder’s story, a boutique people can walk into, and teaching buyers what they are looking at."],
          ],
        },
      ],
      pictures: {
        after: 2,
        shape: "wide",
        items: [
          {
            img: tuisaArchiveImg,
            alt: "The eighteenth-century family painting of a mother and daughter that the motif language came from",
            caption: "The family painting the motifs are drawn from.",
          },
          {
            img: tuisaSiteVisitImg,
            shot: true,
            alt: "The Visit Us page of the Tuisa website, showing the Kathmandu boutique",
            caption: "The Visit Us page, where the site sends every reader.",
          },
        ],
      },
      ran: {
        title: "See it live",
        items: [
          { outlet: "Website", title: "tuisajewels.com", href: "https://tuisajewels.com/" },
        ],
      },
    },
  },

  /* Sources: Fatema's own written account of the engagement (the SOCIAL case
     study draft, v6) for the brief, the method and what leadership received;
     her published portfolio record for the scale. Public facts and process
     only: nothing from the client's internal research is on this page beyond
     the two figures the homepage card has carried since August, and whether
     those stay is in OPEN-QUESTIONS.md. The three pictures are slides from the
     deck we presented (Fatema's instruction, 9 Oct), chosen because they are
     graphic and carry none of the findings. */
  {
    id: "social",
    kind: "Hospitality",
    client: "Social",
    cat: "Hospitality · 50+ outlets · 10 cities",
    fig: "91%",
    figLab: "of the audience, mainstream",
    q: "A brand built for the counter-culture woke up ten years later as the mainstream, and its own positioning had not noticed.",
    img: socialImg,
    imgAlt: "Inside a Social outlet: a bar under string lights beside a wall of metal boxes",
    synopsis:
      "Social asked what its next decade should look like. We read its first decade back to it, in order, before anyone wrote a strategy.",
    full: {
      service: "Brand Retrospective",
      standfirst:
        "Social asked us what its next decade should look like. We went through its first decade and read it back to its leadership before anyone wrote a strategy.",
      facts: [
        { k: "Client", v: "Social, the café-bar chain from Impresario" },
        { k: "Our role", v: "A ten-year brand retrospective" },
        { k: "When", v: "2026" },
        { k: "Led by", v: "", people: [FATEMA] },
      ],
      hero: {
        img: socialDeckHandsImg,
        alt: "Two drawn hands reach towards Social’s bracket-and-hash mark on an orange ground",
        caption: "The opening slide of our presentation to Social’s leadership.",
      },
      pictures: {
        after: 1,
        shape: "slide",
        items: [
          {
            img: socialDeckMarksImg,
            alt: "A grid of variations on Social’s bracket-and-hash mark, each holding a different symbol",
            caption: "From the deck: Social’s mark, drawn many ways.",
          },
          {
            img: socialDeckScreenImg,
            alt: "An old television screen showing the words Social 2.0",
            caption: "From the deck: the title card for what comes next.",
          },
        ],
      },
      sections: [
        {
          title: "The brief",
          paras: [
            "Social opened in 2014 with the idea that work, coffee, dinner and a gig could all happen at one address. Ten years on it runs more than 50 outlets in 10 cities, and its leadership asked us what the next ten years should look like.",
            "We asked to go backwards first. A brand that size has many versions of its own past. The founder remembers the intent, marketing remembers the campaigns, operations remembers what broke and how it was fixed. Each of them remembers a different decade, which makes it hard to agree on what comes next.",
          ],
        },
        {
          title: "What we did",
          items: [
            ["Read everything, in order", "Brand documents written by different people in different years, campaign decks, menus across cities and eras, and research that had been presented once and shelved. We put all of it in sequence."],
            ["Asked every year the same questions", "We used David Aaker’s brand identity model, which looks at a brand as a product, an organisation, a person and a symbol, and added a fifth view of our own: the brand as a guest experiences it. When two eras answer the same question differently, the difference has a date on it and can be discussed as a fact."],
            ["Listened", "Customer surveys, leadership workshops and sessions with outlet teams, to measure the distance between what the brand believed about itself and what people experienced."],
            ["Set it against the world outside", "A second timeline ran alongside the brand’s own: what was happening in cafés, bars and the culture around them over the same ten years."],
            ["Told it back", "We presented the decade to leadership as a story in four eras. They also received a year-by-year map of the brand, a measure of how consistent it had been across those years, and two options for what to do next."],
          ],
        },
        {
          title: "What came of it",
          paras: [
            "Social now has its first decade as one continuous account, in a form its whole leadership can read and argue from. It shows which founding instincts survived every era, and which habits arrived along the way without anyone choosing them.",
          ],
        },
      ],
      results: {
        title: "Two things the research showed",
        groups: [
          {
            items: [
              { fig: "91%", lab: "of the audience was mainstream, for a brand built for the counter-culture" },
              { fig: "5%", lab: "of visits were for coworking, which had once been the centre of the idea" },
            ],
          },
        ],
      },
      attribution:
        "Both figures come from the research in the retrospective. The rest of what we found belongs to Social.",
    },
  },

  /* Sources: Aakanksha's published account (the blog post linked below) for
     the brief, the venue, the timings, the partners, the attendance and the
     founder's quote; the four linked articles for the coverage. Her post is
     the source of truth where it and the earlier deck differ: "close to
     10,000", and "over a thousand" on opening night. The New Indian Express is
     named in that post but its link there points at the PTI story, so it is
     left out until there is a real link to give. */
  {
    id: "ccpl",
    kind: "Sport",
    client: "Centre Court Pickleball League",
    /* the card footer uses the short name: at 0.2em tracking the full one wraps
       to two lines and lifts that card's footer rule out of line with the other
       four, which is the one thing the eye catches in a set */
    shortClient: "Centre Court",
    cat: "Sport · franchise league · Bengaluru",
    fig: "~10,000",
    figLab: "people across six match weekends",
    q: "The brief was a sports launch, and what was happening at the venue had very little to do with the sport.",
    img: ccplImg,
    imgAlt: "A Centre Court Pickleball League match in front of a full crowd",
    synopsis:
      "Bengaluru’s first franchise pickleball league, launching against the IPL, the ISL and the monsoon. We ran its PR and social media and pitched it as a Saturday night out.",
    story: {
      href: "/blog/centre-court-pickleball-marketing-case-study",
      label: "Read Aakanksha’s full account of the season",
    },
    full: {
      service: "PR and Social Media",
      standfirst:
        "We ran PR and social media for the league’s first Bengaluru season, and pitched it to the city as a Saturday night out.",
      facts: [
        { k: "Client", v: "Centre Court Sports and Entertainment" },
        { k: "Our role", v: "PR and social media" },
        { k: "When", v: "The 2026 season" },
        { k: "Led by", v: "", people: [AAKANKSHA] },
      ],
      /* The crowd, not the court, because the crowd is what the case is about.
         It is also the sharper file: the match photograph only exists at
         1000px, which is soft at this width on any good screen. */
      hero: {
        img: ccplSidelinesImg,
        alt: "A group of people at the venue greet a golden retriever between matches",
        caption: "Between matches at Chamara Vajra.",
      },
      sections: [
        {
          title: "The brief",
          paras: [
            "Centre Court had launched its franchise league in Hyderabad and was bringing it to Bengaluru: six teams, ten players each and a player auction, with matches at Chamara Vajra.",
            "Almost nobody in the city had heard of it. The season opened while the IPL and the ISL, the country’s biggest cricket and football leagues, were both on, and in the middle of the monsoon. We were hired for the PR and the social.",
          ],
        },
        {
          title: "What we saw",
          paras: [
            "We spent the first two weekends at the venue before settling on a story. Matches started at 4.30 in the afternoon and ran until 11 at night, and people stayed for all of it.",
            "Families came, and so did dogs. Someone would arrive to watch a friend play and still be there three hours later, at a food stall or learning the scoring from a stranger. When a storm postponed a match weekend, people complained about it on Instagram.",
            "Most of the crowd had not come for the result. A plan built on fixtures, rivalries and winners would have missed most of what was happening at the venue.",
          ],
        },
        {
          title: "What we did",
          items: [
            ["Changed what we pitched", "We stopped offering editors a new sports league and offered them a city finding a new way to spend its weekends. Fixtures and results still went out in every release."],
            ["Wrote and placed the press", "Releases went out through PTI, the national news wire, and directly to news desks through the season. Each carried a quote from the founders, taken on the night."],
            ["Covered the sidelines on social", "The league’s social media followed what people were already photographing: the food partners, the music and comedy between games, the regulars and their dogs."],
            ["Took our cues from outside sport", "We studied how nightlife, running clubs and food culture speak to their regulars, and borrowed from those more than from sports marketing."],
          ],
        },
      ],
      pictures: {
        after: 2,
        items: [
          {
            img: ccplMatchImg,
            alt: "A player stretches for a low ball during a Centre Court Pickleball League match",
            caption: "A league match at Chamara Vajra.",
          },
          {
            img: ccplStageImg,
            alt: "A percussionist plays lit drums on a stage beside a Centre Court Pickleball League banner",
            caption: "Live music between games.",
          },
        ],
      },
      ran: {
        title: "Where it ran",
        items: [
          {
            outlet: "LBB",
            title: "Pickleball, Pizza, Music, Cocktails & Coffee: Weekend Plans Sorted, Bengaluru",
            href: "https://lbb.in/bangalore/centre-court-pickleball-league-bangalore/",
          },
          {
            outlet: "Deccan Herald",
            title: "Former tennis players find second wind in pickleball",
            href: "https://www.deccanherald.com/sports/tennis/former-tennis-players-find-second-wind-in-pickleball-3993516",
          },
          {
            outlet: "PTI",
            title: "Southern Primes crowned champions as Centre Court Pickleball League ends in grand style",
            href: "https://www.ptinews.com/story/national/southern-primes-crowned-champions-as-centre-court-pickleball-league-ends-in-grand-style/3792208",
          },
          {
            /* thewire.in/ptiprnews is the press-release feed, and the page says
               so: a reader who clicks and finds a release under a newspaper's
               name stops believing the other three */
            outlet: "The Wire, PTI release",
            title: "Play-off clashes, finals, great food, better crowds: Centre Court BLR heads into its biggest weekend yet",
            href: "https://thewire.in/ptiprnews/play-off-clashes-finals-great-food-better-crowds-centre-court-blr-heads-into-its-biggest-weekend-yet",
          },
        ],
      },
      results: {
        title: "What came of it",
        groups: [
          {
            items: [
              { fig: "Close to 10,000", lab: "people through the venue across six match weekends" },
              { fig: "1,000+", lab: "on opening night, during the monsoon" },
              { fig: "20+", lab: "food, drink and entertainment partners, among them Monkey Bar, Araku Coffee, Mezcalita and 56 Run Club" },
            ],
          },
        ],
      },
      attribution:
        "Attendance and partner numbers are the league’s own. Our work was the coverage above and the social media around it.",
      quote: {
        text: "Last night was exactly what we hoped this league would become: competitive on court, but just as alive off it.",
        who: "Yashwanth Biyyala",
        role: "Co-founder, Centre Court Sports and Entertainment",
        context: "From the press release after opening night",
      },
    },
  },

  /* Sources: our delivery record for the cities, the updates and the two
     September events; Aakanksha's published portfolio record for the guide
     format; Fatema's description of the scope on 9 Oct (tastemakers: curation,
     editorial, events and community, led by all three). No guide count, no
     event names or dates and no per-entry detail on the page, her call. The photographs are from the guides' own image sets and show places
     the guides feature; permission is in OPEN-QUESTIONS.md. */
  {
    id: "postcard",
    kind: "Travel",
    client: "Postcard Travel Club",
    shortClient: "Postcard",
    cat: "Travel and lifestyle club · curation and events",
    fig: "10 cities",
    figLab: "curated for the club’s members",
    q: "Postcard’s members choose carefully. We decide what the club recommends to them, and what its gatherings are.",
    img: postcardPerumalImg,
    imgAlt: "A heritage house with a tiled roof on a street in Pondicherry",
    synopsis:
      "We are the tastemakers for Postcard Travel Club. We curate and write its city guides, and we plan, curate and run the gatherings that bring its members together.",
    full: {
      service: "Tastemakers for a Travel Club",
      standfirst:
        "We are the tastemakers for Postcard Travel Club. We decide what the club recommends in each city, write its city guides, and plan, curate and run the gatherings that bring its members together.",
      facts: [
        { k: "Client", v: "Postcard Travel Club" },
        { k: "Our role", v: "Tastemakers: curation, editorial, events and community" },
        { k: "When", v: "April 2026 to now" },
        { k: "Led by", v: "", people: [AAKANKSHA, FATEMA, SHAILI] },
      ],
      hero: {
        img: postcardPerumalImg,
        alt: "A heritage house with a tiled roof on a street in Pondicherry",
        caption: "Maison Perumal, Pondicherry, one of the places in the Pondicherry guide.",
      },
      sections: [
        {
          title: "The brief",
          paras: [
            "Postcard Travel Club is a travel and lifestyle community for people who choose carefully where they eat, shop and stay. Its members expect the club to know a city better than they do.",
            "Postcard trusts us with that judgement. As its tastemakers, we decide what is worth a member’s time in each city, and we bring the members together in person.",
          ],
        },
        {
          title: "The city guides",
          paras: [
            "We curate and write Postcard’s city guides, across India and in Hong Kong. Ten cities so far: Delhi, Mumbai, Bangalore, Kolkata, Hyderabad, Jaipur, Goa, Pondicherry, Mysore and Hong Kong.",
            "Each guide is built around places a visitor would not find easily and that are not widely known. We look for those places, choose which ones belong in the guide, and verify the details before a member reads them.",
            "We keep the guides updated as each city changes, and we cover what is happening in the city as well as where to go.",
          ],
        },
        {
          title: "The gatherings and the community",
          paras: [
            "We plan, curate and run Postcard’s gatherings for the members of the club. That begins with deciding what each gathering should be: where it is held, what it is built around and how it unfolds. Then we run it on the day.",
            "We also host the community. We welcome members at the gatherings and keep the club close to them between one gathering and the next.",
          ],
        },
      ],
      pictures: {
        after: 1,
        items: [
          {
            img: postcardBungalowImg,
            anchor: "right",
            alt: "Looking up through the courtyard of a restored townhouse in Kolkata",
            caption: "Calcutta Bungalow, from the Kolkata guide.",
          },
          {
            img: postcardAmarKhamarImg,
            alt: "A Bengali meal served in leaf bowls: rice, fried aubergine, crisp potato and a curry",
            caption: "Amar Khamar, from the Kolkata guide.",
          },
        ],
      },
    },
  },

  /* Sources: our delivery record (a brand guide and videos in January 2026,
     social media from June to August 2026) and the finished posts themselves,
     four of which are shown. What the service is and how the brand speaks are
     read off those posts. Who led it, what the videos were and any results are
     in OPEN-QUESTIONS.md, so none of the three is on the page. */
  {
    id: "kelly",
    kind: "Pet care",
    client: "Kelly & Crew",
    cat: "Pet care at home · Bangalore",
    fig: "No kennels",
    figLab: "and no boarding: pets looked after in their own home",
    q: "Going away should not feel like betraying your pet.",
    img: kellyAwayImg,
    imgAlt: "A golden retriever lies beside a packed suitcase, looking up",
    synopsis:
      "An in-home pet-care service in Bangalore. We wrote its brand guide, made its videos and ran its social media, in the voice of someone who loves animals.",
    full: {
      service: "Branding and Social Media",
      standfirst:
        "We built the brand for an in-home pet-care service in Bangalore: the brand guide, the videos and the social media, written the way people who love their pets talk.",
      facts: [
        { k: "Client", v: "Kelly & Crew, Bangalore" },
        { k: "Our role", v: "Brand guide, videos and social media" },
        { k: "When", v: "January to August 2026" },
      ],
      sections: [
        {
          title: "The brief",
          paras: [
            "Kelly & Crew looks after pets in their own homes while their owners are away: drop-in visits, feeding, walks and company, with no kennels and no boarding.",
            "It needed to look and sound like one brand everywhere a pet owner would come across it.",
          ],
        },
        {
          title: "The idea",
          paras: [
            "An owner who is going away is handing over their house keys and their animal. We built the brand to sound like the person they would want to hand both to: warm, funny about animals, and exact about what happens on a visit.",
          ],
        },
        {
          title: "What we did",
          items: [
            ["Wrote the brand guide", "How the brand looks and how it speaks, in one document the team can work from."],
            ["Set the look", "Orange, cream and a warm brown, with a wavy edge that runs through every post, so a Kelly & Crew post is recognisable before anyone reads it."],
            ["Gave it a voice", "Funny about pets and plain about the service. One post tells owners that going away shouldn’t feel like betrayal. Another reports that Bella has the zoomies. A service post says exactly what a cat visit covers: feed, water, clean litter, playtime."],
            ["Ran the social media", "Recurring formats, so the feed never starts from a blank page: a favourite moment of the week, breed posts that owners tag each other in, and a plain post for each service."],
          ],
        },
      ],
      pictures: {
        after: -1,
        shape: "square",
        items: [
          {
            img: kellyAwayImg,
            alt: "A post showing a golden retriever beside a suitcase, with the line Going away shouldn’t feel like betrayal",
            caption: "What the service is for, in one line.",
          },
          {
            img: kellyAceImg,
            alt: "A post titled Favourite Moment of the Week, showing a black dog called Ace",
            caption: "Favourite Moment of the Week, a recurring format.",
          },
          {
            img: kellyCatsImg,
            alt: "A post for drop-in visits for cats: feed, water, clean litter, playtime",
            caption: "One post for each service.",
          },
          {
            img: kellyZoomiesImg,
            alt: "A post showing a white dog mid-run, with the line This just in: Bella has the zoomies",
            caption: "A pet’s day, reported as news.",
          },
        ],
      },
    },
  },
];

/**
 * The order every list tells them in: the homepage rail, /work, and "More work"
 * at the foot of each page.
 *
 * Work for clients of the collective first, opening on Centre Court, which
 * Fatema called the best of them on 9 Oct. The two cases from inside Little
 * Black Book and Headout close the list. The earlier order opened on Little
 * Black Book for its 60M figure, which is no longer on the site.
 */
export const CASE_ORDER = ["ccpl", "social", "tuisa", "postcard", "kelly", "lbb", "headout"];

export type OrderedCase = Case & {
  n: string;
  /** the case's own page, /work/<slug> — see shared/work.ts */
  path: string;
};

/** In rail order, each with the position number the rail gives it. */
export const ORDERED_CASES: OrderedCase[] = CASE_ORDER.map((id, i) => {
  const c = CASES.find((x) => x.id === id);
  if (!c) throw new Error(`CASE_ORDER names a case that does not exist: ${id}`);
  const slug = CASE_SLUGS[id];
  if (!slug) throw new Error(`No /work slug for case "${id}" in shared/work.ts`);
  /* the 01..05 on the cards is POSITION in the rail, not an id, so reordering
     the rail renumbers it rather than leaving 02 in front of 01 */
  return { ...c, n: `0${i + 1}`, path: `/work/${slug}` };
});

export const caseBySlug = (slug: string | undefined): OrderedCase | undefined =>
  ORDERED_CASES.find((c) => c.path === `/work/${slug}`);

/**
 * These case studies are a selection, and left alone a selection reads as the
 * whole list. This is the range they were selected from.
 */
export const BRANDS = [
  "Art Fervour",
  "Singapore Tourism Board",
  "Coca-Cola",
  "Cadbury's",
  "Heinz",
  "Google Pixel",
  "General Mills",
  "Bajaj",
  "Columbia Asia",
];

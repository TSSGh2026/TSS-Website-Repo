import headoutImg from "@/assets/cases/headout.webp";
import lbbImg from "@/assets/cases/lbb.webp";
import tuisaImg from "@/assets/cases/tuisa.webp";
import tuisaArchiveImg from "@/assets/cases/tuisa-archive.webp";
import socialImg from "@/assets/cases/social.webp";
import ccplImg from "@/assets/cases/ccpl.webp";

/**
 * THE CASE STUDIES.
 *
 * Copy lives here and nowhere else, so a change is one edit rather than a hunt
 * through markup. The shape is deliberately the shape of a CMS record — the
 * site still has no home for case studies (the ones on /work are hardcoded in
 * Work.tsx, and the per-person portfolios pull from a different table again),
 * and this is what that collection would look like if it existed. Fatema's
 * call: ship it as a checked-in file now, decide where case studies live later.
 *
 * Every figure is from the deck. Nothing here is invented; where a number was
 * not in the deck it is not on the page.
 *
 * `<i>…</i>` is the only markup allowed in these strings, for quoting what
 * somebody said. It is parsed by hand in RichText rather than passed to
 * dangerouslySetInnerHTML, because the day this becomes a real CMS table these
 * strings stop being ours.
 */

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
  /** the tension, on the card: the thing that was actually wrong */
  q: string;
  img: string;
  imgAlt: string;
  /** a different picture for the reader, where opening should move the argument on */
  readerImg?: string;
  readerImgAlt?: string;
  /** a list-view summary. Nothing renders it yet; a CMS record needs one. */
  synopsis: string;
  mandate: string;
  tension: string;
  position: string;
  refused: string;
  refusedLabel?: string;
  componentsLabel: string;
  components: [string, string][];
  constraint?: string;
  impactLabel?: string;
  /** "list" when what the brand owns is not a number */
  impactKind?: "list";
  impact: [string, string][];
  close: string;
};

export const CASES: Case[] = [
  {
    id: "headout",
    kind: "Marketplace",
    client: "Headout",
    cat: "Marketplace · 188 destinations",
    /* 40,000+ was the size of the catalogue, which is the PROBLEM, not the
       result. This is the result, and it is the one a marketing lead reads
       twice: the same team, ten times the output. */
    fig: "10×",
    figLab: "the content output, same size team",
    q: "Scale was the advantage, and it was making the customer’s decision harder every quarter.",
    img: headoutImg,
    imgAlt: "The Headout app open on a phone, browsing experiences in London",
    synopsis:
      "40,000+ experiences across 188 destinations, and no content system holding any of it together. We built the engines that turn a global catalogue into a local decision.",
    mandate:
      "Build the content, creator and search engine that turns a global catalogue into a local decision.",
    tension:
      "A marketplace sells inventory. A traveller is buying ninety minutes of the one week they get in Rome. The scale that made Headout competitive was the same thing making that choice harder.",
    position:
      "Headout as the decision layer between intent and booking. Content had to stop describing inventory and start helping people choose.",
    refused:
      "A bigger catalogue. Every option added was one more thing for a traveller to rule out.",
    componentsLabel: "The position broke into three engines",
    impactLabel: "What each engine produced",
    components: [
      ["Creative partnerships", "Buy attention at the price of a voucher instead of a media plan. People pick a city by listening to someone they already trust who has been there."],
      ["Content", "Help people choose instead of listing what is for sale. Someone looking at 40,000 options needs a shortlist long before they need a checkout."],
      ["Search", "Meet the decision where it starts. What someone types is what they want, so the page answers the job behind the keyword."],
    ],
    constraint:
      "All three had to run in eight languages and twenty markets without a bigger team.",
    impact: [
      ["2,000+", "Creator collaborations per quarter"],
      ["5,000+", "Creators in the network"],
      ["<$1", "CPM on partnership-led reach"],
      ["10×", "Content output, same team size"],
      ["15%", "Of revenue from organic search"],
      ["188", "Destinations live and governed"],
    ],
    close: "The size of the catalogue finally worked in the customer’s favour.",
  },
  {
    id: "lbb",
    kind: "Platform",
    client: "Little Black Book",
    cat: "Platform · discovery to commerce",
    fig: "60M+",
    figLab: "people a month, trusting a verdict",
    q: "By then everything in India was already listed, and the only thing left to own was whether any of it was any good.",
    img: lbbImg,
    imgAlt: "A Little Black Book discovery collage of shops, homes and city landmarks",
    synopsis:
      "Everything in India was already listed. What LBB owned was the verdict attached to the listing. We turned that judgement into a commerce business without spending the trust that built it.",
    mandate:
      "Hold one editorial voice across seven cities, then turn that authority into a commerce business without spending it.",
    tension:
      "By then every restaurant, store and event in India was listed somewhere. Finding options was easy. Knowing which ones were any good was not.",
    position:
      "LBB as the city’s editorial judgement: the shortlist a local friend would give you. What people came back for was the verdict attached to the listing.",
    refused: "How do you monetise taste without making the taste feel bought?",
    refusedLabel: "The question every later decision had to answer",
    componentsLabel: "One voice, three moving parts",
    impactLabel: "Taste, converted",
    components: [
      ["City-first editorial", "Product-market fit was different in every city. Delhi came for shopping and destinations. Bengaluru for independent business. Mumbai for geography."],
      ["Channel segmentation", "A separate handle per city, so a Delhi reader never had to scroll past Pune to find their weekend."],
      ["Discovery to shop", "A second format for a second intent. Discovery answers <i>I didn’t know about this</i>. Shop answers <i>I want this</i>."],
    ],
    constraint:
      "Three signals decided what was allowed to be sold: what readers already asked us to find, what we would recommend if nobody paid us, and what people bought rather than what they saved.",
    impact: [
      ["60M+", "Monthly users"],
      ["15M+", "Urban millennials reached"],
      ["50–80%", "Ad revenue growth, year on year"],
      ["7", "Cities, one voice"],
      ["Nykaa", "Acquired the platform"],
      ["75,000+", "Footfall across ten Dessert Bazaar editions"],
    ],
    close:
      "Discovery built taste. Taste built trust. Trust created intent, and Shop gave that intent somewhere to go.",
  },
  {
    id: "tuisa",
    kind: "D2C jewellery",
    client: "Tuisa",
    cat: "D2C · fine jewellery",
    /* "₹0 performance spend" is a budget line, and it lands as one. Six
       centuries of a painter's lineage going into a product filter is the thing
       nobody else in the category can say. */
    fig: "600 years",
    figLab: "of painting lineage, turned into a product filter",
    q: "The category offers three obvious positions, and every one of them is an argument you lose.",
    /* The card shows the brand as it exists — a sari and contemporary diamonds,
       which IS the position — and the reader opens onto the eighteenth-century
       family painting the motif language came out of. Product first, then the
       archive behind it, which is the order the case itself argues in. */
    img: tuisaImg,
    imgAlt: "A Tuisa diamond necklace worn with a pink silk sari",
    readerImg: tuisaArchiveImg,
    readerImgAlt:
      "The eighteenth-century family painting of a mother and daughter that the motif language came from",
    synopsis:
      "The category offers three traps: lab-grown, heritage, and modern design. All of them are arguments you lose. We built the position, the product filter and the trust mechanics before a rupee of performance spend.",
    mandate:
      "Build the position, the product filter and the trust mechanics for a new fine jewellery house, before a single rupee of performance spend.",
    tension:
      "The category offers three traps and all of them are arguments you lose. Lab-grown turns the brand into a materials argument, competing on carat and price forever against someone cheaper. Heritage reads as traditional: bought for a wedding, worn once, kept in a locker. Modern design reads as generic, with nothing to defend and nothing to stop anyone copying it.",
    position:
      "Contemporary heritage, used as a filter rather than a tagline. Heritage supplies the reason to keep it. Contemporary supplies the reason to wear it. Alone, heritage reads as costume and contemporary reads as fashion.",
    refused:
      "Modernising old jewellery. The opportunity was to make new jewellery someone would keep.",
    componentsLabel: "How the position got built",
    components: [
      ["The archive went into the product itself", "An eighteenth-century family painting of a mother and daughter. Its foliage and vines became the motif language: one specific inheritance rather than a generic nod to India."],
      ["The product had to work twice", "Wearable with a sari and with a dress. Interchangeable stones. Pieces that transform between a working day and an occasion."],
      ["Trust before conversion", "Performance media can buy attention. It cannot manufacture trust, and nobody spends a month’s salary on a brand they met in a feed yesterday. Founder-led storytelling, a boutique you can walk into, and education as the mechanic. Once someone knows what they are looking at, price stops being the argument."],
    ],
    constraint:
      "Six centuries of the Chitrakar painter and photographer lineage, carried forward rather than reproduced.",
    /* a list, not a figure grid: none of this is a number, and "Craftsmanship"
       set in the 2.1rem numeral face overflowed its column by 53px and painted
       over the cell beside it */
    impactLabel: "What the brand owns",
    impactKind: "list",
    impact: [
      ["Design", "Authored in-house, never sourced"],
      ["Craftsmanship", "Why the price holds up when someone asks"],
      ["Storytelling", "Six centuries of it, already in the family"],
      ["Connection", "The one emotion the brand competes on"],
    ],
    close:
      "The filter decided what got made. Anything that failed it never reached the bench.",
  },
  {
    id: "social",
    kind: "Hospitality",
    client: "Social",
    cat: "Hospitality · 57 outlets · 10 cities",
    fig: "91%",
    figLab: "of the audience, mainstream",
    q: "A brand built for the counter-culture woke up ten years later as the mainstream, and its own positioning had not noticed.",
    /* Off socialoffline.in, not out of the deck. The deck's only Social images
       are pages of the Social 2.0 strategy report — the client's own internal
       workshop language, which is not ours to put on a public page. This is the
       brand's own picture of its own venue, which is the thing the case is
       about: what the audience turned up for, and how many of them there were.
       Provenance is flagged in the README; it is Fatema's call to keep it. */
    img: socialImg,
    imgAlt: "A packed Social venue at night under coloured light",
    synopsis:
      "A decade in, Social knew exactly what it had been, and not what it should be next. We replaced instinct with evidence before anybody wrote a strategy.",
    mandate: "Replace instinct with evidence, before anybody writes a strategy.",
    tension:
      "91% of the audience was mainstream. Coworking, the original heartbeat, was down to 5% of visits. The brand’s own positioning said <i>friendly, always super nice</i>. Customers, survey after survey, said the opposite.",
    position:
      "Map the drift, price the trade-offs, and give leadership a shared vocabulary before anyone writes a line of strategy.",
    refused:
      "A rebrand. Nothing was broken yet, and redesigning the surface would have buried the question underneath it.",
    componentsLabel: "How the map got made",
    impactLabel: "The two numbers that ended the argument",
    components: [
      ["Looked outward", "Where café culture, consumer behaviour and social spaces were heading globally, so the drift could be measured against something."],
      ["Looked inward", "Ten years deconstructed across product, organisation, personality and symbolism. Four distinct eras, and the exact point of each turn."],
      ["Listened", "Customer surveys, leadership workshops and on-ground team sessions, measuring the gap between what the brand believed and what people experienced."],
      ["Delivered", "A longitudinal brand map, 2014 to 2024. Consistency scores, gap analysis, and a decision framework with two clear paths forward."],
    ],
    constraint:
      "Most brands commission this after a crisis forces their hand. Social did it while still ranked India’s #5 coolest brand, which is a much easier place to make decisions from.",
    impact: [
      ["91%", "Mainstream audience, in a brand built for the counter-mainstream"],
      ["5%", "Of visits were coworking, once the whole point"],
    ],
    close:
      "Leadership came out of it sharing one vocabulary, which is what the next decade of decisions had been missing.",
  },
  {
    id: "ccpl",
    kind: "Sport",
    client: "Centre Court Pickleball League",
    /* the card footer uses the short name: at 0.2em tracking the full one wraps
       to two lines and lifts that card's footer rule out of line with the other
       four, which is the one thing the eye catches in a set */
    shortClient: "Centre Court",
    cat: "Sport · franchise league · Bengaluru",
    fig: "10,000+",
    figLab: "people across six match weekends",
    q: "The brief was a sports launch, and what was happening at the venue had very little to do with the sport.",
    img: ccplImg,
    imgAlt: "A Centre Court Pickleball League match in front of a full crowd",
    synopsis:
      "Bengaluru’s first franchise pickleball league, launching against the IPL, the ISL and the monsoon. We sold the city a new Saturday night.",
    mandate:
      "PR and social for a league nobody had heard of, launching against the IPL, the ISL and the Bengaluru monsoon.",
    tension:
      "Matches ran from 4.30 in the afternoon until 11 at night and nobody left. Families came. Dogs came. A sports plan asks <i>who won</i>. That was not why the venue stayed full.",
    position:
      "The story was a new Saturday night in Bengaluru. The product had grown bigger than the sport, and the job was to notice it before flattening it back into match reports.",
    refused:
      "Winner graphics. The scoreline was the least interesting thing happening at that venue.",
    componentsLabel: "How a fixture became a Saturday night",
    components: [
      ["Read the room first", "Two weekends on the ground before the narrative was locked. The sidelines turned out to be as interesting as the court, so the sidelines went into the story."],
      ["Pitched the ritual", "Releases through PTI and direct to desks still carried the fixtures. The angle carried the culture: a city finding a new way to spend a Saturday."],
      ["Borrowed from outside sport", "Nightlife, running clubs, food culture, internet humour. Places where what people consume is how they say who they are."],
    ],
    constraint: "Title sponsor Sumadhura. Six teams, seven weekends.",
    impact: [
      ["10,000+", "People across six match weekends"],
      ["1,200+", "Opening night, in the middle of the monsoon"],
      ["20+", "Food, beverage and entertainment partners"],
      ["PTI", "Wire pickup and national desks"],
    ],
    close:
      "A league nobody had heard of became a thing people planned their weekend around.",
  },
];

/**
 * The order the rail tells them in, which is NOT the order they were written in.
 *
 * Fatema's call: open on Little Black Book. Sixty million people a month is the
 * largest number here and the easiest one to feel, so it earns the attention the
 * other four then spend. Headout sits fourth, her call on 25 Aug — its 10x is the
 * strongest single number after LBB's, and holding it back means the rail does
 * not spend both of its loudest cards in the first two frames.
 */
export const CASE_ORDER = ["lbb", "social", "ccpl", "headout", "tuisa"];

/** In rail order, each with the position number the rail gives it. */
export const ORDERED_CASES: (Case & { n: string })[] = CASE_ORDER.map((id, i) => {
  const c = CASES.find((x) => x.id === id);
  if (!c) throw new Error(`CASE_ORDER names a case that does not exist: ${id}`);
  /* the 01..05 on the cards is POSITION in the rail, not an id, so reordering
     the rail renumbers it rather than leaving 02 in front of 01 */
  return { ...c, n: `0${i + 1}` };
});

/**
 * Five case studies is a selection, and left alone a selection reads as the
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

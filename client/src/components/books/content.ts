/**
 * Every word on /books lives here, so copy can change without touching layout.
 *
 * House rules for this file:
 * - no em-dashes in visible copy, no numbered lists, no item counts
 * - every fact has ONE home. The shelf holds each book (who, what we do, what you get);
 *   the process holds how we work; formats hold the physical shapes; questions hold the rest.
 * - no languages, no city. We are a storytelling studio.
 */
import { CONTACT } from "@/lib/contact";

export type Group = "people" | "business";

export type Book = {
  id: string;
  /** Name in lists and headings. */
  name: string;
  /** Spine lettering. */
  spine: string;
  group: Group;
  /** The one line the book says when it is opened. */
  statement: string;
  forWho: string;
  how: string;
  get: string;
  format: string;
  /** How an enquiry started from this book names it: "I'm thinking about ___." */
  ask: string;
  /** The example under "Whose story, and why now?" once this book is chosen. */
  example: string;
  /** Cloth, spine band and cover rule colours. */
  cloth: string;
  band: string;
  /** Spine width and height in px at full size. The cover is 0.7 × the height. */
  w: number;
  h: number;
};

export const GROUP_LABEL: Record<Group, string> = {
  people: "For families",
  business: "For work and business",
};

/** The shelf IS the offer: six books, each with everything you need to know about it. */
export const BOOKS: Book[] = [
  {
    id: "memoir",
    name: "Memoir",
    spine: "MEMOIR",
    group: "people",
    statement: "One life, in the voice of the person who lived it.",
    forWho:
      "Anyone who wants to tell their own story, and families who want a parent's or grandparent's story kept.",
    how: "We map the life, record a series of long conversations and write the book in the storyteller's own phrases.",
    get: "A hardcover memoir with photographs from the family albums.",
    format: "Hardcover, 80 to 200 pages",
    ask: "a memoir",
    example: "My father turns eighty in March, and nobody's written his stories down.",
    cloth: "#0c0a3e",
    band: "#cf81cd",
    w: 58,
    h: 292,
  },
  {
    id: "family-history",
    name: "Family history",
    spine: "FAMILY HISTORY",
    group: "people",
    statement: "One family, across generations.",
    forWho:
      "Families who want the migrations, the houses and the people everyone still talks about kept in one place.",
    how: "We interview across the generations, go through the albums, letters and documents, and build the family's story around them.",
    get: "A hardcover family history, and the family archive sorted and scanned.",
    format: "Hardcover, 120 to 250 pages, or a boxed set",
    ask: "a family history",
    example: "Four generations of our family have lived in the same house, and the youngest know none of it.",
    cloth: "#3c1030",
    band: "#e0d6c2",
    w: 54,
    h: 266,
  },
  {
    id: "photo-book",
    name: "Family photo book",
    spine: "PHOTO BOOK",
    group: "people",
    statement: "The albums, finally in order, with the stories written in.",
    forWho: "A wedding, an anniversary, a family cookbook, or a cupboard of albums nobody has sorted.",
    how: "We select and restore the photographs, photograph what is missing, and write the captions and short stories that go with them.",
    get: "A lay-flat photo book that opens flat across the spread.",
    format: "Lay-flat hardcover, 40 to 160 pages",
    ask: "a family photo book",
    example: "Our parents' fortieth anniversary is in December, and the albums are in three cupboards.",
    cloth: "#12213a",
    band: "#b6ad98",
    w: 50,
    h: 240,
  },
  {
    id: "biography",
    name: "Biography",
    spine: "BIOGRAPHY",
    group: "business",
    statement: "Your own life or someone else's, as an autobiography or a biography.",
    forWho:
      "Founders, leaders and professionals telling their own story, and organisations honouring someone who shaped them.",
    how: "We interview you and the people who were there, research the context and write it chapter by chapter in the right voice.",
    get: "A finished manuscript, designed and ready to print privately or to take to a publisher.",
    format: "Hardcover or paperback, 150 to 250 pages, with an ebook",
    ask: "a biography",
    example: "I've spent thirty years building a practice, and I want the story told properly.",
    cloth: "#241033",
    band: "#e0d6c2",
    w: 56,
    h: 270,
  },
  {
    id: "company",
    name: "Company history",
    spine: "COMPANY HISTORY",
    group: "business",
    statement: "Why the business was built the way it was.",
    forWho:
      "Family businesses, companies, schools and trusts marking a milestone anniversary, or a founder handing over.",
    how: "We interview founders, employees and customers, work through the archive and write the story people inside and outside the company will read.",
    get: "A researched and designed hardcover, with a boxed edition for the people who built it.",
    format: "Hardcover, 100 to 250 pages",
    ask: "a company history",
    example: "The business turns fifty next year, and the founders are still here to tell it.",
    cloth: "#06041a",
    band: "#cf81cd",
    w: 64,
    h: 288,
  },
  {
    id: "coffee-table",
    name: "Coffee table book",
    spine: "COFFEE TABLE",
    group: "business",
    statement: "Your brand, your place or your city, told in photographs.",
    forWho: "Brands launching or gifting, hotels, institutions and cities.",
    how: "We commission new photography, restore the archive prints you already have, and write the essays and captions around them.",
    get: "A large-format, cloth-bound hardcover, with a slipcase if you want one.",
    format: "12 × 10 in, 120 to 240 pages",
    ask: "a coffee table book",
    example: "We're opening a new hotel and want a book our guests will take home.",
    cloth: "#7b1e7a",
    band: "#f4f1ea",
    w: 72,
    h: 224,
  },
];

/* ─────────────── How we make a book ─────────────── */

export const PROCESS_INTRO =
  "It starts with conversations. You tell us the stories, and the rest of the work is ours.";

export const PROCESS = [
  {
    t: "We map the story",
    d: "Before any writing begins, we set out the periods, people, events and themes worth exploring. It gives us direction without deciding the story before we have heard it.",
  },
  {
    t: "We interview",
    d: "A series of recorded conversations that work through the life and follow the stories that emerge. Where it helps, we also talk to the family, friends or colleagues who were there.",
  },
  {
    t: "We gather the material",
    d: "Photographs, letters, diaries, documents and records. We work out what is useful, so nobody has to organise half a century into labelled folders before we arrive.",
  },
  {
    t: "We photograph what is missing",
    d: "Portraits, places, objects, the factory floor: whatever the archive cannot give us.",
  },
  {
    t: "We write and share",
    d: "The interviews become chapters and the chapters become a manuscript, with one question in mind: does this sound like the person whose story we are telling?",
  },
  {
    t: "You read it",
    d: "You correct facts, fill gaps, take out anything you don't want included, and tell us where we have misunderstood something.",
  },
  {
    t: "We make the book",
    d: "Photographs, typography and design come together, and the book goes to print. Then one day, something that lived mostly in somebody's head is sitting on the table.",
  },
];

/* ─────────────── Formats ─────────────── */

export type Format = {
  id: string;
  name: string;
  spec: string;
  /** Cover drawn to scale: 0.78 px per mm at desktop. */
  w: number;
  h: number;
  cloth: string;
  /** What the inside looks like when the cover swings open. */
  inside: "text" | "photo" | "zine";
  /** Drawn as a different object from a book with a cover that swings open. */
  kind?: "slipcase" | "boxed" | "ebook";
};

export const FORMATS: Format[] = [
  { id: "zine", name: "Keepsake zine", spec: "A5 · 16 to 32 pages", w: 115, h: 164, cloth: "#7b1e7a", inside: "zine" },
  { id: "paperback", name: "Paperback", spec: "6 × 9 in · 80 to 250 pages", w: 119, h: 179, cloth: "#8a7f68", inside: "text" },
  { id: "hardcover", name: "Hardcover", spec: "6 × 9 in · sewn, cloth-bound", w: 124, h: 184, cloth: "#0c0a3e", inside: "text" },
  { id: "layflat", name: "Lay-flat photo book", spec: "10 × 10 in · 40 to 160 pages", w: 198, h: 198, cloth: "#12213a", inside: "photo" },
  { id: "coffee", name: "Coffee table book", spec: "12 × 10 in · 120 to 240 pages", w: 238, h: 198, cloth: "#3c1030", inside: "photo" },
  { id: "slipcase", name: "Slipcase edition", spec: "Any book · in a cloth case", w: 132, h: 192, cloth: "#241033", inside: "text", kind: "slipcase" },
  { id: "boxed", name: "Boxed set", spec: "Several volumes · in one cloth box", w: 150, h: 196, cloth: "#12213a", inside: "text", kind: "boxed" },
  { id: "ebook", name: "Ebook", spec: "Any of our books · on every screen", w: 104, h: 168, cloth: "#0c0a3e", inside: "text", kind: "ebook" },
];

/* ─────────────── Questions ─────────────── */

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "How much does a book cost?",
    a: "It depends on the scale of the story and the work involved. A focused book about one chapter of a life is a different undertaking from a family or company history with several interviewees, a large archive and hundreds of photographs. After a first conversation, we recommend the scope that makes sense and give you a clear quote before anything begins.",
  },
  {
    q: "Whose name goes on the cover?",
    a: "Yours, or whoever's story it is. It is your book. We are happy to stay off the cover entirely.",
  },
  {
    q: "Who owns the book?",
    a: "You do. The book, the manuscript, the recordings and the scans are all yours.",
  },
  {
    q: "Who decides what goes in?",
    a: "You do. We discuss sensitive material and boundaries at the start, and you review the manuscript before it is final. If there are things you don't want in the book, they don't go in the book.",
  },
  {
    q: "How long does it take?",
    a: "That depends on the length, the number of interviews and people involved, how much material already exists and how complex the story is. Once we understand the book, we will give you a realistic timeline.",
  },
  {
    q: "I'm not a writer. Does that matter?",
    a: "Not at all. Writing the book is our job. Yours is to talk, remember, look through photographs, correct us when necessary and occasionally say, \"I'd forgotten about that.\"",
  },
  {
    q: "I don't remember exact dates.",
    a: "Most people don't. We can often establish them through photographs, documents, family members and research, and we keep what we know apart from what is genuinely uncertain.",
  },
  {
    q: "Can I commission this for my parents?",
    a: "Yes. The idea often begins with someone other than the person whose story it is. We speak with you first, then involve your parent in a way that feels like an invitation.",
  },
  {
    q: "Can it be a surprise?",
    a: "The idea can. The interviews are slightly harder to hide. Talk to us and we will work out what can realistically stay a surprise.",
  },
  {
    q: "I've already started writing. Can you work with that?",
    a: "Yes. A few chapters, a full draft, diaries, notes or recordings. The work might be interviewing and adding to it, restructuring, editing, or taking a finished manuscript through to the book.",
  },
  {
    q: "Does it have to be published?",
    a: "No. A book can be published widely, or exist in twenty beautifully printed copies for the people who matter. Both are real books.",
  },
  {
    q: "We have thousands of photographs. Is that a problem?",
    a: "Only for whoever is storing them. We help you narrow them down to the ones that belong in the story.",
  },
  {
    q: "Can you work with our brand guidelines and review process?",
    a: "Yes. We design to your brand guidelines, and your brand, legal or communications team joins the review at each draft.",
  },
];

/* ─────────────── Contact ───────────────
 * The address and number come from lib/contact, the site's one copy of them. */

export const EMAIL = CONTACT.email;
export const PHONE = "+91 91477 40521";

export const whatsappFor = (ask: string | null) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    ask ? `Hi, I'm thinking about ${ask}.` : "Hi, I'd like to talk about a book.",
  )}`;

export const mailFor = (ask: string | null, body?: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(ask ? `Enquiry: ${ask}` : "Book enquiry")}&body=${encodeURIComponent(
    body ?? "Tell us whose story it is, and why you're thinking about it now.",
  )}`;

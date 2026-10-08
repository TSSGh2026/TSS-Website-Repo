import { useEffect } from "react";
import { usePageSeo, faqPage, breadcrumb, ORG_ID, SITE_ORIGIN } from "@/lib/seo";
import { BOOKS, FAQS } from "@/components/books/content";
import "@/styles/books.css";
import { Footer, Nav } from "@/components/books/site";
import { Hero } from "@/components/books/hero";
import { Craft } from "@/components/books/craft";
import { Formats } from "@/components/books/formats";
import { Faq } from "@/components/books/faq";
import { Close } from "@/components/books/close";

/**
 * /books: memoirs, biographies, family and company histories, coffee table books.
 *
 * Self-contained like /offer: its own header and footer, no site Navbar or Footer.
 * The logo in the header is the way back to the rest of the site.
 *
 * One job per section, so nothing is said twice:
 * the books and everything about each (hero shelf; each book opens with its own details)
 * → how we make one (process) → the physical shape (formats) → the rest (questions)
 * → the ask (close).
 */
export default function BooksPage() {
  /* Title and description must match the /books entry in script/prerender.ts.
     They are in the words people search with (memoir, family history, company
     history); the page itself keeps its own voice.

     The Service node is built from BOOKS and the FAQPage from FAQS, the same
     arrays the page renders, so the structured data cannot say something the
     page does not. */
  usePageSeo("books", {
    title: "Memoir, Family History & Company History Books | The Story Shapers",
    description:
      "Memoirs, biographies, family histories, company histories and coffee table books, interviewed, written, designed and printed for you in India by The Story Shapers.",
    jsonLd: [
      {
        "@type": "Service",
        "@id": `${SITE_ORIGIN}/books#service`,
        name: "Memoir, biography, family history and company history books",
        serviceType: "Memoir and biography writing",
        description:
          "The Story Shapers interviews, writes, designs and prints memoirs, biographies, family histories, company histories, family photo books and coffee table books.",
        url: `${SITE_ORIGIN}/books`,
        provider: { "@id": ORG_ID },
        areaServed: ["India", "Worldwide"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Books we make",
          itemListElement: BOOKS.map((b) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: b.name,
              description: `${b.statement} ${b.how} ${b.get}`,
              audience: { "@type": "Audience", audienceType: b.forWho },
            },
          })),
        },
      },
      faqPage(FAQS),
      breadcrumb([
        ["The Story Shapers", "/"],
        ["Books", "/books"],
      ]),
    ],
  });

  useEffect(() => {
    // in-page links (the nav, "See the books we make") glide rather than jump, on this page only
    const html = document.documentElement;
    const scroll = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = scroll;
    };
  }, []);

  return (
    <div className="books-page books-scope min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Craft />
        <Formats />
        <Faq />
        <Close />
      </main>
      <Footer />
    </div>
  );
}

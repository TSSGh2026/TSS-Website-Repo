import { useEffect } from "react";
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
  useEffect(() => {
    const previous = document.title;
    document.title = "Books & Biographies | The Story Shapers";
    // in-page links (the nav, "See the books we make") glide rather than jump, on this page only
    const html = document.documentElement;
    const scroll = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      document.title = previous;
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

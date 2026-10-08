import { useEffect } from "react";

/**
 * WHAT A MACHINE READS ABOUT A PAGE.
 *
 * Search engines and AI answer engines never see the animation. They read the
 * head: a title, a description, a canonical, and the JSON-LD that says which
 * entity the page is about. This file is the one place those are set from, so
 * a page cannot have a title in one voice and structured data in another.
 *
 * The ids below are the join. index.html declares the organisation, the
 * website and the three founders once, each with an `@id`; every page-level
 * block points back at those ids instead of restating a name. That link is
 * what lets an engine conclude that the Fatema Hanif who wrote an article, the
 * Fatema Hanif on /fatema and the founder of The Story Shapers are one person,
 * and not one of the other Fatema Hanifs it already knows about.
 */

/* window.location cannot be used for anything baked into metadata: during the
   build-time prerender it is the local snapshot server, and that address would
   ship inside the static HTML. It did, once, in every article's share links. */
export const SITE_ORIGIN = "https://www.storyshaperscollective.com";

export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export type Person = {
  /** the profile page, which doubles as the author page */
  path: string;
  id: string;
  name: string;
  linkedin: string;
};

const person = (path: string, name: string, linkedin: string): Person => ({
  path,
  id: `${SITE_ORIGIN}${path}#person`,
  name,
  linkedin,
});

/**
 * The three founders, keyed by the name a byline carries.
 *
 * Must stay in step with the Person nodes in client/index.html — the ids here
 * only mean something because the same ids are declared there.
 */
export const PEOPLE: Record<string, Person> = {
  "Fatema Hanif": person(
    "/fatema",
    "Fatema Hanif",
    "https://www.linkedin.com/in/fatemarfatia/",
  ),
  "Shaili Contractor": person(
    "/shaili",
    "Shaili Contractor",
    "https://www.linkedin.com/in/shailicontractor/",
  ),
  "Aakanksha Singh Devi": person(
    "/aakanksha",
    "Aakanksha Singh Devi",
    "https://www.linkedin.com/in/aakankshasinghdevi/",
  ),
};

export const personBySlug = (slug: string | undefined): Person | undefined =>
  Object.values(PEOPLE).find((p) => p.path === `/${slug}`);

/** A site-relative path made absolute; anything already absolute is left alone. */
export const absolute = (src: string): string =>
  src.startsWith("/") ? SITE_ORIGIN + src : src;

type Seo = {
  title?: string;
  description?: string;
  /** "website" unless the page is an article or a person */
  ogType?: string;
  /** one object, or several to be published as one @graph */
  jsonLd?: object | object[];
  /** asks search engines to leave the page out, for a URL with nothing on it */
  noindex?: boolean;
};

const setContent = (selector: string, content: string) =>
  document.querySelector(selector)?.setAttribute("content", content);

/**
 * Sets the head for one page and puts back what was there on the way out.
 *
 * `key` names this page's JSON-LD tag. The prerender snapshots that tag into
 * the static HTML, and the app mounts rather than hydrates, so without a
 * stable name to look for every visit would add a second copy beside the
 * prerendered one.
 */
export function usePageSeo(key: string, seo: Seo | null) {
  const serialised = seo ? JSON.stringify(seo) : null;

  useEffect(() => {
    if (!serialised) return;
    const { title, description, ogType, jsonLd, noindex } = JSON.parse(serialised) as Seo;

    const previousTitle = document.title;
    if (title) {
      document.title = title;
      setContent('meta[property="og:title"]', title);
      setContent('meta[name="twitter:title"]', title);
    }
    if (description) {
      setContent('meta[name="description"]', description);
      setContent('meta[property="og:description"]', description);
      setContent('meta[name="twitter:description"]', description);
    }
    if (ogType) setContent('meta[property="og:type"]', ogType);

    let robots: HTMLMetaElement | null = null;
    if (noindex) {
      robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex";
      document.head.appendChild(robots);
    }

    const selector = `script[data-jsonld="${key}"]`;
    if (jsonLd) {
      let tag = document.querySelector<HTMLScriptElement>(selector);
      if (!tag) {
        tag = document.createElement("script");
        tag.type = "application/ld+json";
        tag.setAttribute("data-jsonld", key);
        document.head.appendChild(tag);
      }
      tag.textContent = JSON.stringify(
        Array.isArray(jsonLd)
          ? { "@context": "https://schema.org", "@graph": jsonLd }
          : { "@context": "https://schema.org", ...jsonLd },
      );
    }

    return () => {
      document.title = previousTitle;
      robots?.remove();
      document.querySelector(selector)?.remove();
    };
  }, [key, serialised]);
}

/** FAQPage for a list of questions whose answers are visible on the page. */
export const faqPage = (items: { q: string; a: string | string[] }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: Array.isArray(a) ? a.join(" ") : a,
    },
  })),
});

/** The trail from the homepage to this page, for a page that sits under another. */
export const breadcrumb = (trail: [name: string, path: string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: SITE_ORIGIN + path,
  })),
});

import express from "express";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { optimizeImages, optimizeStaticAssets } from "./optimize-images";

/**
 * Prerenders the public routes of the built SPA to static HTML so that
 * search engines and AI crawlers (which do not execute JavaScript) can
 * read the page content.
 *
 * How it works: serves dist/public locally, proxies /api/* to the
 * production API so CMS-backed sections render with real content, then
 * snapshots each route with headless Chrome and writes the result to
 * dist/public/<route>/index.html. Vercel serves those static files
 * before the SPA rewrite kicks in.
 *
 * If Chrome cannot be launched (e.g. an unexpected build environment),
 * the step logs a warning and the build continues as a plain SPA.
 */

const PROD_API = "https://www.storyshaperscollective.com";
const PORT = 45173;
const DIST = path.resolve(process.cwd(), "dist", "public");

// Per-route head overrides. Pages whose components already set their own
// document.title (team, portfolios, blog articles) are left as rendered.
type RouteDef = {
  route: string;
  title?: string;
  description?: string;
  /** Site-relative path to a per-route share card. Falls back to the
   *  site-wide /opengraph.jpg, which is a screenshot of the home page. */
  image?: string;
  lastmod?: string;
};

const ROUTES: RouteDef[] = [
  { route: "/" },
  {
    route: "/our-story",
    title: "Our Story | The Story Shapers",
    description:
      "How three senior marketers left the agency and corporate ladder to build a collective that does brand strategy the way they always knew it should be done.",
  },
  {
    route: "/team",
    title: "The Story Shapers Team: Strategists, Writers, Designers & Marketers",
    description:
      "Meet the collective: strategists, writers, designers and growth marketers working as one team. Founded by Fatema Hanif, Shaili Contractor and Aakanksha Singh Devi.",
  },
  {
    route: "/services",
    title: "Brand, Content & AEO Consultancy, India | The Story Shapers",
    description:
      "Brand positioning, websites, blogs, newsletters, social, SEO and AEO content for founders in India and beyond. A senior-led brand and content consultancy.",
  },
  {
    route: "/contact",
    title: "Contact | The Story Shapers",
    description:
      "Tell us where things feel off. We'll tell you what we see and where to begin. Get in touch with The Story Shapers.",
  },
  {
    route: "/join",
    title: "Join the Collective | The Story Shapers",
    description:
      "The Story Shapers is a collective of senior strategists who've chosen to work together instead of alone. Here's what being a collaborator looks like.",
  },
  {
    route: "/blog",
    title: "Blog | The Story Shapers",
    description:
      "Notes on brand strategy, positioning, messaging and content systems from The Story Shapers collective.",
  },
  { route: "/fatema" },
  { route: "/shaili" },
  { route: "/aakanksha" },
  {
    route: "/books",
    title: "Memoir, Family History & Company History Books | The Story Shapers",
    description:
      "Memoirs, biographies, family histories, company histories and coffee table books, interviewed, written, designed and printed for you in India by The Story Shapers.",
  },
  {
    route: "/offer",
    title: "One website. ₹80,000. Live in 10 working days. — The Story Shapers",
    description:
      "A brand website with your story at its centre, written, designed and built for ₹80,000 all in, live in 10 working days.",
    image: "/offer-opengraph.jpg?v=2026-09-28",
  },
  {
    route: "/offer/terms",
    title: "Website offer terms | The Story Shapers",
    description:
      "The full terms and conditions for The Story Shapers' website offer: scope, timeline, payment, revisions and cancellation.",
    image: "/offer-opengraph.jpg?v=2026-09-28",
  },
];

// Published blog articles live in the CMS, so their routes are discovered at
// build time. Each article page sets its own title/description/canonical/
// JSON-LD from CMS fields once rendered.
async function fetchBlogRoutes(attempt = 1): Promise<RouteDef[]> {
  try {
    const routes: RouteDef[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const res = await fetch(
        `${PROD_API}/api/blog/posts?limit=100&page=${page}`,
        { headers: { accept: "application/json" } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      for (const post of data.posts ?? []) {
        if (!post?.slug) continue;
        routes.push({
          route: `/blog/${post.slug}`,
          lastmod: (post.updatedAt ?? post.publishedAt ?? "").slice(0, 10) || undefined,
        });
      }
      totalPages = data.totalPages ?? 1;
      page++;
    } while (page <= totalPages);
    console.log(`[prerender] discovered ${routes.length} blog article routes`);
    return routes;
  } catch (err) {
    // One failed request here used to cost every article its static page and
    // its sitemap entry for the life of the deploy, without failing anything.
    if (attempt < 3) {
      console.warn(`[prerender] blog fetch failed (attempt ${attempt}), retrying:`, err);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      return fetchBlogRoutes(attempt + 1);
    }
    console.warn("[prerender] could not fetch blog posts; articles will not be prerendered:", err);
    return [];
  }
}

function buildSitemap(routes: RouteDef[]): string {
  const origin = "https://www.storyshaperscollective.com";
  const entries = routes
    .map(({ route, lastmod }) => {
      const loc = `${origin}${route === "/" ? "/" : route}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        "  </url>",
      ].join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

/**
 * Writes the SPA fallback shell that Vercel's catch-all rewrite points at.
 *
 * Every URL without a matching static file falls through that rewrite, and the
 * commonest one is an article published since the last build — prerendering
 * happens here, at build time, so a new post has no file of its own yet.
 *
 * The rewrite used to land on index.html. But the snapshot loop below overwrites
 * index.html with a full picture of the *home page*, so those readers were served
 * the entire home page, watched it paint, and then watched React throw it away
 * once the router read the URL they actually asked for. That is the flash.
 *
 * app.html is the untouched Vite shell instead: same stylesheet, same scripts, an
 * empty #root. Nothing paints that then has to be taken back. The canonical and
 * og:url tags are stripped on the way out — left in, they would tell a crawler
 * that a brand new article is the home page.
 *
 * Called before prerendering rather than inside it, and deliberately outside the
 * catch that lets prerendering fail soft: if this file is ever missing, every
 * deep link on the site 404s.
 */
export async function writeFallbackShell() {
  const shell = (await readFile(path.join(DIST, "index.html"), "utf-8"))
    .replace(/[ \t]*<link rel="canonical"[^>]*>\n?/i, "")
    .replace(/[ \t]*<meta property="og:url"[^>]*>\n?/i, "");
  await writeFile(path.join(DIST, "app.html"), shell, "utf-8");
  console.log("[prerender] app.html written (SPA fallback shell)");

  // And the page for a URL that is not a page.
  //
  // vercel.json used to rewrite every unmatched path to app.html, so a made-up
  // address, /llms.txt and /favicon.ico all answered 200 with the homepage's
  // title and an empty #root: a soft 404, and for a crawler asking for a text
  // file, worse than a miss. The rewrites now name the real routes, and
  // anything else falls through to this file, which Vercel serves with a 404
  // status. Same shell, so React still mounts and draws the NotFound page; the
  // differences are the title, the noindex, and that it describes nothing.
  //
  // Written here, beside app.html, so it exists even when prerendering fails
  // soft. The snapshot loop replaces it with the rendered page when it runs.
  await writeFile(path.join(DIST, "404.html"), notFoundHead(shell), "utf-8");
  console.log("[prerender] 404.html written");
}

/** The shell's head, rewritten for a page that must not be indexed or cited. */
function notFoundHead(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "<title>Page not found | The Story Shapers</title>\n    <meta name=\"robots\" content=\"noindex\" />")
    .replace(/[ \t]*<link rel="canonical"[^>]*>\n?/i, "")
    .replace(/[ \t]*<meta property="og:url"[^>]*>\n?/i, "")
    .replace(/[ \t]*<script type="application\/ld\+json"[\s\S]*?<\/script>\n?/gi, "");
}

async function getBrowser() {
  if (process.platform === "darwin") {
    const puppeteer = await import("puppeteer-core");
    return puppeteer.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    });
  }
  // Linux (Vercel build container): use the serverless-compatible Chromium build
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteer = await import("puppeteer-core");
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

function startServer(): Promise<{ close: () => void }> {
  const app = express();

  // Proxy API calls to production so CMS content renders at build time
  app.use("/api", async (req, res) => {
    try {
      const upstream = await fetch(`${PROD_API}/api${req.url}`, {
        headers: { accept: "application/json" },
      });
      res.status(upstream.status);
      res.set("content-type", upstream.headers.get("content-type") ?? "application/json");
      res.send(Buffer.from(await upstream.arrayBuffer()));
    } catch (err) {
      res.status(502).json({ error: "prerender proxy failed" });
    }
  });

  app.use(express.static(DIST));
  // app.html, not index.html: by the time a later route is snapshotted the
  // loop has overwritten index.html with a full picture of the home page.
  app.use((_req, res) => res.sendFile(path.join(DIST, "app.html")));

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => resolve({ close: () => server.close() }));
  });
}

export async function prerender() {
  if (!existsSync(path.join(DIST, "index.html"))) {
    console.warn("[prerender] dist/public/index.html not found, skipping");
    return;
  }

  const blogRoutes = await fetchBlogRoutes();
  const allRoutes = [...ROUTES, ...blogRoutes];

  // Regenerate the sitemap with article URLs before the browser step, so it
  // stays current even when Chrome fails soft and the build ships as an SPA.
  await writeFile(path.join(DIST, "sitemap.xml"), buildSitemap(allRoutes), "utf-8");
  console.log(`[prerender] sitemap.xml written with ${allRoutes.length} URLs`);

  const serverHandle = await startServer();
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Before snapshotting anything, build the small static copies of the CMS
    // images. Done first on purpose: the pages rendered below then load those
    // instead of the multi-megabyte originals, so prerendering is faster too.
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
    try {
      await optimizeImages(page, `http://localhost:${PORT}`, DIST);
    } catch (err) {
      // A failure here costs speed, not correctness — the client falls back to
      // /api/images/<id> for anything without a static copy.
      console.warn("[images] optimisation pass failed, serving originals:", err);
    }

    // And the other kind: the plain files copied out of attached_assets/, whose
    // URLs are seeded into the portfolios table as "/assets/<name>". Same
    // filename, same format, resized in place — see optimize-images.ts. Its own
    // try/catch because a failure here is likewise only a slower page.
    try {
      await optimizeStaticAssets(page, DIST);
    } catch (err) {
      console.warn("[assets] resize pass failed, serving originals:", err);
    }

    for (const { route, title, description, image } of allRoutes) {
      const url = `http://localhost:${PORT}${route}`;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

      // Evaluate code is passed as strings: tsx/esbuild injects a __name
      // helper into serialized functions that doesn't exist in the browser.

      // Trigger scroll-based reveal animations so nothing is frozen hidden
      await page.evaluate(`(async () => {
        await new Promise((done) => {
          let y = 0;
          const step = () => {
            y += 600;
            window.scrollTo(0, y);
            if (y < document.body.scrollHeight) setTimeout(step, 80);
            else done();
          };
          step();
        });
        window.scrollTo(0, 0);
      })()`);
      await new Promise((r) => setTimeout(r, 800));

      // UNBAKE THE ONE MEASUREMENT THAT ONLY HOLDS AT THIS VIEWPORT.
      //
      // Everything above snapshots a page rendered at 1440x900, which is fine
      // for markup and fine for anything sized in rem, em, svh or %. The hero
      // is the exception: it measures its own words and writes a px font-size
      // onto the flow paragraph, so the file we are about to serve to every
      // device carried "71.122px" — and a 375px phone drew that, overflowing
      // sideways by 54px and standing three screens tall until React hydrated
      // and collapsed it.
      //
      // Removing the property lets the .hero-flow rule in index.css take over,
      // which is viewport-relative and lands within a rounding error of what
      // paint() will compute a moment later. The word widths are all in `em`,
      // so they follow whatever size applies and are left exactly as rendered.
      //
      // Narrow on purpose: one property, one element, addressed through the DOM
      // rather than by rewriting the serialized HTML. If another component ever
      // writes px from a measurement, it needs its own line here — there is no
      // general way to tell a measured px from an intentional one.
      await page.evaluate(`(() => {
        const flow = document.querySelector('#act-shape p[aria-hidden="true"]');
        if (flow) flow.style.removeProperty("font-size");
      })()`);

      // A headline that types itself is snapshotted mid-word, beside the
      // screen-reader copy of the same sentence, so a text-only crawler read
      // /offer's h1 as "…do nothing for you. do nothing for you." The typed
      // half is decoration; the sr-only half is the sentence. Empty the
      // decoration and the static h1 says it once. React redraws it on mount.
      await page.evaluate(`(() => {
        document.querySelectorAll("[data-typed]").forEach((el) => {
          el.textContent = "";
        });
      })()`);

      // Per-route head: canonical always, title/description where the SPA
      // doesn't manage them itself
      const headParams = JSON.stringify({
        route,
        title: title ?? null,
        description: description ?? null,
        image: image ?? null,
      });
      await page.evaluate(`(({ route, title, description, image }) => {
        const origin = "https://www.storyshaperscollective.com";
        const canonicalHref = origin + (route === "/" ? "/" : route);
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement("link");
          canonical.setAttribute("rel", "canonical");
          document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", canonicalHref);
        document.querySelector('meta[property="og:url"]')
          ?.setAttribute("content", canonicalHref);

        if (title) {
          document.title = title;
          document.querySelector('meta[property="og:title"]')
            ?.setAttribute("content", title);
          document.querySelector('meta[name="twitter:title"]')
            ?.setAttribute("content", title);
        }
        if (description) {
          document.querySelector('meta[name="description"]')
            ?.setAttribute("content", description);
          document.querySelector('meta[property="og:description"]')
            ?.setAttribute("content", description);
          document.querySelector('meta[name="twitter:description"]')
            ?.setAttribute("content", description);
        }

        // Whatever the page is called by now, its share card is called the
        // same. /team and the three founder pages set document.title
        // themselves and nothing else, so all four went out under the
        // homepage's og:title.
        const finalTitle = document.title;
        const finalDescription = document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content");
        for (const sel of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
          document.querySelector(sel)?.setAttribute("content", finalTitle);
        }
        if (finalDescription) {
          for (const sel of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
            document.querySelector(sel)?.setAttribute("content", finalDescription);
          }
        }

        if (image) {
          document.querySelector('meta[property="og:image"]')
            ?.setAttribute("content", image);
          document.querySelector('meta[name="twitter:image"]')
            ?.setAttribute("content", image);
        }

        // CMS image fields are site-relative paths; social platforms and
        // crawlers need absolute URLs
        for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
          const el = document.querySelector(sel);
          const src = el?.getAttribute("content");
          if (src && src.startsWith("/")) el.setAttribute("content", origin + src);
        }
      })(${headParams})`);

      const html =
        "<!DOCTYPE html>\n" +
        (await page.evaluate("document.documentElement.outerHTML"));

      const outPath =
        route === "/"
          ? path.join(DIST, "index.html")
          : path.join(DIST, route.slice(1), "index.html");
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf-8");
      console.log(`[prerender] ${route} -> ${path.relative(process.cwd(), outPath)} (${(html.length / 1024).toFixed(0)}kb)`);
    }

    // The 404 page, drawn. Any path the router does not know renders NotFound;
    // the head is then rewritten the same way the bare fallback's was.
    await page.goto(`http://localhost:${PORT}/this-page-does-not-exist`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    const notFound =
      "<!DOCTYPE html>\n" + (await page.evaluate("document.documentElement.outerHTML"));
    await writeFile(path.join(DIST, "404.html"), notFoundHead(notFound), "utf-8");
    console.log("[prerender] 404.html rendered");
  } finally {
    if (browser) await browser.close();
    serverHandle.close();
  }
}

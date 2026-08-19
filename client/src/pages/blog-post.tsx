import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { Navbar } from "@/components/layout/Navbar";
import { useBlogPost, useBlogCategories, useBlogAuthors, useRelatedPosts } from "@/hooks/use-cms";
import type { Author } from "@shared/schema";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "u", "a", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code", "img", "hr", "span", "div", "figure",
  "figcaption", "iframe",
];
const ALLOWED_ATTRS = [
  "href", "src", "alt", "title", "target", "rel", "class", "id",
  "width", "height", "frameborder", "allowfullscreen", "allow", "loading", "decoding",
];

// Canonical origin for URLs baked into metadata. window.location.href can't be
// used for these: during build-time prerendering it points at the local
// snapshot server, and that URL would ship inside the static HTML.
const SITE_ORIGIN = "https://www.storyshaperscollective.com";

const VIDEO_HOSTS = new Set([
  "youtube.com", "youtube-nocookie.com", "vimeo.com", "player.vimeo.com",
  "www.youtube.com", "www.youtube-nocookie.com", "www.vimeo.com",
]);

function isAllowedIframeSrc(src: string): boolean {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return VIDEO_HOSTS.has(host);
  } catch {
    return false;
  }
}

function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Register hook before sanitizing — removes iframes with disallowed hosts
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const src = (node as Element).getAttribute("src") || "";
      if (!isAllowedIframeSrc(src)) {
        (node as Element).remove();
      }
    }
  });

  // Posts written before the editor started tagging images have no loading hint,
  // so every picture in them downloads up front whether or not the reader ever
  // scrolls that far. Defaulting them here fixes the back catalogue too, without
  // having to rewrite stored content.
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "IMG") {
      const el = node as Element;
      if (!el.getAttribute("loading")) el.setAttribute("loading", "lazy");
      if (!el.getAttribute("decoding")) el.setAttribute("decoding", "async");
    }
  });

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    ADD_ATTR: ["allowfullscreen"],
    FORBID_TAGS: ["script", "style"],
  });

  // Remove the hooks after each call to avoid accumulation
  DOMPurify.removeHook("uponSanitizeElement");
  DOMPurify.removeHook("afterSanitizeAttributes");

  return clean;
}

function SubscribeModule({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: `blog-post-${slug}` }),
      });
      if (res.status === 409) { setState("duplicate"); return; }
      if (!res.ok) { setState("error"); return; }
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(123,30,122,0.1)",
        border: "1px solid rgba(123,30,122,0.2)",
        borderRadius: "16px",
        padding: "2rem",
        margin: "2.5rem 0",
        textAlign: "center",
      }}
      data-testid="subscribe-module-post"
    >
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#a78bfa", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Stay in the loop
      </p>
      <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.1rem", color: "#FFFFFF", fontWeight: 400, marginBottom: "0.35rem" }}>
        New pieces, when they're ready.
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem" }}>
        No newsletters. Just a note when something worth reading goes live.
      </p>

      {state === "success" ? (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#4ade80" }} data-testid="subscribe-success-post">
          You're in. We'll let you know when new pieces go live.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem",
              color: "#FFFFFF",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "0.6rem 0.9rem",
              outline: "none",
              width: "240px",
            }}
            data-testid="input-subscribe-email-post"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "#FFFFFF",
              backgroundColor: "#7B1E7A",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.1rem",
              cursor: state === "loading" ? "default" : "pointer",
              opacity: state === "loading" ? 0.7 : 1,
            }}
            data-testid="button-subscribe-submit-post"
          >
            {state === "loading" ? "..." : "SUBSCRIBE"}
          </button>
        </form>
      )}
      {state === "duplicate" && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#a78bfa", marginTop: "0.5rem" }}>You're already subscribed.</p>}
      {state === "error" && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#f87171", marginTop: "0.5rem" }}>Something went wrong. Please try again.</p>}
    </div>
  );
}

function SharingRow({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnBase: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.58rem",
    letterSpacing: "0.1em",
    borderRadius: "6px",
    padding: "0.45rem 0.85rem",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "all 0.2s",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }} data-testid="sharing-row">
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginRight: "0.25rem" }}>
        Share
      </span>
      <button onClick={copyLink} style={btnBase} data-testid="button-copy-link">
        {copied ? "✓ COPIED!" : "COPY LINK"}
      </button>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={btnBase} data-testid="link-share-x">
        𝕏 POST
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={btnBase} data-testid="link-share-linkedin">
        in SHARE
      </a>
    </div>
  );
}

function AuthorBlock({ authorId, authorName, authors }: { authorId: number | null; authorName: string; authors: Author[] }) {
  const author = authorId ? authors.find((a) => a.id === authorId) : null;

  if (!author) {
    return (
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "2rem",
          marginTop: "2.5rem",
        }}
        id="author"
        data-testid="author-block"
      >
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
          By <span style={{ color: "rgba(255,255,255,0.8)" }}>{authorName}</span>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "2rem",
        marginTop: "2.5rem",
        display: "flex",
        gap: "1.25rem",
        alignItems: "flex-start",
      }}
      id="author"
      data-testid="author-block"
    >
      {author.photo && (
        // The bio sits below the article, so this one can wait. The small byline
        // portrait at the top of the page stays eager — it is in the first screen.
        <img
          src={author.photo}
          alt={author.name}
          loading="lazy"
          decoding="async"
          style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(167,139,250,0.3)" }}
          data-testid="img-author-photo"
        />
      )}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            marginBottom: "0.35rem",
          }}
        >
          About the author
        </p>
        <a
          href="#author"
          style={{ textDecoration: "none" }}
          data-testid="link-author-name"
        >
          <p
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "1.05rem",
              color: "#FFFFFF",
              fontWeight: 400,
              marginBottom: "0.5rem",
            }}
            data-testid="text-author-name"
          >
            {author.name}
          </p>
        </a>
        {author.bio && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              marginBottom: "0.75rem",
            }}
            data-testid="text-author-bio"
          >
            {author.bio}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#a78bfa", textDecoration: "none" }}
              data-testid="link-author-linkedin"
            >
              LinkedIn →
            </a>
          )}
          {author.twitter && (
            <a
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#a78bfa", textDecoration: "none" }}
              data-testid="link-author-twitter"
            >
              𝕏 →
            </a>
          )}
          {author.website && (
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#a78bfa", textDecoration: "none" }}
              data-testid="link-author-website"
            >
              Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function RelatedPosts({ slug, categories }: { slug: string; categories: any[] }) {
  const { data: related } = useRelatedPosts(slug);

  if (!related || related.length === 0) return null;

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId)?.name || null;
  };

  return (
    <div style={{ marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }} data-testid="related-posts">
      <h3
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}
      >
        Read this next
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {related.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "border-color 0.2s",
              }}
              className="hover:border-[rgba(123,30,122,0.3)]"
              data-testid={`related-post-${post.id}`}
            >
              {post.featuredImage && (
                // Sixty pixels of thumbnail at the very bottom of the article, and
                // the stored file behind it can run to several megabytes. None of
                // it is worth fetching until the reader actually gets down here.
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  {getCategoryName(post.categoryId) && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#a78bfa", textTransform: "uppercase" }}>
                      {getCategoryName(post.categoryId)}
                    </span>
                  )}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>
                    {post.readingTime} min read
                  </span>
                </div>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.95rem", color: "#FFFFFF", fontWeight: 400, lineHeight: 1.4 }}>
                  {post.title}
                </p>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { data: post, isLoading, error } = useBlogPost(slug);
  const { data: categories } = useBlogCategories();
  const { data: authors } = useBlogAuthors();

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId || !categories) return null;
    return categories.find((c) => c.id === categoryId)?.name || null;
  };

  const formatDate = (dateStr: string | Date) => {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  useEffect(() => {
    if (!post) return;

    const prevTitle = document.title;
    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || post.excerpt;
    const ogImage = post.ogImage || post.featuredImage;
    const canonicalUrl = post.canonicalUrl || `${SITE_ORIGIN}/blog/${post.slug}`;

    document.title = metaTitle;

    const createdElements: Element[] = [];
    const previousValues: { el: Element; attr: string; value: string | null }[] = [];

    const setMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
        createdElements.push(el);
      } else {
        previousValues.push({ el, attr: "content", value: el.getAttribute("content") });
      }
      el.setAttribute("content", content);
    };

    setMeta("description", metaDescription);
    setMeta("og:title", metaTitle, true);
    setMeta("og:description", metaDescription, true);
    setMeta("og:type", "article", true);
    setMeta("og:url", canonicalUrl, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    setMeta("twitter:title", metaTitle);
    setMeta("twitter:description", metaDescription);
    if (ogImage) setMeta("twitter:image", ogImage);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const createdCanonical = !canonicalEl;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    const prevCanonical = canonicalEl.href;
    canonicalEl.href = canonicalUrl;

    let jsonLd = document.querySelector('script[data-blog-jsonld]') as HTMLScriptElement | null;
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.setAttribute("data-blog-jsonld", "true");
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: metaDescription,
      image: ogImage ? (ogImage.startsWith("/") ? SITE_ORIGIN + ogImage : ogImage) : undefined,
      author: { "@type": "Person", name: post.authorName },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      publisher: { "@type": "Organization", name: "The Story Shapers" },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      wordCount: post.content?.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length || 0,
      timeRequired: `PT${post.readingTime || 1}M`,
    });

    return () => {
      document.title = prevTitle;
      document.querySelector('script[data-blog-jsonld]')?.remove();
      createdElements.forEach((el) => el.remove());
      previousValues.forEach(({ el, attr, value }) => { if (value !== null) el.setAttribute(attr, value); });
      if (createdCanonical && canonicalEl) canonicalEl.remove();
      else if (canonicalEl) canonicalEl.href = prevCanonical;
    };
  }, [post]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex justify-center items-center pt-32">
          <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4">
          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.5rem", color: "#FFFFFF", marginBottom: "1rem" }}>
            Post not found
          </h1>
          <Link href="/blog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textDecoration: "none" }} data-testid="link-back-to-blog">
            &larr; BACK TO BLOG
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = getCategoryName(post.categoryId);
  const authorList = authors || [];

  return (
    <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh" }}>
      <Navbar />

      <article className="px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-[700px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-10 group"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.5)", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}
              data-testid="link-back-to-blog"
            >
              <span style={{ transition: "transform 0.2s", display: "inline-block" }} className="group-hover:-translate-x-1">&larr;</span>
              BACK TO BLOG
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              {categoryName && (
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#a78bfa", backgroundColor: "rgba(167,139,250,0.12)", padding: "0.25rem 0.6rem", borderRadius: "4px", textTransform: "uppercase" }}
                  data-testid="text-post-category"
                >
                  {categoryName}
                </span>
              )}
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}
                data-testid="text-post-reading-time"
              >
                {post.readingTime} min read
              </span>
            </div>

            <h1
              style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#FFFFFF", fontWeight: 400, lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}
              data-testid="text-post-title"
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const author = post.authorId ? authorList.find((a) => a.id === post.authorId) : null;
                  return author?.photo ? (
                    <a href="#author" style={{ flexShrink: 0, textDecoration: "none" }}>
                      <img src={author.photo} alt={author.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(167,139,250,0.3)" }} />
                    </a>
                  ) : null;
                })()}
                <a
                  href="#author"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                  data-testid="text-post-author"
                >
                  {post.authorName}
                </a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }} data-testid="text-post-date">
                  {post.publishedAt ? formatDate(post.publishedAt) : ""}
                </span>
              </div>
              <SharingRow title={post.title} slug={post.slug} />
            </div>

            <div style={{ height: "1px", background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)", marginTop: "1.5rem" }} />
          </motion.header>

          {post.featuredImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-10">
              <img
                src={post.featuredImage}
                alt={post.title}
                style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}
                data-testid="img-featured"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="blog-content"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.85 }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            data-testid="text-post-content"
          />

          {/* Author bio block */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <AuthorBlock authorId={post.authorId} authorName={post.authorName} authors={authorList} />
          </motion.div>

          {/* Subscribe module */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}>
            <SubscribeModule slug={post.slug} />
          </motion.div>

          {/* Related posts */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <RelatedPosts slug={post.slug} categories={categories || []} />
          </motion.div>

          {/* Bottom sharing + back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 pt-8 flex items-center justify-between flex-wrap gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Link
              href="/blog"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textDecoration: "none", transition: "color 0.2s" }}
              data-testid="link-back-to-blog-bottom"
            >
              &larr; ALL POSTS
            </Link>
            <SharingRow title={post.title} slug={post.slug} />
          </motion.div>
        </div>
      </article>

      <style>{`
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          display: block;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}

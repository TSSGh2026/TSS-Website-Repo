import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { useBlogPosts, useBlogCategories, useFeaturedPost, useCmsSettings } from "@/hooks/use-cms";
import type { BlogPost } from "@shared/schema";

function SubscribeModule() {
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
        body: JSON.stringify({ email: email.trim(), source: "blog-listing" }),
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
        backgroundColor: "rgba(123,30,122,0.12)",
        border: "1px solid rgba(123,30,122,0.25)",
        borderRadius: "16px",
        padding: "2.5rem 2rem",
        textAlign: "center",
        margin: "4rem 0 2rem",
      }}
      data-testid="subscribe-module"
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          color: "#a78bfa",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}
      >
        Stay in the loop
      </p>
      <h3
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: "1.35rem",
          color: "#FFFFFF",
          fontWeight: 400,
          marginBottom: "0.5rem",
        }}
      >
        New pieces, when they're ready.
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.55)",
          marginBottom: "1.5rem",
        }}
      >
        No newsletters. Just a note when something worth reading goes live.
      </p>

      {state === "success" ? (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            color: "#4ade80",
          }}
          data-testid="subscribe-success"
        >
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
              fontSize: "0.85rem",
              color: "#FFFFFF",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "0.65rem 1rem",
              outline: "none",
              width: "280px",
            }}
            data-testid="input-subscribe-email"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: "#FFFFFF",
              backgroundColor: "#7B1E7A",
              border: "none",
              borderRadius: "8px",
              padding: "0.65rem 1.25rem",
              cursor: state === "loading" ? "default" : "pointer",
              opacity: state === "loading" ? 0.7 : 1,
            }}
            data-testid="button-subscribe-submit"
          >
            {state === "loading" ? "..." : "SUBSCRIBE"}
          </button>
        </form>
      )}
      {state === "duplicate" && (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#a78bfa", marginTop: "0.5rem" }}>
          You're already subscribed.
        </p>
      )}
      {state === "error" && (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#f87171", marginTop: "0.5rem" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

function PostCard({ post, categories, index }: { post: BlogPost; categories: any[]; index: number }) {
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId)?.name || null;
  };

  const formatDate = (dateStr: string | Date) => {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          className="hover:border-[rgba(123,30,122,0.3)] hover:bg-[rgba(255,255,255,0.05)]"
          data-testid={`card-blog-post-${post.id}`}
        >
          {post.featuredImage && (
            <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
              <img
                src={post.featuredImage}
                alt={post.title}
                /* Featured images are stored at their original upload size — a
                   few are several megabytes — and every card on this page was
                   fetching one eagerly to fill a 180px box. Deferring the
                   offscreen ones is the half of that we can fix from here; the
                   stored files still need to come down. */
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                data-testid={`img-blog-post-${post.id}`}
              />
            </div>
          )}
          <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
            <div className="flex items-center gap-3 mb-3">
              {getCategoryName(post.categoryId) && (
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    color: "#a78bfa",
                    backgroundColor: "rgba(167,139,250,0.12)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                  data-testid={`text-category-${post.id}`}
                >
                  {getCategoryName(post.categoryId)}
                </span>
              )}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.05em",
                }}
              >
                {post.readingTime} min read
              </span>
            </div>

            <h3
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "1.05rem",
                color: "#FFFFFF",
                lineHeight: 1.4,
                marginBottom: "0.75rem",
                fontWeight: 400,
              }}
              data-testid={`text-post-title-${post.id}`}
            >
              {post.title}
            </h3>

            {post.excerpt && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                data-testid={`text-post-excerpt-${post.id}`}
              >
                {post.excerpt}
              </p>
            )}

            <div
              className="flex items-center justify-between mt-auto pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.4)",
                }}
                data-testid={`text-post-author-${post.id}`}
              >
                {post.authorName}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.3)",
                }}
                data-testid={`text-post-date-${post.id}`}
              >
                {post.publishedAt ? formatDate(post.publishedAt) : ""}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Blog() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const { data: categoriesData } = useBlogCategories();
  const { data: featuredData } = useFeaturedPost();
  const { data: settings } = useCmsSettings();
  const blogSettings = (settings as any)?.blog || {};
  const blogLabel = blogSettings.label || "Blog";
  const blogHeading = blogSettings.heading || "Notes from the Margins";
  const blogSubtext = blogSettings.subtext || "Because good brands are built on thinking, not just things to post.";
  const { data, isLoading } = useBlogPosts({
    page,
    categoryId: selectedCategory,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;
  const categories = categoriesData || [];

  const formatDate = (dateStr: string | Date) => {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId)?.name || null;
  };

  const featuredPost = featuredData;
  const gridPosts = selectedCategory
    ? posts
    : posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh" }}>
      <Navbar />

      <div className="px-4 md:px-8 lg:px-12 pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="block mb-4"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
              data-testid="text-blog-label"
            >
              {blogLabel}
            </span>

            <h1
              className="mb-4"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#FFFFFF",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
              data-testid="text-blog-heading"
            >
              {blogHeading}
            </h1>

            <p
              className="mb-8"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.6)",
                maxWidth: "600px",
                lineHeight: 1.7,
              }}
              data-testid="text-blog-subtext"
            >
              {blogSubtext}
            </p>

            <div
              style={{
                height: "1px",
                background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)",
                marginBottom: "2rem",
              }}
            />
          </motion.div>

          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-8 flex flex-wrap gap-2"
            >
              <button
                onClick={() => { setSelectedCategory(undefined); setPage(1); }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: !selectedCategory ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                  backgroundColor: !selectedCategory ? "rgba(123,30,122,0.3)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${!selectedCategory ? "rgba(123,30,122,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "6px",
                  padding: "0.45rem 0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                data-testid="button-filter-all"
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    color: selectedCategory === cat.id ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                    backgroundColor: selectedCategory === cat.id ? "rgba(123,30,122,0.3)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${selectedCategory === cat.id ? "rgba(123,30,122,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "6px",
                    padding: "0.45rem 0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "uppercase",
                  }}
                  data-testid={`button-filter-category-${cat.id}`}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>Loading...</p>
            </div>
          ) : posts.length === 0 && !featuredPost ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "3rem 2rem",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "0.75rem",
                  }}
                  data-testid="text-blog-empty"
                >
                  No posts yet.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                  Check back soon for insights on brand strategy, content systems, and marketing that makes sense.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Featured hero — only when no category filter */}
              {!selectedCategory && featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="mb-12"
                >
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(123,30,122,0.25)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns: featuredPost.featuredImage ? "1fr 1fr" : "1fr",
                        minHeight: "340px",
                        transition: "border-color 0.3s",
                      }}
                      className="hover:border-[rgba(123,30,122,0.5)] md:grid-cols-2 grid-cols-1"
                      data-testid="card-featured-post"
                    >
                      {featuredPost.featuredImage && (
                        <div style={{ overflow: "hidden", maxHeight: "400px" }}>
                          <img
                            src={featuredPost.featuredImage}
                            alt={featuredPost.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            data-testid="img-featured-hero"
                          />
                        </div>
                      )}
                      <div
                        style={{
                          padding: "2.5rem",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "0.55rem",
                              letterSpacing: "0.2em",
                              color: "#a78bfa",
                              textTransform: "uppercase",
                            }}
                          >
                            Featured
                          </span>
                          {getCategoryName(featuredPost.categoryId) && (
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.55rem",
                                letterSpacing: "0.1em",
                                color: "#a78bfa",
                                backgroundColor: "rgba(167,139,250,0.12)",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                textTransform: "uppercase",
                              }}
                            >
                              {getCategoryName(featuredPost.categoryId)}
                            </span>
                          )}
                        </div>

                        <h2
                          style={{
                            fontFamily: "'Libre Baskerville', serif",
                            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                            color: "#FFFFFF",
                            fontWeight: 400,
                            lineHeight: 1.3,
                            letterSpacing: "-0.02em",
                            marginBottom: "1rem",
                          }}
                          data-testid="text-featured-title"
                        >
                          {featuredPost.title}
                        </h2>

                        {featuredPost.excerpt && (
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.9rem",
                              color: "rgba(255,255,255,0.6)",
                              lineHeight: 1.7,
                              marginBottom: "1.5rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                            data-testid="text-featured-excerpt"
                          >
                            {featuredPost.excerpt}
                          </p>
                        )}

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.8rem",
                              color: "rgba(255,255,255,0.45)",
                            }}
                          >
                            {featuredPost.authorName}
                            {featuredPost.publishedAt && (
                              <> · {formatDate(featuredPost.publishedAt)}</>
                            )}
                          </span>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "0.6rem",
                              letterSpacing: "0.1em",
                              color: "#a78bfa",
                            }}
                          >
                            READ ARTICLE →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {gridPosts.length > 0 && (
                <>
                  {!selectedCategory && featuredPost && (
                    <h2
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Recent
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} categories={categories} index={index} />
                    ))}
                  </div>
                </>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: page <= 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "0.5rem 1rem",
                      cursor: page <= 1 ? "default" : "pointer",
                      letterSpacing: "0.1em",
                    }}
                    data-testid="button-prev-page"
                  >
                    PREV
                  </button>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.5)",
                    }}
                    data-testid="text-page-info"
                  >
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: page >= totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "0.5rem 1rem",
                      cursor: page >= totalPages ? "default" : "pointer",
                      letterSpacing: "0.1em",
                    }}
                    data-testid="button-next-page"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </>
          )}

          <SubscribeModule />
        </div>
      </div>
    </div>
  );
}

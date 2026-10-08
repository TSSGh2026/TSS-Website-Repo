import { useQuery } from "@tanstack/react-query";
import type { BlogPost, BlogCategory, Author, EmailSubscriber } from "@shared/schema";

export function useCmsSettings() {
  return useQuery<Record<string, any>>({
    queryKey: ["/api/cms/settings"],
    staleTime: 60000,
  });
}

/* useCmsServices was removed on 26 Aug along with the route it called. A hook
   pointing at a deleted endpoint is worse than no hook — it compiles, it looks
   available, and it 404s at runtime. */

export function useBlogPosts(options?: { page?: number; categoryId?: number; limit?: number }) {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.categoryId) params.set("categoryId", String(options.categoryId));
  const qs = params.toString();
  return useQuery<{ posts: BlogPost[]; total: number; page: number; totalPages: number }>({
    queryKey: ["/api/blog/posts" + (qs ? `?${qs}` : "")],
    staleTime: 60000,
  });
}

export function useFeaturedPost() {
  return useQuery<BlogPost>({
    queryKey: ["/api/blog/featured"],
    staleTime: 60000,
  });
}

export function useRelatedPosts(slug: string) {
  return useQuery<BlogPost[]>({
    queryKey: [`/api/blog/posts/${slug}/related`],
    staleTime: 60000,
    enabled: !!slug,
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: [`/api/blog/posts/${slug}`],
    staleTime: 60000,
    enabled: !!slug,
  });
}

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: ["/api/blog/categories"],
    staleTime: 60000,
  });
}

export function useBlogAuthors() {
  return useQuery<Author[]>({
    queryKey: ["/api/blog/authors"],
    staleTime: 60000,
  });
}

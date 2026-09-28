import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import OurStory from "@/pages/our-story";
import Join from "@/pages/join";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Portfolio from "@/pages/portfolio";
import TeamPage from "@/pages/team";
import OfferPage from "@/pages/offer";
import OfferTermsPage from "@/pages/offer-terms";
import BooksPage from "@/pages/books";

const PORTFOLIO_SLUGS = ["fatema", "shaili", "aakanksha"];

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    /* A hash owns the scroll. The footer's "The Shapers" is /#act-peak from
       anywhere but the homepage, and scrolling to the top on arrival would put
       the reader six screens above the thing they asked for. Home reads the
       hash itself once its acts have their real heights. */
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/our-story" component={OurStory} />
        <Route path="/join" component={Join} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/team" component={TeamPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/offer/terms" component={OfferTermsPage} />
        <Route path="/offer" component={OfferPage} />
        <Route path="/books" component={BooksPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        {PORTFOLIO_SLUGS.map((slug) => (
          <Route key={slug} path={`/${slug}`} component={Portfolio} />
        ))}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

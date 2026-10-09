/**
 * Where each case study lives, as /work/<slug>.
 *
 * Its own file, with nothing imported, because two very different things read
 * it: the client (data/cases.ts, which also imports five photographs) and the
 * build-time prerender, which runs in Node and cannot import a .webp. Same
 * arrangement as shared/hero.ts.
 *
 * The keys are the case ids in data/cases.ts. A case without a slug here has no
 * page, and cases.ts throws at load rather than publish a link to nowhere.
 *
 * These are public URLs. Changing one after it has been indexed or shared
 * breaks it, so a rename needs a redirect in vercel.json, not just an edit.
 */
export const CASE_SLUGS: Record<string, string> = {
  lbb: "little-black-book",
  social: "social",
  ccpl: "centre-court-pickleball-league",
  headout: "headout",
  tuisa: "tuisa",
  postcard: "postcard-travel-club",
  kelly: "kelly-and-crew",
};

export const WORK_ROUTES: string[] = [
  "/work",
  ...Object.values(CASE_SLUGS).map((slug) => `/work/${slug}`),
];

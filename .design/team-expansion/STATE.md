# Team expansion — state

Paused 18 Sep 2026, waiting on Fatema for final copy and the three profiles.
Branch `team/collective-tier`, cut from `origin/full-v1` (the repo's default
branch — there is no `main`). **Committed locally. Nothing pushed. No PR.**

---

## Decided

**Who they are.** Ahalya, Sreepathy and Raayeed are **specialists, not partners**.
Fatema's words, and it settles the format: they are a different category of
person, not a junior tier of founder.

**Where they go.** `/team`, as a second movement under the founders. The homepage
gets a **door only** — one link, no names, no faces. Fatema chose this over
naming them on the homepage or giving them full homepage presence.

**The entry format**, confirmed by her explicitly:

> picture → eyebrow (the craft they specialise in) → name → a short line about
> them

and nothing else. **No LinkedIn, no links, no handles.** No client list on the
specialist tier.

**The shape of the tier.** A horizontal index — photo left, craft and name and
line beside it, hairline between entries. NOT a smaller card. See the long
comment above `Specialists()` in `client/src/pages/team.tsx` for why; the short
version is that differentiating a tier purely by taking things away reads as a
demotion, and these are real people who agreed to be featured.

---

## Open — what she is coming back with

1. **The `/team` standfirst copy.** Three options were rendered in place for her
   to choose from. **B is currently in the code:**

   - **A** — "The collective that holds your story together."
   - **B** — "The collective that holds your story together. One team on the
     brief, from the thinking to the making."
   - **C** — "The collective that holds your story together. Strategy and craft
     working the same brief, at the same time."

   She rejected two earlier drafts for signalling hierarchy. The rule learned:
   this line must sound like one team already working together, not like an
   explanation of who ranks where.

2. **The three profiles.** Not yet requested from Ahalya, Sreepathy or Raayeed.
   The forwardable brief is `PROFILE-BRIEF.md` in this folder. Everything in the
   `SPECIALISTS` array in `client/src/pages/team.tsx` is invented placeholder
   text and is the first thing to delete when the real submissions land.

3. **"Other details"** — unspecified, she will bring them.

---

## Open — things she has not been asked to decide yet

- **The `/team` hero's belief line** still reads "...when strategy, content, and
  editorial thinking move together." That enumerates only the founders' three
  crafts and now excludes design, motion and photography, which sit directly
  below it. Raised with her once; no decision taken.
- **`/our-story`** is built on CMS keys including one literally called
  "threeHumans". Deliberately untouched. A later copy decision.
- **The homepage door has not had the independent design-review pass.** The
  `/team` page has. The door is one link, but it sits on the most load-bearing
  moment on the site, so run the pass before any PR.

---

## Blocking engineering work, whenever this ships

**A person cannot be added through the CMS.** The Portfolios tab in the admin
dashboard is edit-only: there is no "add member" button and no POST route.
`createTeamMemberPortfolio` exists in `server/storage.ts` and nothing calls it.
The founders' three rows were seeded straight into the database.

That is why the specialists are hardcoded in `client/src/pages/team.tsx` rather
than CMS-backed. Wiring them up means adding the route and the button first —
worth doing properly so the fourth specialist does not need a developer.

---

## What changed in the code

- `client/src/pages/team.tsx` — the whole of movement two, plus: hero subtext
  de-counted ("Three senior strategists" would have gone stale), portfolio link
  made conditional, both movement labels promoted to `h2` with the founder
  headlines dropped to `h3` (the specialists were being announced as children of
  Aakanksha's card), entrance animations gated on `useReducedMotion`.
- `client/src/components/home/Team.tsx` — the door at the end of the peak's
  convergence panel. The peak's claim line itself is untouched.

Nothing else on the site is touched.

---

## Running it locally

`npm run dev:client` serves the app but there is no local `DATABASE_URL`, so the
founders' three cards render as an empty band. Use the preview config instead,
which proxies `/api`, `/assets` and `/img` to production:

```
npx vite dev --config vite.config.ts.preview.mts --port 5000
```

`vite.config.ts.preview.mts` is untracked and already covered by the
`vite.config.ts.*` line in `.gitignore`. It is a local convenience, not part of
the build, and must never end up in the PR.

The peak's door only exists at a particular scroll offset because the act is
pinned. To land on it: scroll to `#act-peak`'s top plus 0.9 of
`(offsetHeight - innerHeight)`. Using the full `offsetHeight` scrolls clean past
the pin into the next act.

## Renders and the scripts that made them

In `.design/shots/team-expansion/` — gitignored, like every other screenshot in
this repo, because they are regenerable and not source.

- `team-1440-full.png`, `team-390-full.png` — the whole /team page
- `peak-door-1440.png`, `peak-door-390.png` — the homepage door in the peak
- `variant-A/B/C.png`, `copy-variants.png` — the three standfirst options in place
- `team-reduced-motion.png` — proof the page still renders with motion off

The three `shoot-*.mjs` scripts regenerate all of it. Run them with the preview
server up. They drive headless Chrome through `puppeteer-core` and intercept
`/api`, `/assets` and `/img` to production, so they work without a database and
never touch the real browser.

`shoot-variants.mjs` swaps the standfirst text on the live page rather than
mocking it up, so each option is in the real face at the real size — useful again
when she picks, or if the copy needs another round.

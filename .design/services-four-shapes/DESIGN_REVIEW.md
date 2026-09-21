# Act five — the four disciplines

Branch: `services/four-shapes` (off `origin/full-v1` @ 9b14d75)
Source brief: `~/Downloads/TSS Core Offerings IMP .md`
Last updated: 21 Sep 2026
Status: **not committed** — awaiting Fatema's verdict

## Where it landed

In act five, in place of Shape / Scale / Sharpen. Nothing else on the page
moved. Four disciplines — Brand, Content, Discovery, Systems — with **three
services under each**, and a single link out.

## The three attempts that failed, and why

All three were rejected by Fatema, and the third rejection is the one that
mattered because it was not about layout.

**1 · Four cards, detail on click.** Sparse fronts, a panel that wiped open
under the row. Failed on the only test available: she did not know the cards
were clickable, and read the "01 02 03 04" as a numbered sequence. A menu that
hides the menu is a menu you have to be taught.

**2 · Everything visible, three layouts.** Contents-page columns, ruled rows,
and a billing block, all forty-four services on the page. Rejected as "a long
laundry list", unskimmable, no decision to make.

**3 · The real finding.** *"If you're everything to everybody, then you're
nothing to anybody. What do you specialize in?"*

That is not a layout note. The page had already made her argument two acts
earlier — the turn reads "Most marketing problems aren't just execution
problems. They are primarily story problems." A section that then lists
forty-four deliverables argues with the act above it. And the rail between
them sides with the turn: Tuisa and Social are positioning, CCPL is a launch,
LBB is editorial holding a verdict, Headout is an operating model. Not one of
the five is a procurement exercise.

So the constraint became the fix. Twelve on the page, not forty-four.

## What is on the page

| Discipline | The line | The three |
| --- | --- | --- |
| Brand | Make people understand why you, not someone else. | Positioning & brand narrative · Naming & verbal identity · Go-to-market strategy |
| Content | Give the brand something worth saying. Consistently. | Website copy & content architecture · Editorial & thought leadership · Social & campaigns |
| Discovery | Getting discovered is useful. Being the answer is better. | SEO strategy & content · AEO & AI discoverability · Conversion content & CRO |
| Systems | Make good work possible at scale. | Content operating models · AI-assisted content systems · Fractional content & brand leadership |

Each of the twelve is something a case study on the rail already proves.

The other **thirty-two** are still in `Shapes.tsx` under `rest` — kept so a
`/services` page has a source when it is built, and so nobody has to go back to
the brief to reconstruct them. **This is the open decision: those thirty-two
need a home, or they need to be dropped.** They carry real long-tail search
value against the AEO work, which argues for the page.

## Copy edits against the brief

1. **"or do all three" → cut.** The paragraph it closed ("There's more than one
   way to shape a story") is cut entirely — Fatema's call.
2. **Discovery's line is now the brief's closing line.** "Getting discovered is
   useful. Being the answer is better." replaced "Make sure the right people
   can actually find it." They say the same thing; only one says it with a
   point of view.
3. **"STRATEGIC SYSTEMS & OPERATIONS" → "Systems"**, to sit with the other
   three one-word names.
4. **The four second lines are not used.** "Positioning, identity and the
   thinking that makes a brand distinctly itself," and its three siblings.
5. **"Measurement frameworks" appeared under both Discovery and Systems.** Kept
   with the search work whose performance it measures.
6. **One link, not four.** "Tell us what you're working on." The old section put
   a `?stage=` link under each row because those were three situations a reader
   recognised themselves in. These are disciplines; nobody arrives wanting
   exactly one.

## Rules this section is now built on

Written down because each one was learned by breaking it.

- **Nothing behind anything.** No click-to-reveal in a services menu.
- **No numerals.** They read as steps, and these are not steps.
- **No counts.** An inventory invites the reader to notice which one is thin.
- **No dashes in front of items.** At this many it is a texture, and a tacky
  one. White space and alignment do the same work.
- **Fewer than you offer.** The homepage names what you specialise in. The
  catalogue lives somewhere else.

## Screenshots

`final-1440.jpg`, `final-900.jpg`, `final-390.jpg` — the version on the page
now.

`rejected/` keeps one frame of each thing that was tried and turned down, so
the argument above is legible without re-reading it:

| | |
| --- | --- |
| `02-shapes-brand-1440.jpg` | attempt 1 — four cards, detail on click |
| `A-columns-1440.jpg` | attempt 2A — all 44, contents-page columns |
| `B-index-1440.jpg` | attempt 2B — all 44, ruled rows |
| `C-run-1440.jpg` | attempt 2C — all 44, billing block |

The full set ran to 42MB of 2× PNGs, which is not a thing to put in a repo.
These are downscaled JPEGs; `shoot.mjs` regenerates the originals at any time.

Captured with `shoot.mjs` against `npm run dev:client` on port 5000, with
`prefers-reduced-motion: reduce` emulated — every act paints from a
scroll-progress MotionValue and Act.tsx puts those at their end state under
reduced motion, so a still capture without it is a section at opacity 0.

## Measured

| Check | Result |
| --- | --- |
| Horizontal overflow at 360px | none |
| Heading order across the page | H1 → H2 → H3 … no skipped level |
| Contrast, all text | 5.26:1 and above |

## Ship-time

- Nothing in the codebase links to `#services`; the id is kept anyway.
- `Services.tsx` — Shape / Scale / Sharpen — is superseded and unreferenced,
  the way the CMS service rows already are. Still in the tree.
- `contact.tsx` is untouched; the new section sends no `?stage=`.

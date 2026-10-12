/**
 * The key a homepage card leaves on its own history entry, holding how far down
 * the page the reader was when they left for a case study.
 *
 * Three files share it: the card writes it (home/Work.tsx), the router's
 * scroll-to-top stands aside for it (App.tsx), and the homepage reads it back
 * once its acts have their real heights (pages/home.tsx).
 *
 * It lives on the history entry rather than in session storage so that it
 * belongs to one visit to the page: Back finds it, a fresh click on the logo
 * does not.
 */
export const HOME_Y = "homeY";

/** Where Back should put the reader on the homepage, or null for a fresh arrival. */
export function savedHomeY(): number | null {
  const y = window.history.state?.[HOME_Y];
  return typeof y === "number" ? y : null;
}

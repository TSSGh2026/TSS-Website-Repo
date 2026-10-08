import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const TYPE_MS = 42;
const DELETE_MS = 22;
const HOLD_MS = 2600;

/**
 * Types each phrase out character by character, holds, deletes, moves on.
 * With reduced motion it shows the first phrase and stops. The caller reserves
 * the vertical space, so nothing above this ever reflows.
 */
export function WordCycler({ words }: { words: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const word = words[index] ?? "";

    if (!deleting && count === word.length) {
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (deleting && count === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => setCount((c) => c + (deleting ? -1 : 1)),
      deleting ? DELETE_MS : TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [count, deleting, index, reduced, words]);

  const visible = reduced
    ? (words[0] ?? "")
    : (words[index] ?? "").slice(0, count);

  return (
    <>
      {/* Coloured away from the static headline so the line reads as the part
          that is filling itself in, not as more headline. */}
      <span aria-hidden data-typed className="text-[#c084fc]">
        {visible}
        {!reduced && (
          <span className="caret ml-1 inline-block h-[0.78em] w-[2px] translate-y-[0.02em] bg-magenta-lift" />
        )}
      </span>
      {/* Screen readers get one clean sentence, not five typed-out variants. */}
      <span className="sr-only">{words[0]}</span>
    </>
  );
}

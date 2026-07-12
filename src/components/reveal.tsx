"use client";

import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger the reveal of direct children (for card grids). */
  stagger?: boolean;
  /** Rendered element, defaults to div. */
  as?: ElementType;
};

/**
 * Scroll-reveal wrapper. Children are server-rendered as-is (SEO-safe).
 * After hydration, elements still below the viewport are hidden via a data
 * attribute and revealed by an IntersectionObserver when scrolled into view.
 * Above-the-fold content, crawlers, no-JS users, and users with
 * prefers-reduced-motion are never affected.
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only hide elements the user hasn't seen yet (below the fold).
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return;

    const attr = stagger ? "data-reveal-stagger" : "data-reveal";
    el.setAttribute(attr, "");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-revealed", "");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return createElement(as, { ref, className }, children);
}

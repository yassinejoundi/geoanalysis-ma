"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";

const revealSelector = [
  "main h1, main h2, main h3, main p, main li, main form",
  "main [class*=\"-card\"], main [class*=\"-item\"], main [class*=\"-block\"], main [class*=\"-feature\"], main [class*=\"-image\"], main [class*=\"-placeholder\"]",
  "main .home-stats > div, main .home-method-grid > div, main .project-results-list > div, main .contact-details-list > div, main .contact-map",
  "main .editorial-detail-body > *, main .editorial-detail-copy",
  "main .project-detail-back .project-back-link, main .expertise-detail-back .expertise-back-link",
  ".site-conversion h2, .site-conversion p, .site-conversion li, .site-conversion a",
  ".site-footer-brand > *, .site-footer-grid nav h2, .site-footer-grid nav li",
].join(",");

function isRevealGroup(element: HTMLElement) {
  return (
    element.matches(
      "li, form, .home-stats > div, .home-method-grid > div, .project-results-list > div, .contact-details-list > div, .contact-map, .editorial-detail-copy",
    ) ||
    Array.from(element.classList).some((name) =>
      /-(card|item|block|feature|image|placeholder)$/.test(name),
    )
  );
}

function hasRevealGroupAncestor(element: HTMLElement) {
  let ancestor = element.parentElement;
  while (ancestor && !ancestor.matches("main, footer, .site-conversion")) {
    if (ancestor instanceof HTMLElement && isRevealGroup(ancestor)) return true;
    ancestor = ancestor.parentElement;
  }
  return false;
}

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector(".site-content");
    if (!root) return;

    const seen = new WeakSet<HTMLElement>();
    const stopObserving = new Set<() => void>();

    function scan() {
      for (const element of document.querySelectorAll<HTMLElement>(revealSelector)) {
        if (seen.has(element) || hasRevealGroupAncestor(element)) continue;
        seen.add(element);

        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) continue;

        element.style.opacity = "0";
        const siblings = Array.from(element.parentElement?.children ?? []);
        const index = siblings.filter((sibling) => sibling.matches(revealSelector)).indexOf(element);
        const delay = Math.min(index * 0.06, 0.18);

        stopObserving.add(
          inView(
            element,
            () => {
              const values = isRevealGroup(element) || element.matches("a, button")
                ? { opacity: [0, 1] }
                : { opacity: [0, 1], y: [12, 0] };
              animate(element, values, {
                duration: 0.4,
                delay,
                ease: "easeOut",
              });
            },
            { margin: "0px 0px -8% 0px" },
          ),
        );
      }
    }

    let frame = 0;
    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });

    scan();
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      if (frame) cancelAnimationFrame(frame);
      stopObserving.forEach((stop) => stop());
    };
  }, []);

  return null;
}

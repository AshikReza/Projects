"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

declare global {
  // keep TypeScript happy about our runtime global
  interface Window {
    __visitedChapters?: Set<string>;
  }
}

export default function ChapterPageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); //  e.g. /subjects/math/paper-1/ch-3

  useEffect(() => {
    // ---------- 1. get / create the in-memory cache ----------
    if (typeof window !== "undefined" && !window.__visitedChapters) {
      window.__visitedChapters = new Set<string>();
    }
    const visitedSet = window.__visitedChapters!;
    const firstTimeHere = !visitedSet.has(pathname);

    // ---------- 2. run GSAP in a context so we can clean up easily ----------
    const ctx = gsap.context(() => {
      const container = mainContainerRef.current;

      if (firstTimeHere && container) {
        /* ----------         A) first-visit entrance  ----------- */
        gsap.fromTo(
          container,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        /* ----------         B) first-visit scroll triggers  ----------- */
        gsap.utils
          .toArray<HTMLElement>(".study-material-card")
          .forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

        const topicsList = document.querySelector(".chapter-topics-list");
        if (topicsList) {
          gsap.fromTo(
            gsap.utils.toArray<HTMLElement>(".chapter-topic-item"),
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.2,
              scrollTrigger: {
                trigger: topicsList,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        // mark this path as “visited” for as long as the app keeps running
        visitedSet.add(pathname);
      } else {
        /* ----------         C) subsequent visits (same tab)  ----------- */
        // no animation – just snap everything to their final states
        gsap.set(container, { opacity: 1, y: 0 });
        gsap.set(".study-material-card", { opacity: 1, y: 0 });
        gsap.set(".chapter-topic-item", { opacity: 1, x: 0 });
      }
    }, mainContainerRef);

    // ---------- 3. cleanup ----------
    return () => ctx.revert();
  }, [pathname]);

  return <div ref={mainContainerRef}>{children}</div>;
}

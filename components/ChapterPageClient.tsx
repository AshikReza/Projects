"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ChapterPageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const container = mainContainerRef.current;

    // Initial animation
    gsap.fromTo(
      container,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Scroll-triggered animations for study materials
    gsap.utils.toArray<HTMLElement>(".study-material-card").forEach((card) => {
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

    // Scroll-triggered animations for chapter topics
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
          stagger: 0.2, // Stagger the animation for each item
          scrollTrigger: {
            trigger: topicsList,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return <div ref={mainContainerRef}>{children}</div>;
}

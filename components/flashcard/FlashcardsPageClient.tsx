"use client";

import { useState, useMemo } from "react";
import { FlashcardContent, Chapter } from "@/lib/types";
import { useLanguage } from "../LanguageProvider";
import SharedSidebar from "../SharedSidebar";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/store/progressStore";
import { Button } from "@/components/ui/button";

// The new "engine" component
import FlashcardInstance from "./FlashcardInstance";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-2 p-1 rounded-md border bg-muted">
      <Button
        size="sm"
        variant={language === "bn" ? "secondary" : "ghost"}
        onClick={() => setLanguage("bn")}
      >
        BN
      </Button>
      <Button
        size="sm"
        variant={language === "en" ? "secondary" : "ghost"}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  );
};

interface FlashcardsPageClientProps {
  chapter: Chapter;
  flashcards: FlashcardContent[];
}

export default function FlashcardsPageClient({
  chapter,
  flashcards,
}: FlashcardsPageClientProps) {
  const ALL_TOPICS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_TOPICS_ID);
  const { completed } = useProgressStore();

  const filteredFlashcards =
    activeTopicId === ALL_TOPICS_ID
      ? flashcards
      : flashcards.filter((fc) => fc.topicId === activeTopicId);

  const progress = useMemo(() => {
    const totalTopics = chapter.topics.length;
    if (totalTopics === 0) return 0;
    const completedTopics = chapter.topics.filter(
      (topic) => completed[`flashcards-${chapter.slug}-${topic.id}`]
    ).length;
    return (completedTopics / totalTopics) * 100;
  }, [completed, chapter.topics, chapter.slug]);

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      <SharedSidebar
        chapter={chapter}
        activeTopicId={activeTopicId}
        onTopicClick={setActiveTopicId}
        showAllOption={true}
        items={flashcards}
        title="Flashcard Topics"
        pageType="flashcards"
      />

      <main className="min-w-0 space-y-4">
        <div className="flex justify-between items-center flex-col-reverse sm:flex-row gap-5">
          <div className="w-full flex-grow">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round(progress)}% of topics completed
            </p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <LanguageSwitcher />
          </div>
        </div>

        {/*
          This is the key to the whole pattern.
          By giving FlashcardInstance a unique key, we ensure React creates a 
          brand new, fresh component with reset state every time the topic changes.
        */}
        <FlashcardInstance
          key={activeTopicId}
          flashcards={filteredFlashcards}
          chapter={chapter}
          activeTopicId={activeTopicId}
        />
      </main>
    </div>
  );
}

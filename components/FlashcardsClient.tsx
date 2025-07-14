"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FlashcardContent, Chapter, BilingualString } from "@/lib/types";
import Flashcard from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";
import SharedSidebar from "./SharedSidebar";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/store/progressStore";

interface FlashcardsClientProps {
  chapter: Chapter;
  flashcards: FlashcardContent[];
}

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

export default function FlashcardsClient({
  chapter,
  flashcards,
}: FlashcardsClientProps) {
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

function FlashcardInstance({
  flashcards,
  chapter,
  activeTopicId,
}: {
  flashcards: FlashcardContent[];
  chapter: Chapter;
  activeTopicId: string;
}) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completed, toggleCompletion } = useProgressStore();

  const completionSlug = `flashcards-${chapter.slug}-${activeTopicId}`;
  const isCompleted = completed[completionSlug];

  const getText = (bilingualString: BilingualString) => {
    return language === "bn" ? bilingualString.bn : bilingualString.en;
  };

  const [showCompletionButton, setShowCompletionButton] = useState(false);

  const goToNext = () => {
    if (flashcards.length === 0) return;
    const nextIndex = (currentIndex + 1) % flashcards.length;
    setCurrentIndex(nextIndex);
    if (nextIndex === flashcards.length - 1) {
      setShowCompletionButton(true);
    }
  };

  const goToPrev = () => {
    if (flashcards.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-md bg-muted/50">
        <p className="text-muted-foreground text-lg">
          {getText({
            bn: "এই টপিকের জন্য কোনো ফ্ল্যাশকার্ড নেই।",
            en: "No flashcards for this topic.",
          })}
        </p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
      <Flashcard
        key={currentCard.id}
        front={getText(currentCard.front)}
        back={getText(currentCard.back)}
      />
      <div className="flex items-center gap-4">
        <Button onClick={goToPrev} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground font-medium">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <Button onClick={goToNext} variant="outline" size="icon">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      {showCompletionButton && (
        <Button
          onClick={() => toggleCompletion(completionSlug)}
          variant={isCompleted ? "secondary" : "default"}
        >
          {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        </Button>
      )}
    </div>
  );
}

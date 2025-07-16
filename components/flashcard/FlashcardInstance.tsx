"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FlashcardContent, Chapter, BilingualString } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../LanguageProvider";
import { useProgressStore } from "@/lib/store/progressStore";
import Flashcard from "./Flashcard";

interface FlashcardInstanceProps {
  flashcards: FlashcardContent[];
  chapter: Chapter;
  activeTopicId: string;
}

export default function FlashcardInstance({
  flashcards,
  chapter,
  activeTopicId,
}: FlashcardInstanceProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completed, toggleCompletion } = useProgressStore();

  const completionSlug = `flashcards-${chapter.slug}-${activeTopicId}`;
  const isCompleted = !!completed[completionSlug];

  const getText = (bilingualString: BilingualString) => {
    return language === "bn" ? bilingualString.bn : bilingualString.en;
  };

  // State to track if the user has reached the end of the deck
  const [showCompletionButton, setShowCompletionButton] = useState(false);

  const goToNext = () => {
    if (flashcards.length === 0) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < flashcards.length) {
      setCurrentIndex(nextIndex);
      // Show the completion button if they land on the last card
      if (nextIndex === flashcards.length - 1) {
        setShowCompletionButton(true);
      }
    } else {
      // Optional: Loop back to the start
      setCurrentIndex(0);
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
          No flashcards for this topic.
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
        <Button
          onClick={goToPrev}
          variant="outline"
          size="icon"
          aria-label="Previous Card"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground font-medium tabular-nums">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          aria-label="Next Card"
        >
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

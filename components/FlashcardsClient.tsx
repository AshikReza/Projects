"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FlashcardContent } from "@/lib/types";
import Flashcard from "@/components/Flashcard"; // This now correctly imports the component from Step 1
import { Button } from "@/components/ui/button";

// This component's prop is the full ARRAY of flashcards.
export default function FlashcardsClient({
  flashcards,
}: {
  flashcards: FlashcardContent[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (flashcards.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const goToPrev = () => {
    if (flashcards.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No flashcards available for this chapter yet.
        </p>
        <Button asChild variant="link" className="mt-4">
          <Link href=".">Back to Chapter</Link>
        </Button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  // This render logic is now correct because <Flashcard> expects these props.
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
      <Flashcard
        key={currentCard.id}
        front={currentCard.front}
        back={currentCard.back}
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
    </div>
  );
}

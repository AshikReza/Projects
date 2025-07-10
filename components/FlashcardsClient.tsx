"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FlashcardContent, Chapter, BilingualString } from "@/lib/types";
import Flashcard from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";
import SharedSidebar from "./SharedSidebar"; // <-- Import the shared component

// Props for the main component
interface FlashcardsClientProps {
  chapter: Chapter;
  flashcards: FlashcardContent[];
}

// Language switcher component
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

// Main Component (The Layout Manager)
export default function FlashcardsClient({
  chapter,
  flashcards,
}: FlashcardsClientProps) {
  const ALL_TOPICS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_TOPICS_ID);

  const filteredFlashcards =
    activeTopicId === ALL_TOPICS_ID
      ? flashcards
      : flashcards.filter((fc) => fc.topicId === activeTopicId);

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* A SINGLE, CLEAN CALL TO THE SHARED SIDEBAR */}
      <SharedSidebar
        chapter={chapter}
        activeTopicId={activeTopicId}
        onTopicClick={setActiveTopicId}
        showAllOption={true}
        items={flashcards}
        title="Flashcard Topics"
      />

      {/* Main Content Area */}
      <main className="min-w-0 space-y-4">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <FlashcardInstance
          key={activeTopicId} // The key is essential to reset the component state
          flashcards={filteredFlashcards}
        />
      </main>
    </div>
  );
}

// The Flashcard Engine Component (manages the current card)
function FlashcardInstance({ flashcards }: { flashcards: FlashcardContent[] }) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getText = (bilingualString: BilingualString) => {
    return language === "bn" ? bilingualString.bn : bilingualString.en;
  };

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
    </div>
  );
}

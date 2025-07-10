"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Menu, Hash } from "lucide-react";
import { FlashcardContent, Chapter, Topic, BilingualString } from "@/lib/types";
import Flashcard from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "./LanguageProvider";
import { cn } from "@/lib/utils";

// New Props for the main component
interface FlashcardsClientProps {
  chapter: Chapter;
  flashcards: FlashcardContent[];
}

// Helper components (TopicList and LanguageSwitcher)
const TopicList = ({
  topics,
  activeTopicId,
  onTopicClick,
}: {
  topics: (Topic & { title_bn?: string })[];
  activeTopicId: string;
  onTopicClick: (topicId: string) => void;
}) => {
  const { language } = useLanguage();
  return (
    <ul className="space-y-1">
      {topics.map((topic) => (
        <li key={topic.id}>
          <button
            onClick={() => onTopicClick(topic.id)}
            className={cn(
              "w-full text-left px-4 py-2.5 rounded-md transition-colors text-sm flex items-center gap-3",
              activeTopicId === topic.id
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Hash className="h-4 w-4 flex-shrink-0" />
            <span className="flex-grow">
              {language === "bn" && topic.title_bn
                ? topic.title_bn
                : topic.title}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredFlashcards =
    activeTopicId === ALL_TOPICS_ID
      ? flashcards
      : flashcards.filter((fc) => fc.topicId === activeTopicId);

  const handleTopicClick = (topicId: string) => {
    setActiveTopicId(topicId);
    setIsSheetOpen(false);
  };

  const displayTopics = [
    { id: ALL_TOPICS_ID, title: "All Topics", title_bn: "সব টপিক" },
    ...chapter.topics.map((topic) => ({
      ...topic,
      title_bn:
        topic.title.split("(")[1]?.replace(")", "").trim() || topic.title,
      title: topic.title.split("(")[0].trim(),
    })),
  ];

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block sticky top-24 self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Flashcard Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicList
              topics={displayTopics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicClick}
            />
          </CardContent>
        </Card>
      </aside>

      {/* Sheet for Mobile */}
      <div className="md:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Menu className="h-5 w-5 mr-3" /> View Topics
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetHeader>
              <SheetTitle className="p-4 text-xl">Flashcard Topics</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <TopicList
                topics={displayTopics}
                activeTopicId={activeTopicId}
                onTopicClick={handleTopicClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="min-w-0 space-y-4">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <FlashcardInstance
          key={activeTopicId}
          flashcards={filteredFlashcards}
        />
      </main>
    </div>
  );
}

// --- The Flashcard Engine Component ---
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

"use client";

import { useState, useMemo } from "react";
import { QuizQuestion, Chapter } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/store/progressStore";
import { Button } from "@/components/ui/button"; // For LanguageSwitcher
import { useLanguage } from "@/components/LanguageProvider";

// Import your existing sidebar
import SharedSidebar from "../SharedSidebar"; // Adjust path if needed

// Import the new quiz instance component
import QuizInstance from "./QuizInstance";

// This can be a shared component, but defined here for simplicity
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

interface QuizPageClientProps {
  chapter: Chapter;
  questions: QuizQuestion[];
}

export default function QuizPageClient({
  chapter,
  questions,
}: QuizPageClientProps) {
  const ALL_QUESTIONS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_QUESTIONS_ID);
  const { completed } = useProgressStore();

  const filteredQuestions =
    activeTopicId === ALL_QUESTIONS_ID
      ? questions
      : questions.filter((q) => q.topicId === activeTopicId);

  const progress = useMemo(() => {
    const totalTopics = chapter.topics.length;
    if (totalTopics === 0) return 0;
    const completedTopics = chapter.topics.filter(
      (topic) => completed[`quiz-${chapter.slug}-${topic.id}`]
    ).length;
    return (completedTopics / totalTopics) * 100;
  }, [completed, chapter.topics, chapter.slug]);

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* Renders your existing SharedSidebar, passing the correct props */}
      <SharedSidebar
        chapter={chapter}
        activeTopicId={activeTopicId}
        onTopicClick={setActiveTopicId}
        showAllOption={true}
        items={questions} // Assuming your sidebar can use this to show topic counts
        title="Quiz Topics"
        pageType="quiz"
      />

      <main className="min-w-0 space-y-4">
        {/* Header with progress and language switcher */}
        <div className="flex justify-between flex-col-reverse items-start gap-4 md:flex-row md:items-center">
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
          The key is CRUCIAL. It tells React to create a new instance of QuizInstance 
          and reset its state whenever the user picks a new topic.
        */}
        <QuizInstance
          key={activeTopicId}
          questions={filteredQuestions}
          chapter={chapter}
          activeTopicId={activeTopicId}
        />
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Chapter, QuizQuestion, Topic } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Hash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/components/LanguageProvider";
import QuizClient from "./QuizClient"; // Your existing quiz component

interface QuizViewProps {
  chapter: Chapter;
  questions: QuizQuestion[];
}

// Re-using the TopicList component structure from your NotesView
const TopicList = ({
  topics,
  activeTopicId,
  onTopicClick,
}: {
  topics: (Topic & { title_bn?: string })[]; // Allow for bilingual titles
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

export default function QuizView({ chapter, questions }: QuizViewProps) {
  const ALL_QUESTIONS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_QUESTIONS_ID);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleTopicClick = (topicId: string) => {
    setActiveTopicId(topicId);
    setIsSheetOpen(false);
  };

  // Filter questions based on the active topic
  const filteredQuestions =
    activeTopicId === ALL_QUESTIONS_ID
      ? questions
      : questions.filter((q) => q.topicId === activeTopicId);

  // Add an "All Topics" option to the list for the sidebar
  const displayTopics = [
    {
      id: ALL_QUESTIONS_ID,
      title: "All Questions",
      title_bn: "সব প্রশ্ন",
    },
    ...chapter.topics.map((topic) => ({
      ...topic,
      // Assuming your topic titles are bilingual like "English (বাংলা)"
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
            <CardTitle className="text-xl">Quiz Topics</CardTitle>
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
              <SheetTitle className="p-4 text-xl">Quiz Topics</SheetTitle>
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
      <main className="min-w-0">
        {/* The key is CRUCIAL. It tells React to re-render and reset the QuizClient state when the topic changes. */}
        <QuizClient
          key={activeTopicId}
          chapter={chapter}
          questions={filteredQuestions}
        />
      </main>
    </div>
  );
}

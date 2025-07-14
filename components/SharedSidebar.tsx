"use client";

import { useState } from "react";
import { Chapter, Topic } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, Menu, CheckCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "./LanguageProvider";
import { useProgressStore } from "@/lib/store/progressStore";
// import { Progress } from "@/components/ui/progress";

// A generic type for any data that has a topicId, so we can count it.
type CountableItem = {
  topicId: string;
};

// Props for our new reusable sidebar
interface SharedSidebarProps {
  chapter: Chapter;
  activeTopicId: string;
  onTopicClick: (topicId: string) => void;
  showAllOption: boolean; // Controls if "All Topics" is shown
  items?: CountableItem[]; // Optional array of items for counting
  title: string; // e.g., "Note Topics", "Quiz Topics"
  pageType: 'notes' | 'flashcards' | 'qa' | 'quiz';
}

// Internal TopicList component for re-use within the sidebar
const TopicList = ({
  topics,
  activeTopicId,
  onTopicClick,
  items,
  chapter,
  pageType
}: Omit<SharedSidebarProps, "showAllOption" | "title"> & {
  topics: (Topic & { title_bn?: string })[];
}) => {
  const { language } = useLanguage();
  const { completed } = useProgressStore();
  const ALL_ID = "all";

  const getCountForTopic = (topicId: string) => {
    if (!items) return null; // Don't show counts if no items are provided
    if (topicId === ALL_ID) return items.length;
    return items.filter((item) => item.topicId === topicId).length;
  };

  return (
    <ul className="space-y-1">
      {topics.map((topic) => {
        const count = getCountForTopic(topic.id);
        const isActive = activeTopicId === topic.id;
        const completionSlug = `${pageType}-${chapter.slug}-${topic.id}`;
        const isCompleted = completed[completionSlug];

        return (
          <li key={topic.id}>
            <button
              onClick={() => onTopicClick(topic.id)}
              disabled={items ? count === 0 && topic.id !== ALL_ID : false}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-md transition-colors text-sm flex items-center justify-between gap-3",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                items && count === 0 && topic.id !== ALL_ID
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {isCompleted ? <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" /> : <Hash className="h-4 w-4 flex-shrink-0" />}
                <span className="flex-grow truncate">
                  {language === "bn" && topic.title_bn
                    ? topic.title_bn
                    : topic.title}
                </span>
              </div>
              {items && count !== null && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full flex-shrink-0",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

// The Main Exported Component that handles both desktop and mobile views
export default function SharedSidebar({
  chapter,
  activeTopicId,
  onTopicClick,
  showAllOption,
  items,
  title,
  pageType
}: SharedSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // const { completed } = useProgressStore();

  const handleTopicSelection = (topicId: string) => {
    onTopicClick(topicId);
    setIsSheetOpen(false);
  };

  const displayTopics = [
    ...(showAllOption
      ? [{ id: "all", title: "All Topics", title_bn: "সব টপিক" }]
      : []),
    ...chapter.topics.map((topic) => ({
      ...topic,
      title_bn:
        topic.title.split("(")[1]?.replace(")", "").trim() || topic.title,
      title: topic.title.split("(")[0].trim(),
    })),
  ];

  // const chapterProgress = useMemo(() => {
  //   const totalTopics = chapter.topics.length;
  //   if (totalTopics === 0) return 0;
  //   const completedTopics = chapter.topics.filter(topic => completed[`${pageType}-${chapter.slug}-${topic.id}`]).length;
  //   return (completedTopics / totalTopics) * 100;
  // }, [completed, chapter.topics, chapter.slug, pageType]);

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (No changes here) */}
      <aside className="hidden md:block sticky top-24 self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            {/* <div className="pt-2">
              <Progress value={chapterProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">{Math.round(chapterProgress)}% completed</p>
            </div> */}
          </CardHeader>
          <CardContent>
            <TopicList
              topics={displayTopics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicSelection}
              items={items}
              chapter={chapter}
              pageType={pageType}
            />
          </CardContent>
        </Card>
      </aside>

      {/* --- 2. MOBILE SIDEBAR (Sheet) - THIS PART IS FIXED --- */}
      <div className="md:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Menu className="h-5 w-5 mr-3" /> View Topics
            </Button>
          </SheetTrigger>
          {/* We turn the SheetContent into a flex column */}
          <SheetContent side="left" className="flex flex-col p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-xl text-left">{title}</SheetTitle>
            </SheetHeader>
            {/* This div grows to fill remaining space and becomes scrollable */}
            <div className="flex-1 overflow-y-auto p-2">
              <TopicList
                topics={displayTopics}
                activeTopicId={activeTopicId}
                onTopicClick={handleTopicSelection}
                items={items}
                chapter={chapter}
                pageType={pageType}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

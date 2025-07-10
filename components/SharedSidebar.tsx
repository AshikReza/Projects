"use client";

import { useState } from "react";
import { Chapter, Topic } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "./LanguageProvider";

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
}

// Internal TopicList component for re-use within the sidebar
const TopicList = ({
  topics,
  activeTopicId,
  onTopicClick,
  items,
}: Omit<SharedSidebarProps, "chapter" | "showAllOption" | "title"> & {
  topics: (Topic & { title_bn?: string })[];
}) => {
  const { language } = useLanguage();
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
                <Hash className="h-4 w-4 flex-shrink-0" />
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
}: SharedSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // The click handler now also closes the sheet on mobile
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

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Static Card) */}
      <aside className="hidden md:block sticky top-24 self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicList
              topics={displayTopics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicSelection}
              items={items}
            />
          </CardContent>
        </Card>
      </aside>

      {/* 2. MOBILE SIDEBAR (Sheet) */}
      <div className="md:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Menu className="h-5 w-5 mr-3" /> View Topics
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-2">
            <SheetHeader>
              <SheetTitle className="p-4 text-xl border-b mb-2">
                {title}
              </SheetTitle>
            </SheetHeader>
            <TopicList
              topics={displayTopics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicSelection}
              items={items}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

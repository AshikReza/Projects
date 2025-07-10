"use client";

import { useState } from "react";
import { Chapter, QAContent, Topic } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useLanguage } from "./LanguageProvider";
import { BilingualText } from "../components/content-blocks/BilingualText";

interface QAClientProps {
  chapter: Chapter;
  qaItems: QAContent[];
}

// Re-usable components for layout and language
const TopicList = ({
  topics,
  activeTopicId,
  onTopicClick,
  qaItems, // <-- Receive the qaItems
}: {
  topics: (Topic & { title_bn?: string })[];
  activeTopicId: string;
  onTopicClick: (topicId: string) => void;
  qaItems: QAContent[]; // <-- Type it here
}) => {
  const { language } = useLanguage();

  // Helper function to calculate count per topic
  const getCountForTopic = (topicId: string) => {
    if (topicId === "all") {
      return qaItems.length; // Total count for "All"
    }
    return qaItems.filter((item) => item.topicId === topicId).length;
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
              disabled={count === 0 && topic.id !== "all"} // Optionally disable if no questions
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-md transition-colors text-sm flex items-center justify-between gap-3",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                count === 0 && topic.id !== "all"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              )}
            >
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">
                  {language === "bn" && topic.title_bn
                    ? topic.title_bn
                    : topic.title}
                </span>
              </div>
              {/* Badge for the count */}
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          </li>
        );
      })}
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
export default function QAClient({ chapter, qaItems }: QAClientProps) {
  const ALL_TOPICS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_TOPICS_ID);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredQAItems =
    activeTopicId === ALL_TOPICS_ID
      ? qaItems
      : qaItems.filter((qa) => qa.topicId === activeTopicId);

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
            <CardTitle className="text-xl">Q&A Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicList
              topics={displayTopics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicClick}
              qaItems={qaItems} // <-- PASS THE PROP HERE
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
              <SheetTitle className="p-4 text-xl">Q&A Topics</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <TopicList
                topics={displayTopics}
                activeTopicId={activeTopicId}
                onTopicClick={handleTopicClick}
                qaItems={qaItems} // <-- AND PASS IT HERE TOO
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

        {filteredQAItems.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredQAItems.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-left">
                  <BilingualText
                    text_bn={item.question.bn}
                    text_en={item.question.en}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <BilingualText
                    text_bn={item.answer.bn}
                    text_en={item.answer.en}
                    className="text-base text-muted-foreground"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <p>No Q&A found for this topic.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

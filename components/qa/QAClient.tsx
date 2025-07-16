"use client";

import { useState, useMemo } from "react";
import { Chapter, QAContent } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../LanguageProvider";
import { BilingualText } from "@/components/content-blocks/BilingualText";
import SharedSidebar from "../SharedSidebar";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/store/progressStore";

interface QAClientProps {
  chapter: Chapter;
  qaItems: QAContent[];
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

export default function QAClient({ chapter, qaItems }: QAClientProps) {
  const ALL_TOPICS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_TOPICS_ID);
  const { completed, toggleCompletion } = useProgressStore();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined
  );
  const [showCompletionButton, setShowCompletionButton] = useState(false);

  const handleAccordionChange = (value: string) => {
    setOpenAccordion(value);
    if (value === filteredQAItems[filteredQAItems.length - 1]?.id) {
      setShowCompletionButton(true);
    }
  };

  const filteredQAItems =
    activeTopicId === ALL_TOPICS_ID
      ? qaItems
      : qaItems.filter((qa) => qa.topicId === activeTopicId);

  const completionSlug = `qa-${chapter.slug}-${activeTopicId}`;
  const isCompleted = completed[completionSlug];

  const progress = useMemo(() => {
    const totalTopics = chapter.topics.length;
    if (totalTopics === 0) return 0;
    const completedTopics = chapter.topics.filter(
      (topic) => completed[`qa-${chapter.slug}-${topic.id}`]
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
        items={qaItems}
        title="Q&A Topics"
        pageType="qa"
      />

      <main className="min-w-0 space-y-4">
        <div className="flex justify-between flex-col-reverse items-center">
          <div className="w-full flex-grow">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round(progress)}% of topics completed
            </p>
          </div>
          <div className="flex items-center gap-2 self-end mb-5">
            <LanguageSwitcher />
          </div>
        </div>

        {filteredQAItems.length > 0 ? (
          <>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              onValueChange={handleAccordionChange}
              value={openAccordion}
            >
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
            {showCompletionButton && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => toggleCompletion(completionSlug)}
                  variant={isCompleted ? "secondary" : "default"}
                >
                  {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
              </div>
            )}
          </>
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

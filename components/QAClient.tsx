"use client";

import { useState } from "react";
import { Chapter, QAContent } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";
import { BilingualText } from "../components/content-blocks/BilingualText";
import SharedSidebar from "./SharedSidebar"; // <-- Import the shared component

interface QAClientProps {
  chapter: Chapter;
  qaItems: QAContent[];
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
export default function QAClient({ chapter, qaItems }: QAClientProps) {
  const ALL_TOPICS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_TOPICS_ID);

  const filteredQAItems =
    activeTopicId === ALL_TOPICS_ID
      ? qaItems
      : qaItems.filter((qa) => qa.topicId === activeTopicId);

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* A SINGLE, CLEAN CALL TO THE SHARED SIDEBAR */}
      <SharedSidebar
        chapter={chapter}
        activeTopicId={activeTopicId}
        onTopicClick={setActiveTopicId}
        showAllOption={true}
        items={qaItems}
        title="Q&A Topics"
      />

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

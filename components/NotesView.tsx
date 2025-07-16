"use client";

import { useState, useMemo } from "react";
import { Chapter, NoteTopic, NoteBlock } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import SharedSidebar from "./SharedSidebar";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/store/progressStore";

// Import all block components
import { DefinitionBlock } from "./content-blocks/DefinitionBlock";
import { ListBlock } from "./content-blocks/ListBlock";
import { ExampleBlock } from "./content-blocks/ExampleBlock";
import { EquationBlock } from "./content-blocks/EquationBlock";
import { TableBlock } from "./content-blocks/TableBlock";
import { CalloutBlock } from "./content-blocks/CalloutBlock";
import { ImportantBlock } from "./content-blocks/ImportantBlock";
import GraphBlock from "./content-blocks/GraphBlock";

interface NotesViewProps {
  chapter: Chapter;
  notes: Record<string, NoteTopic>;
}

export default function NotesView({ chapter, notes }: NotesViewProps) {
  const [activeTopicId, setActiveTopicId] = useState(
    chapter.topics[0]?.id || ""
  );
  const { language, setLanguage } = useLanguage();
  const { completed, toggleCompletion } = useProgressStore();

  const activeTopicData = notes[activeTopicId];

  const completionSlug = `notes-${chapter.slug}-${activeTopicId}`;
  const isCompleted = completed[completionSlug];

  const progress = useMemo(() => {
    const totalTopics = chapter.topics.length;
    if (totalTopics === 0) return 0;
    const completedTopics = chapter.topics.filter(
      (topic) => completed[`notes-${chapter.slug}-${topic.id}`]
    ).length;
    return (completedTopics / totalTopics) * 100;
  }, [completed, chapter.topics, chapter.slug]);

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      <SharedSidebar
        chapter={chapter}
        activeTopicId={activeTopicId}
        onTopicClick={setActiveTopicId}
        showAllOption={false}
        title="Chapter Topics"
        pageType="notes"
      />

      <main className="space-y-2 min-w-0">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mb-4 min-h-[40px]">
          <h1 className="text-2xl font-bold">{activeTopicData?.title}</h1>

          <div className="flex items-center gap-5 mt-1 mb-5">
            <Button
              size="sm"
              variant={isCompleted ? "secondary" : "default"}
              onClick={() => toggleCompletion(completionSlug)}
            >
              {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
            <div className="flex items-center gap-2 p-1 mb-2 rounded-md border bg-muted">
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
          </div>
        </div>

        <div className="mb-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-1">
            {Math.round(progress)}% of topics completed
          </p>
        </div>

        {activeTopicData?.blocks && activeTopicData.blocks.length > 0 ? (
          activeTopicData.blocks.map((block: NoteBlock, index: number) => {
            switch (block.type) {
              case "definition":
                return <DefinitionBlock key={index} {...block} />;
              case "limitations":
                return (
                  <ListBlock
                    key={index}
                    {...block}
                    Icon={XCircle}
                    colorClass="border-red-500"
                  />
                );
              case "successes":
                return (
                  <ListBlock
                    key={index}
                    {...block}
                    Icon={CheckCircle}
                    colorClass="border-green-500"
                  />
                );
              case "example":
                return <ExampleBlock key={index} {...block} />;
              case "equation":
                return <EquationBlock key={index} {...block} />;
              case "table":
                return <TableBlock key={index} {...block} />;
              case "important":
                return <ImportantBlock key={index} {...block} />;
              case "graph":
                return <GraphBlock key={index} {...block} />;
              case "success":
                return (
                  <CalloutBlock
                    key={index}
                    {...block}
                    Icon={CheckCircle}
                    colorClass="border-green-500"
                  />
                );
              default:
                return null;
            }
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <p>No content available for this topic yet.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

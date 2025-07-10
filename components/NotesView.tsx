"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
// Import the specific block type 'NoteBlock' from your types file
import { Chapter, NoteTopic, Topic, NoteBlock } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Hash, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/components/LanguageProvider";

// Import all block components
import { DefinitionBlock } from "./content-blocks/DefinitionBlock";
import { ListBlock } from "./content-blocks/ListBlock";
import { ExampleBlock } from "./content-blocks/ExampleBlock";
import { EquationBlock } from "./content-blocks/EquationBlock";
import { TableBlock } from "./content-blocks/TableBlock";
import { CalloutBlock } from "./content-blocks/CalloutBlock";
import { ImportantBlock } from "./content-blocks/ImportantBlock";

interface NotesViewProps {
  chapter: Chapter;
  notes: Record<string, NoteTopic>;
}

// TopicList component remains the same
const TopicList = ({
  topics,
  activeTopicId,
  onTopicClick,
}: {
  topics: Topic[];
  activeTopicId: string;
  onTopicClick: (topicId: string) => void;
}) => (
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
          <span className="flex-grow">{topic.title}</span>
        </button>
      </li>
    ))}
  </ul>
);

export default function NotesView({ chapter, notes }: NotesViewProps) {
  const [activeTopicId, setActiveTopicId] = useState(
    chapter.topics[0]?.id || ""
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleTopicClick = (topicId: string) => {
    setActiveTopicId(topicId);
    setIsSheetOpen(false);
  };

  const activeTopicData = notes[activeTopicId];

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* Sidebar */}
      <aside className="hidden md:block sticky top-24 self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Chapter Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicList
              topics={chapter.topics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicClick}
            />
          </CardContent>
        </Card>
      </aside>
      <div className="md:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Menu className="h-5 w-5 mr-3" /> View Topics
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetHeader>
              <SheetTitle className="p-4 text-xl">Chapter Topics</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <TopicList
                topics={chapter.topics}
                activeTopicId={activeTopicId}
                onTopicClick={handleTopicClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="space-y-2 min-w-0">
        <div className="flex justify-between items-center mb-4 min-h-[40px]">
          <h1 className="text-2xl font-bold">{activeTopicData?.title}</h1>
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
        </div>

        {activeTopicData?.blocks && activeTopicData.blocks.length > 0 ? (
          // Use your project's 'NoteBlock' type here. This is the key change.
          activeTopicData.blocks.map((block: NoteBlock, index: number) => {
            // The switch statement now works perfectly without any errors.
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

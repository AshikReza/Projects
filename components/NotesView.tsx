"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Chapter, NoteContent, Topic } from "@/lib/types";
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

// Block components now include the Markdown Renderer
import { DefinitionBlock } from "./content-blocks/DefinitionBlock";
import { ImportantBlock } from "./content-blocks/ImportantBlock";
import { FormulaBlock } from "./content-blocks/FormulaBlock";
import { DataTableBlock } from "./content-blocks/DataTableBlock";
import { MarkdownRenderer } from "./content-blocks/MarkdownRenderer";

interface NotesViewProps {
  chapter: Chapter;
  notes: NoteContent;
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

  const handleTopicClick = (topicId: string) => {
    setActiveTopicId(topicId);
    setIsSheetOpen(false);
  };

  const noteBlocks = (notes as any)[activeTopicId] || [];

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* Sidebar */}
      <aside className="hidden md:block sticky top-24 self-start">
        <Card>
          <CardHeader>
            {" "}
            <CardTitle className="text-xl">Chapter Topics</CardTitle>{" "}
          </CardHeader>
          <CardContent>
            {" "}
            <TopicList
              topics={chapter.topics}
              activeTopicId={activeTopicId}
              onTopicClick={handleTopicClick}
            />{" "}
          </CardContent>
        </Card>
      </aside>
      <div className="md:hidden mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {" "}
              <Menu className="h-5 w-5 mr-3" /> View Topics{" "}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetHeader>
              {" "}
              <SheetTitle className="p-4 text-xl">
                Chapter Topics
              </SheetTitle>{" "}
            </SheetHeader>
            <div className="py-4">
              {" "}
              <TopicList
                topics={chapter.topics}
                activeTopicId={activeTopicId}
                onTopicClick={handleTopicClick}
              />{" "}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="space-y-4">
        {noteBlocks.length > 0 ? (
          noteBlocks.map((block: any, index: number) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2
                    key={index}
                    className="text-2xl font-semibold border-b pb-2 mt-6 mb-4"
                  >
                    {block.content}
                  </h2>
                );

              case "markdown":
                return <MarkdownRenderer key={index} content={block.content} />;

              case "definition":
                return <DefinitionBlock key={index} content={block.content} />;

              case "important":
                return <ImportantBlock key={index} content={block.content} />;

              case "formula":
                return <FormulaBlock key={index} content={block.content} />;

              case "dataTable":
                return (
                  <DataTableBlock
                    key={index}
                    headers={block.headers}
                    rows={block.rows}
                  />
                );

              default:
                return null;
            }
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <p>Select a topic from the sidebar to view the notes.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

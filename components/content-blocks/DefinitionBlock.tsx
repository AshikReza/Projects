import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownRenderer } from "./MarkdownRenderer"; // <-- Import

export const DefinitionBlock = ({ content }: { content: string }) => (
  <Card className="bg-blue-500/10 border-l-4 border-blue-500">
    <CardContent className="p-4 flex items-start gap-4">
      <BookOpen className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />
      <MarkdownRenderer content={content} className="text-sm" />
    </CardContent>
  </Card>
);

import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownRenderer } from "./MarkdownRenderer"; // <-- Import

export const ImportantBlock = ({ content }: { content: string }) => (
  <Card className="bg-amber-500/10 border-l-4 border-amber-500">
    <CardContent className="p-4 flex items-start gap-4">
      <Lightbulb className="h-5 w-5 mt-1 text-amber-600 flex-shrink-0" />
      <MarkdownRenderer content={content} className="text-sm" />
    </CardContent>
  </Card>
);

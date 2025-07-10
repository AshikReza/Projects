import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BilingualText } from "./BilingualText";

// Define the component's props based on the updated type
interface DefinitionBlockProps {
  title: string;
  text_bn: string;
  text_en: string;
  examples: { bn: string; en: string }[];
}

export const DefinitionBlock = ({
  title,
  text_bn,
  text_en,
  examples,
}: DefinitionBlockProps) => (
  <Card className="bg-blue-950/30 border-l-4 border-blue-500 my-4">
    <CardHeader className="py-3 px-4 flex-row items-center gap-3 space-y-0">
      <BookOpen className="h-5 w-5 text-blue-400 flex-shrink-0" />
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      {/* Main definition text */}
      <BilingualText
        text_bn={text_bn}
        text_en={text_en}
        className="text-sm text-muted-foreground"
      />

      {/* Render examples if they exist */}
      {examples && examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-500/20">
          <h4 className="text-sm font-semibold mb-3 text-blue-300">
            Examples:
          </h4>
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-blue-400 font-mono text-sm pt-0.5">
                  {index + 1}.
                </span>
                <BilingualText
                  text_bn={example.bn}
                  text_en={example.en}
                  className="text-sm text-muted-foreground flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

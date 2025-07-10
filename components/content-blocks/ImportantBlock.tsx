import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "./BilingualText";
import { Separator } from "@/components/ui/separator";
import { ImportantBlockType } from "@/lib/types";

export const ImportantBlock = ({
  title,
  text_bn,
  text_en,
  examples,
}: ImportantBlockType) => (
  <Card className="bg-amber-950/30 border-l-4 border-amber-500 my-4">
    <CardHeader className="py-3 px-4 flex-row items-center gap-3 space-y-0">
      <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0" />
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      {/* Main block text */}
      <BilingualText
        text_bn={text_bn}
        text_en={text_en}
        className="text-sm text-muted-foreground"
      />

      {/* Conditionally render examples if they exist */}
      {examples && examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-amber-500/20">
          <h4 className="text-sm font-semibold mb-3 text-amber-300">
            Related Q&A:
          </h4>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-3 bg-amber-500/20" />}
                <BilingualText
                  text_bn={example.bn}
                  text_en={example.en}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

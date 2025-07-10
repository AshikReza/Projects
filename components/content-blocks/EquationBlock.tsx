import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Import Separator
import { BilingualText } from "./BilingualText";
import { BlockMath } from "react-katex";
import { EquationBlockType } from "@/lib/types"; // Import the full type for clarity

export const EquationBlock = ({
  title,
  equation,
  description_bn,
  description_en,
  examples, // Accept the new examples prop
}: EquationBlockType) => (
  <Card className="my-4">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Existing equation and description */}
      <div className="text-lg md:text-xl p-4 my-2 rounded-md bg-muted/50 flex justify-center items-center overflow-x-auto">
        <BlockMath math={equation} />
      </div>
      <BilingualText
        text_bn={description_bn}
        text_en={description_en}
        className="text-xs text-muted-foreground italic"
      />

      {/* Conditionally render examples if they exist */}
      {examples && examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-muted-foreground/20">
          <h4 className="text-sm font-semibold mb-3">Related Q&A:</h4>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-3 bg-muted/50" />}
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

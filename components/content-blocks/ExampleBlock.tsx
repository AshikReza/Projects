import { Beaker } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "./BilingualText";
import { Separator } from "@/components/ui/separator";

export const ExampleBlock = ({
  title,
  examples,
}: {
  title: string;
  examples: { bn: string; en: string }[];
}) => (
  <Card className="bg-green-950/30 border-l-4 border-green-500 my-4">
    <CardHeader className="py-3 px-4 flex-row items-center gap-3 space-y-0">
      <Beaker className="h-5 w-5 text-green-400 flex-shrink-0" />
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-2 space-y-4">
      {examples.map((example, index) => (
        <div key={index}>
          {index > 0 && <Separator className="my-4 bg-green-500/20" />}
          <BilingualText
            text_bn={example.bn}
            text_en={example.en}
            className="text-sm"
          />
        </div>
      ))}
    </CardContent>
  </Card>
);

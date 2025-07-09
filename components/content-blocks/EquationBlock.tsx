import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "./BilingualText";
import { BlockMath } from "react-katex";

export const EquationBlock = ({
  title,
  equation,
  description_bn,
  description_en,
}: {
  title: string;
  equation: string;
  description_bn: string;
  description_en: string;
}) => (
  <Card className="my-4">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-lg md:text-xl p-4 my-2 rounded-md bg-muted/50 flex justify-center items-center overflow-x-auto">
        <BlockMath math={equation} />
      </div>
      <BilingualText
        text_bn={description_bn}
        text_en={description_en}
        className="text-xs text-muted-foreground italic"
      />
    </CardContent>
  </Card>
);

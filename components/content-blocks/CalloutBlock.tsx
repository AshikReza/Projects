import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "./BilingualText";
import { LucideIcon } from "lucide-react";

export const CalloutBlock = ({
  title,
  text_bn,
  text_en,
  Icon,
  colorClass,
}: {
  title: string;
  text_bn: string;
  text_en: string;
  Icon: LucideIcon;
  colorClass: string;
}) => (
  <Card className={`${colorClass}/20 border-l-4 ${colorClass} my-4`}>
    <CardHeader className="py-3 px-4 flex-row items-center gap-3 space-y-0">
      <Icon
        className={`h-5 w-5 ${colorClass.replace(
          "border-",
          "text-"
        )} flex-shrink-0`}
      />
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0 pl-11">
      <BilingualText
        text_bn={text_bn}
        text_en={text_en}
        className="text-sm text-muted-foreground"
      />
    </CardContent>
  </Card>
);

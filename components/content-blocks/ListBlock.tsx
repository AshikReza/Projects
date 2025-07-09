import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualText } from "./BilingualText";
import { LucideIcon } from "lucide-react";

export const ListBlock = ({
  title,
  items,
  Icon,
  colorClass,
}: {
  title: string;
  items: { bn: string; en: string }[];
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
      <ul className="list-disc list-outside space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <BilingualText
              text_bn={item.bn}
              text_en={item.en}
              className="text-sm text-muted-foreground"
            />
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
